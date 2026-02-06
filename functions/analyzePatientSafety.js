/**
 * CareLinks V2.0 - Safety Monitor Agent
 * Cloud Function for analyzing patient vitals and symptoms using Gemini AI
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Define secret for Gemini API key
// This will be securely injected from GitHub Secrets via Cloud Build
const geminiApiKey = defineSecret("GEMINI_API_KEY");

/**
 * Analyzes patient vitals and symptoms for medical red flags
 * @param {Object} data - Request data
 * @param {string[]} data.symptoms - Array of patient symptoms
 * @param {Object} data.vitals - Patient vital signs
 * @param {number} data.vitals.temperature - Temperature in °F
 * @param {string} data.vitals.bloodPressure - Blood pressure (e.g., "120/80")
 * @param {number} data.vitals.heartRate - Heart rate in bpm
 * @param {string} data.patientId - Patient document ID
 * @returns {Promise<Object>} Safety analysis result
 */
exports.analyzePatientSafety = onCall(
  { secrets: [geminiApiKey] }, // Declare secret dependency
  async (request) => {
    const { data, auth } = request;

    // Authentication check
    if (!auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated to analyze patient safety."
      );
    }

    // Validate required fields
    if (!data.symptoms || !data.vitals || !data.patientId) {
      throw new HttpsError(
        "invalid-argument",
        "Missing required fields: symptoms, vitals, or patientId"
      );
    }

    const { symptoms, vitals, patientId } = data;

    try {
      // Verify user owns this patient record
      const patientRef = admin.firestore()
        .collection("patients")
        .doc(patientId);

      const patientDoc = await patientRef.get();

      if (!patientDoc.exists) {
        throw new HttpsError(
          "not-found",
          "Patient record not found"
        );
      }

      const patientData = patientDoc.data();
      if (patientData.userId !== auth.uid) {
        throw new HttpsError(
          "permission-denied",
          "You do not have permission to analyze this patient"
        );
      }

      // Access the secret value
      const apiKey = geminiApiKey.value();
      if (!apiKey) {
        logger.error("GEMINI_API_KEY secret not configured");
        throw new HttpsError(
          "failed-precondition",
          "AI service not configured. Please contact administrator."
        );
      }

      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Construct safety analysis prompt
      const prompt = `You are a medical safety monitoring AI assistant for community health workers.

Analyze the following patient data and identify any medical red flags or emergency indicators:

**Symptoms:** ${symptoms.join(", ")}

**Vital Signs:**
- Temperature: ${vitals.temperature}°F
- Blood Pressure: ${vitals.bloodPressure}
- Heart Rate: ${vitals.heartRate} bpm

**Task:** 
1. Determine if this is a medical emergency requiring immediate attention
2. Identify specific red flags or concerning patterns
3. Provide a clear recommendation for the community health worker

**Response Format (JSON only, no markdown):**
{
  "isEmergency": true/false,
  "redFlags": ["specific red flag 1", "specific red flag 2"],
  "recommendation": "Clear, actionable recommendation for the CHW"
}

**Guidelines:**
- Consider vital sign thresholds (e.g., fever >100.4°F, high BP >140/90, tachycardia >100 bpm)
- Look for symptom combinations indicating serious conditions
- Be conservative - err on the side of caution
- Keep recommendations practical for CHW context
- If no red flags, return empty array and reassuring recommendation

Respond with ONLY the JSON object, no additional text.`;

      logger.info("Analyzing patient safety", {
        patientId,
        userId: auth.uid,
        symptomsCount: symptoms.length,
      });

      // Call Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let responseText = response.text();

      // Clean up response (remove markdown code blocks if present)
      responseText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Parse JSON response
      let safetyAnalysis;
      try {
        safetyAnalysis = JSON.parse(responseText);
      } catch (parseError) {
        logger.error("Failed to parse Gemini response", {
          error: parseError.message,
          responseText,
        });
        throw new HttpsError(
          "internal",
          "Failed to parse AI response. Please try again."
        );
      }

      // Validate response structure
      if (
        typeof safetyAnalysis.isEmergency !== "boolean" ||
        !Array.isArray(safetyAnalysis.redFlags) ||
        typeof safetyAnalysis.recommendation !== "string"
      ) {
        logger.error("Invalid response structure from Gemini", { safetyAnalysis });
        throw new HttpsError(
          "internal",
          "Invalid AI response format. Please try again."
        );
      }

      // Log successful analysis
      logger.info("Safety analysis completed", {
        patientId,
        isEmergency: safetyAnalysis.isEmergency,
        redFlagsCount: safetyAnalysis.redFlags.length,
      });

      // Return structured response
      return {
        success: true,
        analysis: {
          isEmergency: safetyAnalysis.isEmergency,
          redFlags: safetyAnalysis.redFlags,
          recommendation: safetyAnalysis.recommendation,
        },
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      // Handle specific error types
      if (error instanceof HttpsError) {
        throw error;
      }

      // Log unexpected errors
      logger.error("Unexpected error in analyzePatientSafety", {
        error: error.message,
        stack: error.stack,
        patientId,
        userId: auth.uid,
      });

      throw new HttpsError(
        "internal",
        "An unexpected error occurred during safety analysis. Please try again."
      );
    }
  }
);

