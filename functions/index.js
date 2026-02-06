/**
 * CareLinks Cloud Functions
 * 
 * Import function triggers from their respective submodules:
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest, onCall } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");

// Health check endpoint
exports.healthCheck = onRequest((request, response) => {
    logger.info("Health check requested", { structuredData: true });
    response.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "CareLinks API"
    });
});

// Example function for future AI integration
exports.processPatientData = onCall((request) => {
    logger.info("Processing patient data", { structuredData: true });

    // This is a placeholder for future AI processing
    // Will integrate with Gemini API for health insights

    return {
        success: true,
        message: "Patient data processed successfully",
        timestamp: new Date().toISOString()
    };
});

// Trigger when a new patient is created
exports.onPatientCreated = onDocumentCreated("patients/{patientId}", (event) => {
    const patientData = event.data.data();
    logger.info("New patient created", {
        patientId: event.params.patientId,
        patientName: patientData?.name,
        structuredData: true
    });

    // Future: Send welcome notifications, setup default records, etc.
    return null;
});

// V2.0: Safety Monitor Agent
const { analyzePatientSafety } = require("./analyzePatientSafety");
exports.analyzePatientSafety = analyzePatientSafety;

// V2.1: Secure Multi-Agent Chat System
const { handleChatSession } = require("./handleChatSession");
exports.handleChatSession = handleChatSession;

