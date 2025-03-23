import React from 'react';
import { BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockExtendedAnalytics } from '../data/mockData';
import AnalyticsTrends from '../components/Dashboard/AnalyticsTrends';
import InsightsPanel from '../components/AI/InsightsPanel';
import { analyzeHealthTrends } from '../services/vertexAI';
import { useState, useEffect } from 'react';

export default function Analytics() {
  const [healthTrends, setHealthTrends] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      const trends = await analyzeHealthTrends('all');
      setHealthTrends(trends);
    };
    fetchTrends();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart2 className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Risk Distribution</h2>
            <div className="space-y-4">
              {Object.entries(mockExtendedAnalytics.riskDistribution).map(([risk, percentage]) => (
                <div key={risk}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{risk} Risk</span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        risk === 'high' ? 'bg-red-500' :
                        risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Condition Prevalence</h2>
            <div className="space-y-3">
              {mockExtendedAnalytics.conditionPrevalence.map((item) => (
                <div key={item.condition} className="flex justify-between items-center">
                  <span>{item.condition}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {item.count} patients
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AnalyticsTrends trends={mockExtendedAnalytics.trends} />
          <InsightsPanel trends={healthTrends} />
        </div>
      </div>
    </div>
  );
}