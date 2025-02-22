import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { sheetsService, PatientData } from '../../services/google/sheets';
import { aiService, HealthAnalysis } from '../../services/ai/analysis';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { translate } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, HealthAnalysis>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await sheetsService.getPatientData();
      setPatientData(data);

      // Get AI analysis for each patient
      const analysisResults: Record<string, HealthAnalysis> = {};
      await Promise.all(
        data.map(async (patient) => {
          const analysis = await aiService.analyzePatientData(patient);
          analysisResults[patient.id] = analysis;
        })
      );
      setAnalyses(analysisResults);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{translate('Health Analytics Dashboard')}</h2>

      {patientData.map((patient) => {
        const analysis = analyses[patient.id];
        if (!analysis) return null;

        return (
          <div key={patient.id} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{patient.name}</h3>
                <p className="text-sm text-gray-500">
                  {translate('Age')}: {patient.age} | {translate('Gender')}: {patient.gender}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getRiskLevelColor(analysis.riskLevel)}`}>
                {translate('Risk Level')}: {translate(analysis.riskLevel)}
              </span>
            </div>

            {/* Predictions */}
            <div>
              <h4 className="font-medium mb-2">{translate('Predictions')}</h4>
              <ul className="space-y-1">
                {analysis.predictions.map((prediction, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>{translate(prediction)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trends */}
            <div>
              <h4 className="font-medium mb-2">{translate('Health Trends')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.trends.map((trend, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getTrendIcon(trend.trend)}
                    <div>
                      <p className="font-medium">{translate(trend.category)}</p>
                      <p className="text-sm text-gray-600">{translate(trend.details)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-2">{translate('Recommendations')}</h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm text-gray-600">• {translate(recommendation)}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
