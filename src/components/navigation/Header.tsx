"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Menu, Bell, Heart, Globe, ChevronDown, X, Calendar, AlertTriangle, CheckCircle, LogOut, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "../../hooks/useTranslation"
import { useAuth } from "../../contexts/AuthContext"

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

interface Notification {
  id: string;
  type: "info" | "warning" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "info",
    title: "New Appointment",
    message: "Appointment scheduled with John Doe for tomorrow at 10:00 AM",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Patient Alert",
    message: "Patient Jane Smith requires immediate attention",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Lab Results",
    message: "Lab results for Mike Johnson are now available",
    time: "1 hour ago",
    read: true,
  },
];

export default function Header({ isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const { translate, currentLanguage, setLanguage, supportedLanguages } = useTranslation();
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const notificationRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleNotifications = useCallback(() => {
    setIsNotificationsOpen((prev) => !prev);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const getNotificationIcon = useCallback((type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  }, []);

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

            {/* Notifications */}
            <div className="relative">
              <button
                ref={bellButtonRef}
                onClick={toggleNotifications}
                className={`relative p-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isNotificationsOpen ? 'bg-white shadow-xl scale-105' : ''
                  }`}
                aria-label="View notifications"
                aria-expanded={isNotificationsOpen}
                aria-haspopup="true"
              >
                <Bell className={`w-5 h-5 transition-colors duration-200 ${unreadCount > 0 ? 'text-blue-600' : 'text-slate-600'
                  }`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div
                  ref={notificationRef}
                  className="absolute right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={toggleNotifications}
                          className="p-1 hover:bg-slate-200/50 rounded-lg transition-colors duration-200"
                          aria-label="Close notifications"
                        >
                          <X className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 font-medium">No notifications</p>
                        <p className="text-sm text-slate-400">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-6 py-4 border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors duration-200 cursor-pointer ${!notification.read ? "bg-blue-50/30" : ""
                            }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-800 truncate">{notification.title}</p>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                              <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-3 border-t border-slate-200/50">
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          navigate("/notifications");
                        }}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      >
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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