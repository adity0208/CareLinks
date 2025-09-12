import { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';
import { optimizedFirestoreService } from '../services/firebase/optimizedFirestore';
import { useAuth } from '../contexts/AuthContext';

export const useAnalyticsData = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        pendingAppointments: 0,
        totalPatients: 0,
        childVaccinations: 0,
        healthcareCamps: 8 // This remains static as it's not stored in Firestore
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch patients and appointments data for the current user
                const [patients, appointments, children] = await Promise.all([
                    optimizedFirestoreService.getPatientData(currentUser.uid),
                    optimizedFirestoreService.getAppointmentData(currentUser.uid),
                    optimizedFirestoreService.getChildrenData(currentUser.uid)
                ]);

                // Calculate pending appointments (future appointments)
                const now = new Date();
                const pendingAppointments = appointments.filter(
                    appointment => appointment.appointmentDate > now
                ).length;

                // Calculate child vaccinations (total children for now)
                const childVaccinations = children.length;

                setAnalyticsData({
                    pendingAppointments,
                    totalPatients: patients.length,
                    childVaccinations,
                    healthcareCamps: 8 // Static value
                });

                setError(null);
            } catch (err: any) {
                console.error('Error fetching analytics data:', err);
                setError('Failed to load analytics data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [currentUser]);

    return { analyticsData, loading, error };
};