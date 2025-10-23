import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { optimizedFirestoreService } from '../services/firebase/optimizedFirestore';

interface AnalyticsMetrics {
    totalPatients: number;
    totalAppointments: number;
    totalChildren: number;
    pendingAppointments: number;
    childVaccinations: number;
    healthcareCamps: number;
    riskDistribution: {
        high: number;
        medium: number;
        low: number;
    };
    monthlyTrends: {
        patients: number;
        appointments: number;
        vaccinations: number;
    };
}

export function useAnalyticsData() {
    const { currentUser } = useAuth();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsMetrics>({
        totalPatients: 0,
        totalAppointments: 0,
        totalChildren: 0,
        pendingAppointments: 0,
        childVaccinations: 0,
        healthcareCamps: 3, // Static for now
        riskDistribution: { high: 0, medium: 0, low: 0 },
        monthlyTrends: { patients: 0, appointments: 0, vaccinations: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch all data in parallel
                const [patients, appointments, children] = await Promise.all([
                    optimizedFirestoreService.getPatientData(currentUser.uid),
                    optimizedFirestoreService.getAppointmentData(currentUser.uid),
                    optimizedFirestoreService.getChildrenData(currentUser.uid)
                ]);

                // Calculate risk distribution
                const riskDistribution = calculateRiskDistribution(patients);

                // Calculate pending appointments (appointments in the future)
                const now = new Date();
                const pendingAppointments = appointments.filter(apt =>
                    apt.appointmentDate > now
                ).length;

                // Calculate child vaccinations (mock calculation)
                const childVaccinations = Math.floor(children.length * 0.8); // 80% vaccination rate

                // Calculate monthly trends (mock data for now)
                const monthlyTrends = {
                    patients: Math.floor(patients.length * 0.1), // 10% growth
                    appointments: Math.floor(appointments.length * 0.15), // 15% growth
                    vaccinations: Math.floor(childVaccinations * 0.05) // 5% growth
                };

                setAnalyticsData({
                    totalPatients: patients.length,
                    totalAppointments: appointments.length,
                    totalChildren: children.length,
                    pendingAppointments,
                    childVaccinations,
                    healthcareCamps: 3, // Static for now
                    riskDistribution,
                    monthlyTrends
                });

            } catch (err: any) {
                console.error('Error fetching analytics data:', err);
                setError(err.message || 'Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [currentUser]);

    return { analyticsData, loading, error };
}

function calculateRiskDistribution(patients: any[]): { high: number; medium: number; low: number } {
    if (patients.length === 0) {
        return { high: 0, medium: 0, low: 0 };
    }

    const riskCounts = { high: 0, medium: 0, low: 0 };

    patients.forEach(patient => {
        const symptoms = patient.symptoms || [];
        const vitalSigns = patient.vitalSigns;
        const age = patient.age || 0;

        // High risk indicators
        const highRiskSymptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'high fever'];
        const hasHighRiskSymptoms = symptoms.some((symptom: string) =>
            highRiskSymptoms.some(risk => symptom.toLowerCase().includes(risk))
        );

        // Check vital signs for high risk
        const hasHighBP = vitalSigns?.bloodPressure &&
            (vitalSigns.bloodPressure.includes('140') || vitalSigns.bloodPressure.includes('90'));
        const hasHighTemp = vitalSigns?.temperature &&
            (typeof vitalSigns.temperature === 'number' ? vitalSigns.temperature > 101 : parseFloat(vitalSigns.temperature) > 101);

        if (hasHighRiskSymptoms || hasHighBP || hasHighTemp) {
            riskCounts.high++;
        } else if (symptoms.length > 2 || age > 60) {
            riskCounts.medium++;
        } else {
            riskCounts.low++;
        }
    });

    return riskCounts;
}