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
}

export interface VoiceInputResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}