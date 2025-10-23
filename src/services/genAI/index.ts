import { env } from '../../config/env';

interface GeminiResponse {
    text: string;
    confidence: number;
}

export async function generateGeminiResponse(message: string, messages?: any[], customApiKey?: string): Promise<string> {
    try {
        // Use custom API key if provided, otherwise fall back to env variable
        const apiKey = customApiKey || env.GEMINI_API_KEY;

        console.log('🔑 API Key check:', {
            hasCustomKey: !!customApiKey,
            hasEnvKey: !!env.GEMINI_API_KEY,
            keyLength: apiKey ? apiKey.length : 0,
            keyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'none'
        });

        // Check if any API key is available
        if (!apiKey) {
            console.warn('❌ No API key available, using fallback response');
            return getFallbackResponse(message);
        }

        console.log('🚀 Making API call to Gemini...');

        // Use direct API call - CORS will be handled by browser settings or extensions in development
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        console.log('🌐 API URL:', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors', // Explicitly set CORS mode
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are CareBot, a helpful healthcare assistant for Community Health Workers (CHWs) in India. 

Guidelines:
- Provide helpful, accurate health information
- Always remind users to consult healthcare professionals for serious concerns
- Be empathetic and supportive
- Keep responses concise but informative
- Focus on preventive care and wellness
- If asked about emergencies, always advise to seek immediate medical help

User question: ${message}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Gemini API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            return getFallbackResponse(message);
        }

        const data = await response.json();
        console.log('📦 API Response:', data);

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            console.log('✅ AI Response received:', aiResponse.substring(0, 100) + '...');
            return aiResponse;
        } else {
            console.error('❌ Unexpected Gemini API response format:', data);
            return getFallbackResponse(message);
        }

    } catch (error) {
        console.error('💥 Error calling Gemini API:', error);

        // Check if it's a CORS error
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            console.error('🚫 CORS Error detected. This is expected in development.');
            console.log('💡 Solutions:');
            console.log('1. Install a CORS browser extension (recommended for development)');
            console.log('2. Use Chrome with --disable-web-security flag');
            console.log('3. The app will work normally when deployed to production');
        }

        return getFallbackResponse(message);
    }
}

// Test function to verify API key works
export async function testGeminiAPI(apiKey: string): Promise<boolean> {
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "Say hello"
                    }]
                }]
            })
        });

        console.log('🧪 API Test Response:', response.status);
        return response.ok;
    } catch (error) {
        console.error('🧪 API Test Failed:', error);
        return false;
    }
}

function getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Health-related responses
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
        return "For fever management:\n• Rest and stay hydrated\n• Monitor temperature regularly\n• Seek medical care if fever persists over 3 days or exceeds 103°F\n• For children, consult a doctor sooner\n\n⚠️ This is general information. Please consult a healthcare professional for proper diagnosis.";
    }

    if (lowerMessage.includes('cough') || lowerMessage.includes('cold')) {
        return "For cough and cold:\n• Stay hydrated with warm fluids\n• Rest adequately\n• Use honey for soothing (not for children under 1 year)\n• Maintain good hygiene\n• Seek medical care if symptoms worsen or persist\n\n⚠️ Consult a healthcare professional if you have difficulty breathing or high fever.";
    }

    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
        return "For headache relief:\n• Rest in a quiet, dark room\n• Stay hydrated\n• Apply cold or warm compress\n• Gentle neck and shoulder massage\n• Avoid triggers like stress or certain foods\n\n⚠️ Seek immediate medical attention for severe, sudden headaches or those with vision changes.";
    }

    if (lowerMessage.includes('stomach') || lowerMessage.includes('diarrhea') || lowerMessage.includes('vomit')) {
        return "For stomach issues:\n• Stay hydrated with ORS or clear fluids\n• Eat bland foods (BRAT diet: Bananas, Rice, Applesauce, Toast)\n• Rest and avoid dairy temporarily\n• Maintain hygiene\n\n⚠️ Seek medical care for severe dehydration, blood in stool, or persistent symptoms.";
    }

    if (lowerMessage.includes('vaccination') || lowerMessage.includes('vaccine')) {
        return "About vaccinations:\n• Follow the recommended vaccination schedule\n• Keep vaccination records updated\n• Vaccines are safe and effective\n• Consult your healthcare provider for specific vaccine questions\n• Report any adverse reactions\n\n📋 Use our vaccination tracking feature to stay on schedule!";
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
        return "🚨 FOR MEDICAL EMERGENCIES:\n• Call emergency services immediately (108 in India)\n• Don't delay seeking professional help\n• Stay calm and follow emergency protocols\n\nThis chat is for general health guidance only, not emergency situations.";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm CareBot, your healthcare assistant. I'm here to help with general health questions, wellness tips, and care guidance for Community Health Workers.\n\nHow can I assist you today? You can ask about:\n• Common health symptoms\n• Preventive care tips\n• Vaccination schedules\n• General wellness advice";
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're welcome! I'm glad I could help. Remember, I'm here whenever you need health guidance or have questions about patient care.\n\n💙 Stay healthy and keep up the great work as a Community Health Worker!";
    }

    // Default response - this means the AI API is not working
    console.warn('🤖 Using fallback response for:', message);
    return "I understand you're asking about health-related concerns. While I can provide general health information, I recommend consulting with a qualified healthcare professional for personalized medical advice.\n\nFor specific symptoms or conditions, please:\n• Consult a doctor or healthcare provider\n• Visit a nearby health center\n• Call a medical helpline if urgent\n\n⚠️ This chat provides general information only and is not a substitute for professional medical advice.\n\n🔧 Note: AI responses are currently using fallback mode. Check browser console for debugging info.";
}

// Export the summary generator as well
export { generatePatientSummary } from './summaryGenerator';