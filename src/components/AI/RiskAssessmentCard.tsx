import { RiskAssessment } from '../../types/ai';
import { AlertTriangle, Check } from 'lucide-react';

interface RiskAssessmentCardProps {
  assessment: RiskAssessment;
}

export default function RiskAssessmentCard({ assessment }: RiskAssessmentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Risk Assessment</h3>
        <span className="text-sm text-gray-500">
          Updated {new Date(assessment.lastUpdated).toLocaleDateString()}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Risk Score</span>
          <span className="text-xl font-bold">{assessment.score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 rounded-full h-2"
            style={{ width: `${assessment.score}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {assessment.factors.map((factor, index) => (
          <div key={index} className="flex items-start space-x-3">
            {factor.impact === 'high' ? (
              <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
            ) : (
              <Check className="w-5 h-5 text-green-500 mt-1" />
            )}
            <div>
              <p className="font-medium">{factor.factor}</p>
              <p className="text-sm text-gray-600">{factor.recommendation}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        {assessment.summary}
      </p>
    </div>
  );
}