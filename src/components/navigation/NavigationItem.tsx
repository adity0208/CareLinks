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
      className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 group text-left ${isActive
        ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:shadow-sm'
        }`}
    >
      <div className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
        {icon}
      </div>
      {!isCollapsed && (
        <span className="ml-3 text-sm font-medium leading-5 min-w-0 flex-1">
          {label}
        </span>
      )}
    </button>
  );
}