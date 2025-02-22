import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { RiskPrediction } from '../../types/ai';

interface RiskIndicatorProps {
  prediction: RiskPrediction;
}

export default function RiskIndicator({ prediction }: RiskIndicatorProps) {
  const getIndicatorColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getIcon = (score: number) => {
    if (score >= 80) return AlertTriangle;
    if (score >= 60) return AlertCircle;
    return CheckCircle;
  };

  const Icon = getIcon(prediction.riskScore);

  return (
    <div className="flex items-center space-x-2">
      <Icon className={`w-5 h-5 ${getIndicatorColor(prediction.riskScore)}`} />
      <div>
        <div className="text-sm font-medium">
          Risk Score: {prediction.riskScore}
        </div>
        <div className="text-xs text-gray-500">
          Updated {new Date(prediction.timestamp).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}