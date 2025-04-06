import React from 'react';
import { Calendar, Users, Syringe, Tent } from 'lucide-react';
import { AnalyticsData } from '../../types';

interface AnalyticsCardProps {
  data: AnalyticsData;
}

export default function AnalyticsCard({ data }: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        Performance Metrics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center text-indigo-600 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            Pending Appointments
          </div>
          <div className="text-2xl font-bold">{data.pendingAppointments}</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg">
          <div className="flex items-center text-emerald-600 mb-2">
            <Users className="w-4 h-4 mr-2" />
            Total Patients
          </div>
          <div className="text-2xl font-bold">{data.totalPatients}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center text-purple-600 mb-2">
            <Syringe className="w-4 h-4 mr-2" />
            Child Vaccinations
          </div>
          <div className="text-2xl font-bold">{data.childVaccinations}</div>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center text-amber-600 mb-2">
            <Tent className="w-4 h-4 mr-2" />
            Healthcare Camps
          </div>
          <div className="text-2xl font-bold">{data.healthcareCamps}</div>
        </div>
      </div>
    </div>
  );
}