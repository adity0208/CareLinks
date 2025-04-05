import React, { createContext, useState } from 'react';
import { Language } from '../../types/i18n';

const availableLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr' },
];

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  translateAsync: (key: string) => Promise<string>;
}

export const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(availableLanguages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const translateAsync = async (key: string): Promise<string> => {
    // Replace with actual translation API logic
    return key;
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, translateAsync }}>
      {children}
    </TranslationContext.Provider>
  );
};
