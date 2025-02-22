import { Home, Users, Calendar, MessageSquare, FileSpreadsheet, BarChart2 } from 'lucide-react';
import NavigationItem from './NavigationItem';
import { useTranslation } from '../../hooks/useTranslation';

interface NavigationMenuProps {
  isSidebarOpen: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function NavigationMenu({ 
  isSidebarOpen, 
  currentPath, 
  onNavigate 
}: NavigationMenuProps) {
  const { translate } = useTranslation();
  
  const handleNavigation = (path: string) => {
    // Close sidebar first on mobile
    if (window.innerWidth < 1024) {
      const event = new CustomEvent('closeSidebar');
      window.dispatchEvent(event);
    }
    // Navigate after a small delay to ensure smooth transition
    requestAnimationFrame(() => {
      onNavigate(path);
    });
  };

  const navItems = [
    { icon: <Home />, label: translate('Dashboard'), path: '/dashboard' },
    { icon: <Users />, label: translate('Patients'), path: '/patients' },
    { icon: <Calendar />, label: translate('Appointments'), path: '/appointments' },
    { icon: <MessageSquare />, label: translate('Chat'), path: '/chat' },
    { icon: <FileSpreadsheet />, label: translate('Data Collection'), path: '/data-collection' },
    { icon: <BarChart2 />, label: translate('Analytics'), path: '/analytics' }
  ];

  return (
    <aside
      className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:static lg:translate-x-0 z-20 bg-white shadow-sm h-[calc(100vh-3.5rem)] transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavigationItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            isCollapsed={!isSidebarOpen}
            isActive={currentPath === item.path}
            onClick={() => handleNavigation(item.path)}
          />
        ))}
      </nav>
    </aside>
  );
}