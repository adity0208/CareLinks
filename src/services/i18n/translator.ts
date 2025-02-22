import { TranslationResponse } from '../../types/i18n';

// Mock Google Cloud Translation API
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock translations for demo purposes
  const mockTranslations: Record<string, Record<string, string>> = {
    'Hello! How can I assist you with patient care today?': {
      hi: 'नमस्ते! आज मैं आपकी मरीज़ की देखभाल में कैसे मदद कर सकता हूं?',
      bn: 'হ্যালো! আজ আমি রোগীর যত্নে আপনাকে কীভাবে সহায়তা করতে পারি?',
      ta: 'வணக்கம்! இன்று நோயாளி பராமரிப்பில் நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?'
    }
  };

  return {
    translatedText: mockTranslations[text]?.[targetLanguage] || text,
    detectedLanguage: {
      code: sourceLanguage || 'en',
      confidence: 0.95
    }
  };
}