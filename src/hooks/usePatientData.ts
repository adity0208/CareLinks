import { useState, useEffect, useRef } from 'react';
import { optimizedFirestoreService, PatientData } from '../services/firebase/optimizedFirestore';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';

export const usePatientData = () => {
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
        const data = await optimizedFirestoreService.getPatientData(currentUser.uid);
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
      optimizedFirestoreService.clearUserCache(currentUser.uid);
      const data = await optimizedFirestoreService.getPatientData(currentUser.uid);
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

  return { patientData, loading, error, refreshPatients };
};