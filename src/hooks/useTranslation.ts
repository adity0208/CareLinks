import { useState, useCallback, useEffect } from 'react';
import { translateText } from '../services/i18n/translator';
import { supportedLanguages } from '../services/i18n/languages';
import { Language } from '../types/i18n';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  const setLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language.code);
    localStorage.setItem('preferredLanguage', language.code);
  }, []);

  const [translations, setTranslations] = useState<Record<string, string>>({});

  const translate = useCallback((text: string): string => {
    if (currentLanguage === 'en') return text;
    return translations[text] || text;
  }, [currentLanguage, translations]);

  useEffect(() => {
    const translateTexts = async () => {
      const textsToTranslate = Object.keys(translations);
      if (currentLanguage === 'en' || textsToTranslate.length === 0) return;

      try {
        const results = await Promise.all(
          textsToTranslate.map(text => translateText(text, currentLanguage))
        );
        const newTranslations = textsToTranslate.reduce((acc, text, index) => {
          acc[text] = results[index].translatedText;
          return acc;
        }, {} as Record<string, string>);
        setTranslations(newTranslations);
      } catch (error) {
        console.error('Translation failed:', error);
      }
    };

    translateTexts();
  }, [currentLanguage]);

  // Sync language with localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage && storedLanguage !== currentLanguage) {
      setCurrentLanguage(storedLanguage);
    }
  }, []);

  return {
    currentLanguage,
    setLanguage,
    translate,
    supportedLanguages
  };
}