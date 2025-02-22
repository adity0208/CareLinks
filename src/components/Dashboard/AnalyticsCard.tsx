import React from 'react';
import { BarChart2, TrendingUp, Users, Clock } from 'lucide-react';
import { AnalyticsData } from '../../types';

interface AnalyticsCardProps {
  data: AnalyticsData;
}

export default function AnalyticsCard({ data }: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart2 className="w-5 h-5 mr-2 text-blue-600" />
        Performance Metrics
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center text-blue-600 mb-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Follow-up Rate
          </div>
          <div className="text-2xl font-bold">{data.followUpRate}%</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center text-green-600 mb-2">
            <Users className="w-4 h-4 mr-2" />
            Patient Satisfaction
          </div>
          <div className="text-2xl font-bold">{data.patientSatisfaction}%</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center text-purple-600 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            Completed Visits
          </div>
          <div className="text-2xl font-bold">{data.completedVisits}</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center text-red-600 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            Missed Appointments
          </div>
          <div className="text-2xl font-bold">{data.missedAppointments}</div>
        </div>
      </div>
    </div>
  );
}