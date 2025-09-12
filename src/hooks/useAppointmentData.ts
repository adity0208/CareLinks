import { useState, useEffect } from 'react';
import { AppointmentData, firestoreService } from '../services/firebase/firestore';

export const useAppointmentData = () => {
    const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const data = await firestoreService.getAppointmentData();
            setAppointmentData(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching appointment data:', err);
            setError('Failed to load appointment data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const refreshAppointments = () => {
        fetchAppointments();
    };

    return { appointmentData, loading, error, refreshAppointments };
};