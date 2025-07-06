"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Menu, Bell, Heart, Globe, ChevronDown, X, Calendar, AlertTriangle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Mock translation hook (as provided in your original Header.tsx)
const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const translate = useCallback((key: string) => key, []);

  const setLanguage = useCallback((lang: string) => {
    console.log("Setting language:", lang);
    setCurrentLanguage(lang);
  }, []);

  return { translate, currentLanguage, setLanguage };
};

// LanguageSwitcher component (as provided in your original Header.tsx)
interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
  ];

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
        className="flex items-center space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">{currentLanguage.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/80 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>{lang.name}</span>
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
  const { translate, currentLanguage, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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
      <div className="fixed top-0 w-full h-20 bg-gradient-to-r from-white/95 via-blue-50/95 to-indigo-50/95 backdrop-blur-xl border-b border-white/20 z-40"></div>

      <header className="fixed top-0 w-full z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 h-20">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              // FIX: This is the problematic line. You pass a function to setIsSidebarOpen,
              // but HeaderProps defines setIsSidebarOpen as expecting a boolean.
              // We should pass the direct boolean value to toggle it.
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>

            {/* Logo */}
            <button onClick={() => navigate("/dashboard")} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-violet-700 group-hover:to-indigo-700 transition-all duration-200">
                CareLink
              </span>
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={setLanguage} />

            {/* Notifications */}
            <div className="relative">
              <button
                ref={bellButtonRef}
                onClick={toggleNotifications}
                className="relative p-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                aria-label="View notifications"
                aria-expanded={isNotificationsOpen}
                aria-haspopup="true"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
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
                          className={`px-6 py-4 border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors duration-200 cursor-pointer ${
                            !notification.read ? "bg-blue-50/30" : ""
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
          </div>
        </div>
      </header>
    </div>
  );
}