import { useState, useEffect } from 'react';
import { Patient } from '../types';
import { PatientData, firestoreService } from '../services/firebase/firestore';

// Helper function to convert PatientData to Patient interface
const convertPatientDataToPatient = (patientData: PatientData): Patient => {
    // Calculate risk level based on symptoms and vital signs
    const calculateRiskLevel = (patient: PatientData): 'low' | 'medium' | 'high' => {
        const symptoms = patient.symptoms || [];
        const vitalSigns = patient.vitalSigns;

        // High risk indicators
        const highRiskSymptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'high fever'];
        const hasHighRiskSymptoms = symptoms.some(symptom =>
            highRiskSymptoms.some(risk => symptom.toLowerCase().includes(risk))
        );

        // Check vital signs for high risk
        const hasHighBP = vitalSigns?.bloodPressure &&
            (vitalSigns.bloodPressure.includes('140') || vitalSigns.bloodPressure.includes('90'));
        const hasHighTemp = vitalSigns?.temperature &&
            (typeof vitalSigns.temperature === 'number' ? vitalSigns.temperature > 101 : parseFloat(vitalSigns.temperature) > 101);

        if (hasHighRiskSymptoms || hasHighBP || hasHighTemp) {
            return 'high';
        }

        // Medium risk for multiple symptoms or age > 60
        if (symptoms.length > 2 || patient.age > 60) {
            return 'medium';
        }

        return 'low';
    };

    return {
        id: patientData.id,
        name: patientData.name,
        age: patientData.age,
        riskLevel: calculateRiskLevel(patientData),
        lastVisit: patientData.createdAt ? patientData.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        nextAppointment: null, // This would need to be fetched from appointments
        medicalHistory: patientData.symptoms?.join(', ') || patientData.notes || 'No medical history available'
    };
};

export const usePatientDataForDashboard = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const patientData = await firestoreService.getPatientData();
                const convertedPatients = patientData.map(convertPatientDataToPatient);
                setPatients(convertedPatients);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching patient data for dashboard:', err);
                setError('Failed to load patient data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { patients, loading, error };
};