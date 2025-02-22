import { BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';
import { HealthTrend } from '../../types/ai';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface InsightsPanelProps {
  trends: HealthTrend[];
}

export default function InsightsPanel({ trends }: InsightsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart2 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
      </div>

      <div className="space-y-6">
        {trends.map((trend, index) => (
          <div key={index} className="border-b pb-6 last:border-b-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{trend.metric}</h3>
              <div className={`px-3 py-1 rounded-full text-sm ${
                trend.trend === 'improving' ? 'bg-green-100 text-green-800' :
                trend.trend === 'declining' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}</span>
                </div>
              </div>
            </div>

            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend.historicalData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium">AI Recommendation</p>
                  <p className="text-sm text-gray-600">{trend.recommendation}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence: {(trend.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}