import React from 'react';

interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

export default function NavigationItem({
  icon,
  label,
  isCollapsed,
  isActive,
  onClick
}: NavigationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 group text-left overflow-hidden ${isActive
        ? 'bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-indigo-500/10 text-blue-700 shadow-lg shadow-blue-500/10 border border-blue-200/50 backdrop-blur-sm'
        : 'hover:bg-gradient-to-r hover:from-slate-50/80 hover:via-white/50 hover:to-slate-50/80 text-slate-700 hover:text-slate-900 hover:shadow-lg hover:shadow-slate-200/50 hover:border hover:border-white/50 hover:backdrop-blur-sm'
        }`}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"></div>
      )}

      {/* Hover glow effect */}
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${isActive
        ? 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-100'
        : 'bg-gradient-to-r from-blue-500/0 to-indigo-500/0 opacity-0 group-hover:opacity-100'
        }`}></div>

      <div className={`relative flex-shrink-0 transition-all duration-300 ${isActive
          ? 'text-blue-600 scale-110'
          : 'text-slate-500 group-hover:text-slate-700 group-hover:scale-105'
        }`}>
        {icon}
      </div>

      {!isCollapsed && (
        <span className={`relative ml-4 text-sm font-semibold leading-5 min-w-0 flex-1 transition-all duration-300 ${isActive
            ? 'text-blue-700'
            : 'text-slate-700 group-hover:text-slate-900'
          }`}>
          {label}
        </span>
      )}

      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
    </button>
  );
}