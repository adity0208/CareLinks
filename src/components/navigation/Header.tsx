import React from 'react';
import { Menu, Bell } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from '../../hooks/useTranslation';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const { translate, currentLanguage, setLanguage } = useTranslation();

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-blue-600">CareLink</h1>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher 
            currentLanguage={currentLanguage}
            onLanguageChange={setLanguage}
          />
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}