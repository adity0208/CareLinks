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
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'hover:bg-gray-100'
      }`}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </button>
  );
}