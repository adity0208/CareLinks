import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import Chat from '../pages/Chat';
import DataCollection from '../pages/DataCollection';
import Analytics from '../pages/Analytics';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/data-collection" element={<DataCollection />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}