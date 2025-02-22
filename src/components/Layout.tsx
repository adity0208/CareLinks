import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationMenu from './navigation/NavigationMenu';
import Header from './navigation/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Handle sidebar close event
  useEffect(() => {
    const handleCloseSidebar = () => {
      setIsSidebarOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('closeSidebar', handleCloseSidebar);
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('closeSidebar', handleCloseSidebar);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex pt-14">
        <NavigationMenu
          isSidebarOpen={isSidebarOpen}
          currentPath={location.pathname}
          onNavigate={handleNavigation}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 transition-all duration-300 ease-in-out">
          <div className="animate-fadeIn">
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