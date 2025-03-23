import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from '../../hooks/useTranslation';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const { translate, currentLanguage, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellButtonRef.current && !bellButtonRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            CareLink
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            onLanguageChange={setLanguage}
          />
          <div className="relative">
            <button
              ref={bellButtonRef}
              onClick={toggleNotifications}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
              aria-label="View notifications"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10 border border-gray-200">
                <div className="py-2">
                  {/* Example notifications - replace with actual data */}
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>New appointment scheduled</span>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500">•</span>
                      <span>Patient John Doe requires attention</span>
                    </div>
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">•</span>
                      <span>Medication adherence alert</span>
                    </div>
                  </a>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-center border-t border-gray-200">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-150">
                    View All Notifications
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}