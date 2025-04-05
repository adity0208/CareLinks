// hooks/useTranslation.ts
import { useState, useCallback } from 'react';
import { create } from 'zustand';
import { translateText } from '../services/i18n/translator';
import { supportedLanguages } from '../services/i18n/languages';
import { Language, TranslationError } from '../types/i18n';

interface TranslationStore {
  currentLanguage: string;
  isLoading: boolean;
  error: TranslationError | null;
  setLanguage: (language: Language) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: TranslationError | null) => void;
}

const useTranslationStore = create<TranslationStore>((set) => ({
  currentLanguage: localStorage.getItem('preferredLanguage') || 'en',
  isLoading: false,
  error: null,
  setLanguage: (language) => {
    localStorage.setItem('preferredLanguage', language.code);
    set({ currentLanguage: language.code });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));

export function useTranslation() {
  const { currentLanguage, isLoading, error, setLanguage, setLoading, setError } = useTranslationStore();
  const [translations] = useState(new Map<string, string>());

  const translate = useCallback(async (text: string): Promise<string> => {
    if (currentLanguage === 'en') return text;

    const cacheKey = `${text}_${currentLanguage}`;
    if (translations.has(cacheKey)) {
      return translations.get(cacheKey)!;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await translateText(text, currentLanguage);
      translations.set(cacheKey, result.translatedText);

      return result.translatedText;
    } catch (err) {
      const translationError =
        err instanceof TranslationError
          ? err
          : new TranslationError('TRANSLATION_FAILED', 'Failed to translate text');
      setError(translationError);
      return text;
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, setLoading, setError]);

  return {
    currentLanguage,
    setLanguage,
    translate,
    supportedLanguages,
    isLoading,
    error,
  };
}
