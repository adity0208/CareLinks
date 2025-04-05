export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: {
    code: string;
    confidence: number;
  };
  fromCache?: boolean;
}

export interface VoiceInputResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class TranslationError extends Error {
  constructor(
    public code: 'UNSUPPORTED_LANGUAGE' | 'TRANSLATION_FAILED' | 'NETWORK_ERROR',
    message: string
  ) {
    super(message);
    this.name = 'TranslationError';
  }
}