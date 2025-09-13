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
      className={`
        fixed z-20 top-14 left-0
        bg-gradient-to-b from-white/95 via-white/90 to-slate-50/95 
        backdrop-blur-xl shadow-2xl border-r border-white/20 
        h-[calc(100vh-3.5rem)] w-full max-w-[280px] lg:w-72 flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out lg:transition-none
      `}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 pointer-events-none"></div>

      <nav className="relative p-6 space-y-8 overflow-y-auto h-full nav-scrollbar">
        {/* Main Navigation */}
        <div className="space-y-2">
          {navItems.filter(item => item.category === 'main').map((item) => (
            <NavigationItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isCollapsed={false}
              isActive={currentPath === item.path}
              onClick={() => onNavigate(item.path)}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/60"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-white via-slate-50 to-white px-4">
              <div className="w-8 h-px bg-gradient-to-r from-blue-400 to-indigo-400"></div>
            </div>
          </div>
        </div>

        {/* Tools & Analytics */}
        <div className="space-y-2">
          {navItems.filter(item => item.category === 'tools').map((item) => (
            <NavigationItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isCollapsed={false}
              isActive={currentPath === item.path}
              onClick={() => onNavigate(item.path)}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="pt-8">
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Healthcare Hub</p>
                <p className="text-xs text-slate-500">Modern Interface</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}