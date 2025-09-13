import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationMenu from './navigation/NavigationMenu';
import Header from './navigation/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  // Handle sidebar close event
  useEffect(() => {
    const handleCloseSidebar = () => {
      setIsSidebarOpen(false);
    };

    window.addEventListener('closeSidebar', handleCloseSidebar);
    return () => {
      window.removeEventListener('closeSidebar', handleCloseSidebar);
    };
  }, []);

  // Always render the full layout for authenticated users

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/3 to-teal-400/3 rounded-full blur-3xl"></div>
      </div>

      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="relative pt-14 min-h-[calc(100vh-3.5rem)]">
        <NavigationMenu
          isSidebarOpen={isSidebarOpen}
          currentPath={location.pathname}
          onNavigate={handleNavigation}
        />

        {/* Main Content */}
        <main className="lg:ml-72 p-4 md:p-6 min-w-0 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>

        {/* Enhanced Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm z-10 lg:hidden transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}