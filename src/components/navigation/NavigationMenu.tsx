import { useState, useEffect } from 'react';
import { Home, Users, Calendar, MessageSquare, FileSpreadsheet, BarChart2, UserPlus, Syringe } from 'lucide-react';
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
    collaboration: 'Collaboration',
    childVaccinations: 'Child Vaccinations'
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
        collaboration: await translate('Collaboration'),
        childVaccinations: await translate('Child Vaccinations')
      };
      setLabels(translatedLabels);
    };

    translateLabels();
  }, [translate]);

  const navItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: labels.dashboard,
      path: '/dashboard',
      category: 'main'
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: labels.patients,
      path: '/patients',
      category: 'main'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: labels.appointments,
      path: '/appointments',
      category: 'main'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: labels.chat,
      path: '/chat',
      category: 'main'
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5" />,
      label: labels.dataCollection,
      path: '/data-collection',
      category: 'tools'
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: labels.analytics,
      path: '/analytics',
      category: 'tools'
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: labels.collaboration,
      path: '/collaboration',
      category: 'tools'
    },
    {
      icon: <Syringe className="w-5 h-5" />,
      label: labels.childVaccinations,
      path: '/child-vaccinations',
      category: 'tools'
    }
  ];

  return (
    <aside
      className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:static lg:translate-x-0 z-20 bg-white shadow-lg border-r border-gray-100 h-[calc(100vh-3.5rem)] transition-all duration-300 ease-in-out w-full max-w-[280px] lg:w-72 flex-shrink-0`}
    >
      <nav className="p-4 space-y-6 overflow-y-auto h-full nav-scrollbar">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navItems.filter(item => item.category === 'main').map((item, index) => (
            <div
              key={item.path}
              className="animate-slideInLeft"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <NavigationItem
                icon={item.icon}
                label={item.label}
                isCollapsed={false}
                isActive={currentPath === item.path}
                onClick={() => onNavigate(item.path)}
              />
            </div>
          ))}
        </div>

        {/* Tools & Analytics */}
        <div className="space-y-1">
          <div className="px-3 py-2 animate-slideInLeft" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tools & Analytics
            </h3>
          </div>
          {navItems.filter(item => item.category === 'tools').map((item, index) => (
            <div
              key={item.path}
              className="animate-slideInLeft"
              style={{ animationDelay: `${250 + (index * 50)}ms` }}
            >
              <NavigationItem
                icon={item.icon}
                label={item.label}
                isCollapsed={false}
                isActive={currentPath === item.path}
                onClick={() => onNavigate(item.path)}
              />
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}