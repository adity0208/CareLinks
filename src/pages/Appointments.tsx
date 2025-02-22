import React from 'react';
import AppointmentList from '../components/Dashboard/AppointmentList';
import { mockAppointments } from '../data/mockData';

export default function Appointments() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <AppointmentList appointments={mockAppointments} />
    </div>
  );
}