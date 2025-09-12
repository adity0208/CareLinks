import { useState, useEffect, useRef } from 'react';
import { optimizedFirestoreService, PatientData } from '../services/firebase/optimizedFirestore';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';

// Cache to prevent duplicate requests
const dataCache = new Map<string, { data: PatientData[]; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export const useOptimizedPatientData = () => {
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

            const cacheKey = `patients_${currentUser.uid}`;
            const cached = dataCache.get(cacheKey);

            // Check if we have valid cached data
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                logger.debug('Using cached patient data');
                setPatientData(cached.data);
                setLoading(false);
                return;
            }

            requestInProgress.current = true;
            setLoading(true);

            try {
                logger.info('Fetching patient data from Firestore');
                const data = await optimizedFirestoreService.getPatientData(currentUser.uid);

                // Cache the data
                dataCache.set(cacheKey, { data, timestamp: Date.now() });

                setPatientData(data);
                setError(null);
                logger.debug('Patient data fetched successfully', data);
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

        // Clear cache to force fresh data
        const cacheKey = `patients_${currentUser.uid}`;
        dataCache.delete(cacheKey);

        requestInProgress.current = true;
        setLoading(true);

        try {
            const data = await optimizedFirestoreService.getPatientData(currentUser.uid);
            dataCache.set(cacheKey, { data, timestamp: Date.now() });
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

    const addPatientToCache = (newPatient: PatientData) => {
        if (!currentUser) return;

        const cacheKey = `patients_${currentUser.uid}`;
        const updatedData = [newPatient, ...patientData];

        dataCache.set(cacheKey, { data: updatedData, timestamp: Date.now() });
        setPatientData(updatedData);
    };

    const removePatientFromCache = (patientId: string) => {
        if (!currentUser) return;

        const cacheKey = `patients_${currentUser.uid}`;
        const updatedData = patientData.filter(p => p.id !== patientId);

        dataCache.set(cacheKey, { data: updatedData, timestamp: Date.now() });
        setPatientData(updatedData);
    };

    return {
        patientData,
        loading,
        error,
        refreshPatients,
        addPatientToCache,
        removePatientFromCache
    };
};