import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import Chat from '../pages/Chat';
import DataCollection from '../pages/DataCollection';
import Analytics from '../pages/Analytics';
import Collaboration from '../pages/Collaboration';
import ChildVaccinationTable from '../pages/ChildVaccinationTable';
import { useAuth } from '../contexts/AuthContext';
import { optimizedFirestoreService, PatientData } from '../services/firebase/optimizedFirestore';
import { useState } from 'react';
import { logger } from '../utils/logger';

export default function AppRoutes() {
  const { currentUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePatientAdd = async (newPatientData: Omit<PatientData, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      logger.info('Adding new patient');
      await optimizedFirestoreService.savePatientData(newPatientData, currentUser.uid);
      logger.info('Patient data saved successfully');
      setErrorMessage(null);
    } catch (error: any) {
      console.error('Error saving patient data:', error.message);
      setErrorMessage('Failed to save patient data. Please try again.');
    }
  };

  return (
    <>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients loading={false} error={errorMessage} />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/data-collection" element={<DataCollection onPatientAdd={handlePatientAdd} />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/collaboration" element={<Collaboration />} />
        <Route path="/child-vaccinations" element={<ChildVaccinationTable />} />
      </Routes>
    </>
  );
}