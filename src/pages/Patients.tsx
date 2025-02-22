import React from 'react';
import PatientCard from '../components/Dashboard/PatientCard';
import { mockPatients } from '../data/mockData';

export default function Patients() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}