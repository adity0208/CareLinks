/**
 * CareLinks Chat Cloud Function
 * 
 * Handles secure chat sessions with AI-powered clinical interviewing
 * and structured patient data extraction.
 */

const { onCall } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

// Define the secret for Gemini API key
const geminiApiKey = defineSecret("GEMINI_API_KEY");

/**
 * System prompt for clinical interviewing with structured extraction
 */
const CLINICAL_INTERVIEWER_PROMPT = `You are a Clinical Interviewer AI for CareLinks, assisting Community Health Workers (CHWs) in rural India.

YOUR ROLE:
- Ask ONE focused question at a time to gather History of Present Illness (HPI)
- Be empathetic, culturally sensitive, and use simple language
- Extract clinical entities from user responses
- Identify red flags that require immediate medical attention

RESPONSE FORMAT:
For EVERY response, you must provide TWO parts:

1. A conversational message to the user (natural, empathetic)
2. A JSON extraction block (hidden from user, for system processing)

EXTRACTION JSON FORMAT:
\`\`\`json
{
  "symptoms": ["fever", "cough", "headache"],
  "vitals": {
    "temperature": 101.5,
    "bloodPressure": "140/90",
    "heartRate": 95
  },
  "riskLevel": "moderate",
  "redFlags": ["high fever >3 days", "difficulty breathing"]
}
\`\`\`

RISK LEVEL CRITERIA:
- "low": Minor symptoms, no concerning signs
- "moderate": Persistent symptoms, needs monitoring
- "high": Concerning symptoms, recommend doctor visit
- "critical": Emergency signs, immediate medical attention required

RED FLAGS (always flag these):
- Difficulty breathing or shortness of breath
- Chest pain or pressure
- Severe headache with vision changes
- High fever (>103°F) for >3 days
- Severe dehydration
- Altered mental status
- Severe abdominal pain
- Blood in stool/vomit/urine

IMPORTANT RULES:
1. Always end your message with the JSON block wrapped in \`\`\`json ... \`\`\`
2. If no clinical data mentioned yet, use empty arrays/objects
3. Accumulate data from previous messages in the conversation
4. Be conservative with risk levels - err on the side of caution
5. For emergencies, immediately set riskLevel to "critical"

Example Response:
"I understand your patient has a fever. How long has the fever been present, and what is the highest temperature you've recorded?

\`\`\`json
{
  "symptoms": ["fever"],
  "vitals": {},
  "riskLevel": "low",
  "redFlags": []
}
\`\`\`"`;

/**
 * Parse extraction JSON from AI response
 */
function parseExtraction(aiResponse) {
    try {
        // Extract JSON block from response
        const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);

        if (!jsonMatch) {
            logger.warn("No JSON extraction found in response");
            return {
                symptoms: [],
                vitals: {},
                riskLevel: "low",
                redFlags: []
            };
        }

        const extractedData = JSON.parse(jsonMatch[1]);

        // Validate structure
        return {
            symptoms: Array.isArray(extractedData.symptoms) ? extractedData.symptoms : [],
            vitals: extractedData.vitals || {},
            riskLevel: extractedData.riskLevel || "low",
            redFlags: Array.isArray(extractedData.redFlags) ? extractedData.redFlags : []
        };
    } catch (error) {
        logger.error("Error parsing extraction JSON:", error);
        return {
            symptoms: [],
            vitals: {},
            riskLevel: "low",
            redFlags: []
        };
    }
}

/**
 * Remove JSON block from user-facing message
 */
function cleanMessage(aiResponse) {
    return aiResponse.replace(/```json\s*[\s\S]*?\s*```/g, '').trim();
}

/**
 * Handle chat session with structured extraction
 * 
 * @param {Object} request - Contains message and conversationHistory
 * @returns {Object} - Contains message, extraction, and timestamp
 */
exports.handleChatSession = onCall(
    {
        secrets: [geminiApiKey],
        cors: [
            'https://carelinks-fccc4.web.app',
            'https://carelinks-fccc4.firebaseapp.com',
            /localhost:\d+/,
            /127\.0\.0\.1:\d+/
        ]
    },
    async (request) => {
        const { message, conversationHistory = [] } = request.data;

        // Validate input
        if (!message || typeof message !== 'string') {
            throw new Error("Invalid message provided");
        }

        // Check authentication
        if (!request.auth) {
            throw new Error("User must be authenticated");
        }

        logger.info("Chat session started", {
            userId: request.auth.uid,
            messageLength: message.length,
            historyLength: conversationHistory.length
        });

        try {
            // Initialize Gemini AI
            const genAI = new GoogleGenerativeAI(geminiApiKey.value());
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            });

            // Build conversation context
            const conversationContext = conversationHistory
                .slice(-10) // Keep last 10 messages for context
                .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message}`)
                .join('\n\n');

            // Create prompt with context
            const fullPrompt = `${CLINICAL_INTERVIEWER_PROMPT}

CONVERSATION HISTORY:
${conversationContext}

CURRENT USER MESSAGE:
${message}

YOUR RESPONSE (remember to include JSON extraction):`;

            // Generate response
            const result = await model.generateContent(fullPrompt);
            const aiResponse = result.response.text();

            logger.info("AI response generated", {
                responseLength: aiResponse.length
            });

            // Parse extraction and clean message
            const extraction = parseExtraction(aiResponse);
            const cleanedMessage = cleanMessage(aiResponse);

            // Return structured response
            return {
                message: cleanedMessage,
                extraction: extraction,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            logger.error("Error in chat session:", error);

            // Return error response with safe fallback
            return {
                message: "I apologize, but I'm having trouble processing your request right now. Please try again, or if this is urgent, please seek immediate medical attention.",
                extraction: {
                    symptoms: [],
                    vitals: {},
                    riskLevel: "low",
                    redFlags: []
                },
                timestamp: new Date().toISOString(),
                error: error.message
            };
        }
    }
);
