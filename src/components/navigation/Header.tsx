"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Menu, Heart, Globe, ChevronDown, LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "../../hooks/useTranslation"
import { useAuth } from "../../contexts/AuthContext"
import NotificationDropdown from "../notifications/NotificationDropdown"

// LanguageSwitcher component
interface LanguageSwitcherProps {
  currentLanguage: string;
  supportedLanguages: Array<{ code: string; name: string; nativeName: string }>;
  onLanguageChange: (lang: any) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, supportedLanguages, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700 hidden sm:inline">
          {supportedLanguages.find(lang => lang.code === currentLanguage)?.name || currentLanguage.toUpperCase()}
        </span>
        <span className="text-sm font-medium text-slate-700 sm:hidden">
          {currentLanguage.toUpperCase()}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center justify-between hover:bg-slate-50/80 ${currentLanguage === lang.code ? 'bg-blue-50/50 text-blue-700' : 'text-slate-700'
                }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{lang.name}</span>
                <span className="text-xs text-slate-500">{lang.nativeName}</span>
              </div>
              {currentLanguage === lang.code && (
                <CheckCircle className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface HeaderProps {
  isSidebarOpen: boolean;
  // This prop expects a direct boolean value, not a functional updater.
  setIsSidebarOpen: (isOpen: boolean) => void;
}



export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const { translate, currentLanguage, setLanguage, supportedLanguages } = useTranslation();
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Background with gradient */}
      <div className="fixed top-0 w-full h-14 bg-gradient-to-r from-white/95 via-blue-50/95 to-indigo-50/95 backdrop-blur-xl border-b border-white/30 z-40 shadow-sm"></div>

      <header className="fixed top-0 w-full z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 h-14">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`lg:hidden p-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isSidebarOpen ? 'bg-white shadow-xl scale-105' : ''
                }`}
              aria-label="Toggle navigation"
            >
              <Menu className={`w-5 h-5 transition-colors duration-200 ${isSidebarOpen ? 'text-blue-600' : 'text-slate-600'
                }`} />
            </button>

            {/* Logo */}
            <button onClick={() => navigate("/dashboard")} className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-1.5 sm:p-2 rounded-xl">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-violet-700 group-hover:to-indigo-700 transition-all duration-200">
                CareLink
              </span>
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              supportedLanguages={supportedLanguages}
              onLanguageChange={setLanguage}
            />

            {/* Real-time Notifications */}
            <NotificationDropdown />

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-800">{userProfile?.displayName || currentUser?.email}</p>
                  <p className="text-xs text-gray-500">{userProfile?.clinicName}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{userProfile?.displayName}</p>
                        <p className="text-sm text-gray-600">{userProfile?.role}</p>
                        <p className="text-xs text-gray-500">{userProfile?.clinicName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={async () => {
                        try {
                          await logout();
                          setIsUserMenuOpen(false);
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}