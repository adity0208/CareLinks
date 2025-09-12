import { useState, useEffect, useRef } from 'react';
import { optimizedFirestoreService, AppointmentData } from '../services/firebase/optimizedFirestore';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';

export const useAppointmentData = () => {
    const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const requestInProgress = useRef(false);

    const fetchAppointments = async () => {
        if (!currentUser || requestInProgress.current) {
            if (!currentUser) {
                setAppointmentData([]);
                setLoading(false);
            }
            return;
        }

        requestInProgress.current = true;
        setLoading(true);

        try {
            const data = await optimizedFirestoreService.getAppointmentData(currentUser.uid);
            setAppointmentData(data);
            setError(null);
        } catch (err: any) {
            logger.error('Error fetching appointment data', err);
            setError('Failed to load appointment data. Please try again.');
        } finally {
            setLoading(false);
            requestInProgress.current = false;
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [currentUser]);

    const refreshAppointments = async () => {
        if (!currentUser || requestInProgress.current) return;

        requestInProgress.current = true;
        setLoading(true);

        try {
            optimizedFirestoreService.clearUserCache(currentUser.uid);
            const data = await optimizedFirestoreService.getAppointmentData(currentUser.uid);
            setAppointmentData(data);
            setError(null);
        } catch (err: any) {
            logger.error('Error refreshing appointment data', err);
            setError('Failed to refresh appointment data.');
        } finally {
            setLoading(false);
            requestInProgress.current = false;
        }
    };

    return { appointmentData, loading, error, refreshAppointments };
};