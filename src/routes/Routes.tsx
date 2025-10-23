import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import Chat from '../pages/Chat';
import Analytics from '../pages/Analytics';
import ChildVaccinationTable from '../pages/ChildVaccinationTable';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function AppRoutes() {
  const { currentUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['chw']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute allowedRoles={['chw']}>
            <Patients loading={false} error={errorMessage} />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={['chw']}>
            <Appointments />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute allowedRoles={['chw']}>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['chw']}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/child-vaccinations" element={
          <ProtectedRoute allowedRoles={['chw']}>
            <ChildVaccinationTable />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}