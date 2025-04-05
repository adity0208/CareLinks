// services/i18n/translator.ts
import { TranslationResponse } from '../../types/i18n';

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage = 'en'
): Promise<TranslationResponse> {
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATION_API_KEY;

  if (!apiKey) {
    throw new Error('Google Translation API key is missing.');
  }

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(
      `Translation API Error: ${data.error?.message || 'Unknown error'}`
    );
  }

  return {
    translatedText: data.data.translations[0].translatedText,
    detectedLanguage: {
      code: data.data.translations[0].detectedSourceLanguage || sourceLanguage,
      confidence: 0.95, // Still mocked as the API doesn't return confidence
    },
  };
}
