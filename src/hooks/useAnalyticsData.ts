import { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';
import { firestoreService } from '../services/firebase/firestore';

export const useAnalyticsData = () => {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        pendingAppointments: 0,
        totalPatients: 0,
        childVaccinations: 0,
        healthcareCamps: 8 // This remains static as it's not stored in Firestore
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            try {
                // Fetch patients and appointments data
                const [patients, appointments, children] = await Promise.all([
                    firestoreService.getPatientDataForAnalytics(),
                    firestoreService.getAppointmentDataForAnalytics(),
                    firestoreService.getChildrenData()
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
    }, []);

    return { analyticsData, loading, error };
};