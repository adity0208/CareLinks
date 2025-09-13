import React, { useState, useRef, useEffect } from 'react';
import {
    Bell,
    X,
    Check,
    CheckCheck,
    Trash2,
    AlertTriangle,
    Users,
    Calendar,
    Building2,
    Activity,
    Clock
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import type { Notification } from '../../services/notificationService';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'new_patient':
                return <Users className="w-5 h-5 text-blue-600" />;
            case 'high_risk_patient':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'ngo_registration':
                return <Building2 className="w-5 h-5 text-emerald-600" />;
            case 'appointment_reminder':
                return <Calendar className="w-5 h-5 text-purple-600" />;
            case 'system_alert':
                return <Activity className="w-5 h-5 text-amber-600" />;
            default:
                return <Bell className="w-5 h-5 text-slate-600" />;
        }
    };

    const getPriorityColor = (priority: Notification['priority']) => {
        switch (priority) {
            case 'critical':
                return 'border-l-red-500 bg-red-50/50';
            case 'high':
                return 'border-l-orange-500 bg-orange-50/50';
            case 'medium':
                return 'border-l-blue-500 bg-blue-50/50';
            case 'low':
                return 'border-l-slate-500 bg-slate-50/50';
            default:
                return 'border-l-slate-300 bg-white';
        }
    };

    const formatTimeAgo = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const recentNotifications = notifications.slice(0, 10); // Show only recent 10

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative bg-white/80 backdrop-blur-sm border border-white/20 p-3 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
                <Bell className={`w-5 h-5 transition-colors duration-200 ${unreadCount > 0 ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-700'
                    }`} />

                {/* Notification Badge */}
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 max-h-[600px] overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
                                <p className="text-sm text-slate-600">
                                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
                                        title="Mark all as read"
                                    >
                                        <CheckCheck className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                                >
                                    <X className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {recentNotifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="bg-gradient-to-r from-slate-100 to-blue-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-slate-400 mx-auto" />
                                </div>
                                <h4 className="text-slate-700 font-medium mb-2">No notifications</h4>
                                <p className="text-slate-500 text-sm">You're all caught up! New notifications will appear here.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200/50">
                                {recentNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-slate-50/50 transition-colors duration-200 border-l-4 ${getPriorityColor(notification.priority)} ${!notification.isRead ? 'bg-blue-50/30' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-slate-800' : 'text-slate-600'
                                                            }`}>
                                                            {notification.title}
                                                        </h4>
                                                        <p className={`text-sm mt-1 ${!notification.isRead ? 'text-slate-700' : 'text-slate-500'
                                                            }`}>
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <Clock className="w-3 h-3 text-slate-400" />
                                                            <span className="text-xs text-slate-500">
                                                                {formatTimeAgo(notification.timestamp)}
                                                            </span>
                                                            {notification.priority === 'critical' && (
                                                                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                                                    Critical
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-1 ml-2">
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
                                                                title="Mark as read"
                                                            >
                                                                <Check className="w-3 h-3 text-blue-600 group-hover:text-blue-700" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors duration-200 group"
                                                            title="Delete notification"
                                                        >
                                                            <Trash2 className="w-3 h-3 text-slate-400 group-hover:text-red-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 10 && (
                        <div className="p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50">
                            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                                View all {notifications.length} notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}