import { useState, useEffect } from 'react';
import { Home, Users, Calendar, MessageSquare, FileSpreadsheet, BarChart2, UserPlus } from 'lucide-react'; // Import UserPlus
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
  const [labels, setLabels] = useState({
    dashboard: 'Dashboard',
    patients: 'Patients',
    appointments: 'Appointments',
    chat: 'Chat',
    dataCollection: 'Data Collection',
    analytics: 'Analytics',
    collaboration: 'Collaboration' // Add the Collaboration label
  });

  useEffect(() => {
    const translateLabels = async () => {
      const translatedLabels = {
        dashboard: await translate('Dashboard'),
        patients: await translate('Patients'),
        appointments: await translate('Appointments'),
        chat: await translate('Chat'),
        dataCollection: await translate('Data Collection'),
        analytics: await translate('Analytics'),
        collaboration: await translate('Collaboration') // Add the Collaboration translation
      };
      setLabels(translatedLabels);
    };

    translateLabels();
  }, [translate]);

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: labels.dashboard, path: '/dashboard' },
    { icon: <Users className="w-5 h-5" />, label: labels.patients, path: '/patients' },
    { icon: <Calendar className="w-5 h-5" />, label: labels.appointments, path: '/appointments' },
    { icon: <MessageSquare className="w-5 h-5" />, label: labels.chat, path: '/chat' },
    { icon: <FileSpreadsheet className="w-5 h-5" />, label: labels.dataCollection, path: '/data-collection' },
    { icon: <BarChart2 className="w-5 h-5" />, label: labels.analytics, path: '/analytics' },
    { icon: <UserPlus className="w-5 h-5" />, label: labels.collaboration, path: '/collaboration' } // Add the Collaboration item
  ];

  return (
    <aside
      className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-20 bg-white shadow-sm h-[calc(100vh-3.5rem)] transition-transform duration-300 ease-in-out w-full max-w-[250px] lg:w-64`}
    >
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavigationItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            isCollapsed={false}
            isActive={currentPath === item.path}
            onClick={() => onNavigate(item.path)}
          />
        ))}
      </nav>
    </aside>
  );
}