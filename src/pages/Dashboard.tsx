import React from 'react';
import AnalyticsCard from '../components/Dashboard/AnalyticsCard';
import PatientCard from '../components/Dashboard/PatientCard';
import AppointmentList from '../components/Dashboard/AppointmentList';
import ChatInterface from '../components/Chat/ChatInterface';
import SyncIndicator from '../components/common/SyncIndicator';
import { mockPatients, mockAppointments, mockChatMessages, mockAnalytics, mockSyncStatus } from '../data/mockData';

export default function Dashboard() {
  const handleSync = () => {
    console.log('Syncing data...');
  };

  return (
    <div>
      <div className="mb-4">
        <SyncIndicator status={mockSyncStatus} onSync={handleSync} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsCard data={mockAnalytics} />
          <div>
            <h2 className="text-xl font-semibold mb-4">Patient Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          </div>
          <AppointmentList appointments={mockAppointments} />
        </div>
        <div>
          <ChatInterface messages={mockChatMessages} />
        </div>
      </div>
    </div>
  );
}