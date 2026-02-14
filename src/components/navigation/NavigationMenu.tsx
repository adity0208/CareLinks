import { useState, useEffect } from 'react';
import { Home, Users, Calendar, MessageSquare, Activity, User, LogOut, Settings } from 'lucide-react';
import NavigationItem from './NavigationItem';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationMenuProps {
  isSidebarOpen: boolean;
  onNavigate: (path: string) => void;
}

export default function NavigationMenu({
  isSidebarOpen,
  onNavigate
}: NavigationMenuProps) {
  const { currentUser, userProfile, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { translate } = useTranslation();
  const [labels, setLabels] = useState({
    dashboard: 'Dashboard',
    patients: 'Patients',
    appointments: 'Appointments',
    chat: 'Chat',
    analytics: 'Analytics',
    childVaccinations: 'Child Vaccinations'
  });

  useEffect(() => {
    const translateLabels = async () => {
      const translatedLabels = {
        dashboard: await translate('Dashboard'),
        patients: await translate('Patients'),
        appointments: await translate('Appointments'),
        chat: await translate('Chat'),
        analytics: await translate('Analytics'),
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
      icon: <Activity className="w-5 h-5" />,
      label: labels.analytics,
      path: '/analytics',
      category: 'tools'
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: labels.childVaccinations,
      path: '/child-vaccinations',
      category: 'tools'
    }
  ];

  return (
    <aside
      className={`
        fixed z-40 top-14 left-0
        bg-white/80 backdrop-blur-xl border-r border-indigo-50/50 
        h-[calc(100vh-3.5rem)] w-full max-w-[280px] lg:w-72 flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none'}
        transition-transform duration-300 ease-in-out lg:transition-none
      `}
    >
      <nav className="flex flex-col h-full p-4 overflow-y-auto nav-scrollbar">
        {/* User Profile Section - Mobile: Top (order-first), Desktop: Bottom (order-last) */}
        <div className="lg:order-last lg:mt-auto mb-6 lg:mb-0">
          <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-xl border border-indigo-100/50 overflow-hidden">
            {/* Profile Header */}
            <div
              className="p-3 cursor-pointer hover:bg-white/40 transition-colors"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {userProfile?.displayName || currentUser?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-indigo-600 font-medium capitalize truncate">
                    {userProfile?.role === 'chw' ? 'Community Health Worker' : userProfile?.role || 'Guest'}
                  </p>
                </div>
                <div className={`transform transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}>
                  <Settings className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Profile Menu */}
            {showProfileMenu && (
              <div className="border-t border-indigo-100/50 bg-white/30">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Settings logic
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-all"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await logout();
                      } catch (error) {
                        console.error('Logout error:', error);
                      }
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation - Mobile: Bottom (order-last), Desktop: Top (order-first) */}
        <div className="flex-1 lg:order-first space-y-6">
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform</p>
            {navItems.filter(item => item.category === 'main').map((item) => (
              <NavigationItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                to={item.path}
                isCollapsed={false}
                onClick={() => onNavigate(item.path)}
              />
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tools</p>
            {navItems.filter(item => item.category === 'tools').map((item) => (
              <NavigationItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                to={item.path}
                isCollapsed={false}
                onClick={() => onNavigate(item.path)}
              />
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}