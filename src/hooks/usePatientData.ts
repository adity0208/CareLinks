import { useState, useEffect } from 'react';
import { PatientData, firestoreService } from '../services/firebase/firestore'; // Adjust path if needed

export const usePatientData = () => {
  const [patientData, setPatientData] = useState<PatientData[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await firestoreService.getPatientData();
        setPatientData(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { patientData, loading, error };
};