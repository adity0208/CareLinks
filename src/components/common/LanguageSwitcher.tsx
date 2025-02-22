import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../../types/i18n';
import { supportedLanguages } from '../../services/i18n/languages';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      >
        <Globe className="w-5 h-5" />
        <span>{supportedLanguages.find(lang => lang.code === currentLanguage)?.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <span className="block text-sm">{language.nativeName}</span>
              <span className="block text-xs text-gray-500">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}