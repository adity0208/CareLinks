import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

export default function Analytics() {
  const { translate } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart2 className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">{translate('Analytics Dashboard')}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}