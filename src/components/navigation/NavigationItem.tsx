import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

export default function NavigationItem({
  icon,
  label,
  to,
  isCollapsed,
  onClick
}: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center w-full px-4 py-3 my-1 rounded-xl transition-all duration-300 group overflow-hidden ${isActive
          ? 'bg-blue-50 text-indigo-700'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator (Left Border) */}
          {isActive && (
            <motion.div
              layoutId="activeNavIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Icon */}
          <div className={`relative flex-shrink-0 transition-colors duration-300 ${isCollapsed ? 'mx-auto' : 'mr-4'} ${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}`}>
            {icon}
          </div>

          {/* Label */}
          {!isCollapsed && (
            <span className="text-sm font-medium truncate">{label}</span>
          )}

          {/* Hover Effect Background (Framer Motion) */}
          <motion.div
            className="absolute inset-0 bg-slate-100/50 z-[-1]"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          />
        </>
      )}
    </NavLink>
  );
}