// New vendor-agnostic patient data hook
import { useState, useEffect, useRef } from 'react';
import { PatientData } from '../services/firebase/optimizedFirestore'; // Move to types later
import { patientService } from '../services/patient-service';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';

export const usePatientDataNew = () => {
    const [patientData, setPatientData] = useState<PatientData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const requestInProgress = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser || requestInProgress.current) {
                if (!currentUser) {
                    setPatientData([]);
                    setLoading(false);
                }
                return;
            }

            requestInProgress.current = true;
            setLoading(true);

            try {
                const data = await patientService.getPatients(currentUser.uid);
                setPatientData(data);
                setError(null);
            } catch (err: any) {
                logger.error('Error fetching patient data', err);
                setError('Failed to load patient data. Please try again.');
            } finally {
                setLoading(false);
                requestInProgress.current = false;
            }
        };

        fetchData();
    }, [currentUser]);

    const refreshPatients = async () => {
        if (!currentUser || requestInProgress.current) return;

        requestInProgress.current = true;
        setLoading(true);

        try {
            // Clear cache and fetch fresh data
            patientService.clearUserCache(currentUser.uid);
            const data = await patientService.getPatients(currentUser.uid);
            setPatientData(data);
            setError(null);
        } catch (err: any) {
            logger.error('Error refreshing patient data', err);
            setError('Failed to refresh patient data.');
        } finally {
            setLoading(false);
            requestInProgress.current = false;
        }
    };

    const createPatient = async (patientData: Omit<PatientData, 'id' | 'createdAt'>) => {
        if (!currentUser) throw new Error('User not authenticated');

        const id = await patientService.createPatient(currentUser.uid, patientData);
        await refreshPatients(); // Refresh the list
        return id;
    };

    const updatePatient = async (patientId: string, updates: Partial<PatientData>) => {
        if (!currentUser) throw new Error('User not authenticated');

        await patientService.updatePatient(currentUser.uid, patientId, updates);
        await refreshPatients(); // Refresh the list
    };

    const deletePatient = async (patientId: string) => {
        if (!currentUser) throw new Error('User not authenticated');

        await patientService.deletePatient(currentUser.uid, patientId);
        await refreshPatients(); // Refresh the list
    };

    return {
        patientData,
        loading,
        error,
        refreshPatients,
        createPatient,
        updatePatient,
        deletePatient
    };
};