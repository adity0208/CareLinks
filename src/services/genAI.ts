// src/services/genAI.ts

import { ChatMessage, Patient } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// Healthcare-focused system prompt
const HEALTHCARE_SYSTEM_PROMPT = `You are CareBot, a helpful healthcare assistant for the CareLinks platform. You provide general health information and guidance but always remind users to consult healthcare professionals for medical advice.

Guidelines:
- Provide helpful, accurate health information
- Always emphasize consulting healthcare professionals for medical decisions
- Be empathetic and supportive
- Focus on preventive care and wellness
- If asked about serious symptoms, recommend immediate medical attention
- Keep responses concise but informative
- Use a warm, professional tone

Remember: You provide information only, not medical diagnosis or treatment.`;

// Enhanced AI: Healthcare-focused chatbot
export async function generateGeminiResponse(prompt: string, conversationHistory: ChatMessage[] = []): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 500,
      }
    });

    // Build conversation context
    const context = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message}`)
      .join('\n');

    const fullPrompt = `${HEALTHCARE_SYSTEM_PROMPT}

Previous conversation:
${context}

Current user message: ${prompt}

Please respond as CareBot:`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    // Ensure response is healthcare-appropriate
    if (!response || response.length < 10) {
      return "I'm here to help with your health questions. Could you please provide more details about what you'd like to know?";
    }

    return response;
  } catch (error) {
    console.error('Gemini API error:', error);

    // Provide helpful fallback responses
    const fallbackResponses = [
      "I'm experiencing some technical difficulties right now. For immediate health concerns, please contact your healthcare provider or emergency services.",
      "I'm temporarily unavailable. If you have urgent health questions, please consult with a medical professional.",
      "Sorry, I'm having trouble connecting right now. For health emergencies, please call emergency services immediately."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

// Simulated AI: Care Plan Generator
export async function generateCarePlan(patient: Patient): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return `Based on ${patient.name}'s medical history and current condition:

1. Primary Focus Areas:
   - ${patient.medicalHistory}
   - Regular monitoring of vital signs
   - Medication adherence support

2. Recommended Actions:
   - Weekly blood pressure checks
   - Monthly wellness check-ins
   - Dietary and exercise guidance

3. Support Services:
   - Connect with community resources
   - Family education sessions
   - Transportation assistance if needed`;
}

// Simulated AI: Guidelines by condition
export async function generateHealthGuidelines(condition: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const guidelines: Record<string, string> = {
    diabetes: `Diabetes Management Guidelines:
1. Blood sugar monitoring schedule
2. Proper medication timing
3. Diet modifications
4. Exercise recommendations
5. Regular foot examinations`,

    hypertension: `Hypertension Management:
1. Daily blood pressure monitoring
2. Sodium intake restrictions
3. Regular physical activity
4. Stress management techniques
5. Medication compliance importance`
  };

  return guidelines[condition.toLowerCase()] || 'No specific guidelines available for this condition.';
}

// Simulated AI: Symptom Analyzer
export async function analyzeSymptoms(symptoms: string[]): Promise<{
  analysis: string;
  urgency: 'low' | 'medium' | 'high';
  recommendations: string[];
}> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  return {
    analysis: 'Based on the reported symptoms, this appears to be a mild respiratory infection.',
    urgency: 'medium',
    recommendations: [
      'Rest and hydration',
      'Monitor temperature',
      'Seek immediate care if symptoms worsen',
      'Follow up with primary care provider within 48 hours'
    ]
  };
}
