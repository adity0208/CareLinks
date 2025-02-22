import { FileText, Clock, CheckCircle } from 'lucide-react';
import { PatientSummary } from '../../types/ai';

interface PatientSummaryCardProps {
  summary: PatientSummary;
}

export default function PatientSummaryCard({ summary }: PatientSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI-Generated Summary</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(summary.generatedAt).toLocaleTimeString()}
        </div>
      </div>

      <p className="text-gray-700 mb-4">{summary.overview}</p>

      <div className="space-y-4">
        <SummarySection title="Key Points" items={summary.keyPoints} />
        <SummarySection title="Recent Changes" items={summary.recentChanges} />
        <SummarySection title="Next Steps" items={summary.nextSteps} />
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          AI Confidence: {(summary.aiConfidence * 100).toFixed(0)}%
        </div>
        <button className="text-blue-600 hover:text-blue-700">
          Refresh Summary
        </button>
      </div>
    </div>
  );
}

interface SummarySectionProps {
  title: string;
  items: string[];
}

function SummarySection({ title, items }: SummarySectionProps) {
  return (
    <div>
      <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span className="text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}