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
    <div className="min-h-screen bg-gray-50">
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex pt-14 min-h-[calc(100vh-3.5rem)]">
        <NavigationMenu
          isSidebarOpen={isSidebarOpen}
          currentPath={location.pathname}
          onNavigate={handleNavigation}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out min-w-0">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            {children}
          </div>
        </main>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}