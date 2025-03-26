import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import Chat from '../pages/Chat';
import DataCollection from '../pages/DataCollection';
import Analytics from '../pages/Analytics';
import Landing from '../pages/Landing';
import Collaboration from '../pages/Collaboration'; // Import the Collaboration component
import { useAuthState } from '../hooks/useAuthState';
import { firestoreService, PatientData } from '../services/firebase/firestore';
import { useState } from 'react';

export default function AppRoutes() {
  const { user, loading } = useAuthState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePatientAdd = async (newPatientData: Omit<PatientData, 'id' | 'createdAt'>) => {
    try {
      console.log('Adding new patient:', newPatientData);
      await firestoreService.savePatientData(newPatientData);
      console.log('Patient data saved successfully!');
      setErrorMessage(null);
    } catch (error: any) {
      console.error('Error saving patient data:', error.message);
      setErrorMessage('Failed to save patient data. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/patients"
          element={user ? <Patients loading={loading} error={errorMessage} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/appointments"
          element={user ? <Appointments /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/" replace />}
        />
        <Route
          path="/data-collection"
          element={
            user ? (
              <DataCollection onPatientAdd={handlePatientAdd} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/analytics"
          element={user ? <Analytics /> : <Navigate to="/" replace />}
        />
        <Route
          path="/collaboration"
          element={user ? <Collaboration /> : <Navigate to="/" replace />} // Add the Collaboration route with auth check
        />
      </Routes>
    </>
  );
}