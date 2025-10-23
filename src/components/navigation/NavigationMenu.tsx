import { useState, useEffect } from 'react';
import { Home, Users, Calendar, MessageSquare, BarChart2, Syringe, User, LogOut, Settings, Shield } from 'lucide-react';
import NavigationItem from './NavigationItem';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';

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
      icon: <BarChart2 className="w-5 h-5" />,
      label: labels.analytics,
      path: '/analytics',
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

        {/* User Profile Section */}
        <div className="pt-8 mt-auto">
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-white/30 overflow-hidden">
            {/* Profile Header */}
            <div
              className="p-4 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {userProfile?.displayName || currentUser?.displayName || 'User'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-xs text-slate-600 capitalize">
                      {userProfile?.role === 'chw' ? 'Community Health Worker' :
                        userProfile?.role === 'doctor' ? 'Doctor' :
                          userProfile?.role === 'nurse' ? 'Nurse' :
                            userProfile?.role === 'admin' ? 'Administrator' : 'User'}
                    </p>
                  </div>
                </div>
                <div className={`transform transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Profile Menu */}
            {showProfileMenu && (
              <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Add profile settings navigation here
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>

                  {userProfile?.role === 'chw' && (
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <Shield className="w-3 h-3 text-green-600" />
                        <span className="text-green-700 font-medium">Verified CHW</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {userProfile?.clinicName || 'Healthcare Provider'}
                      </p>
                    </div>
                  )}

                  {userProfile?.role !== 'chw' && (
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-yellow-700 font-medium">Pending Approval</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Account under review
                      </p>
                    </div>
                  )}

                  <div className="border-t border-white/20 pt-1 mt-2">
                    <button
                      onClick={async () => {
                        try {
                          await logout();
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}