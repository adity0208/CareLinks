import { useState, useEffect } from 'react';
import { notificationService, type Notification } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        // Subscribe to notification updates
        const unsubscribe = notificationService.subscribe((updatedNotifications) => {
            setNotifications(updatedNotifications);
            setUnreadCount(notificationService.getUnreadCount());
            setIsLoading(false);
        });

        // Initial load
        setNotifications(notificationService.getNotifications());
        setUnreadCount(notificationService.getUnreadCount());
        setIsLoading(false);

        // Check for new patients periodically if user is logged in
        let intervalId: NodeJS.Timeout;
        if (currentUser) {
            intervalId = setInterval(() => {
                notificationService.checkForNewPatients(currentUser.uid);
            }, 60000); // Check every minute
        }

        return () => {
            unsubscribe();
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [currentUser]);

    const markAsRead = (notificationId: string) => {
        notificationService.markAsRead(notificationId);
    };

    const markAllAsRead = () => {
        notificationService.markAllAsRead();
    };

    const deleteNotification = (notificationId: string) => {
        notificationService.deleteNotification(notificationId);
    };

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
        notificationService.addNotification({
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date()
        });
    };

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification
    };
};