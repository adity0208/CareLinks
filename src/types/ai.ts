export interface PatientData {
  [key: string]: string;
}

export interface AnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  confidence: number;
  timestamp: string;
  insights: AIInsight[];
}

export interface AIInsight {
  type: 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
}

export interface HealthTrend {
  metric: string;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;
  recommendation: string;
  historicalData: {
    date: string;
    value: number;
  }[];
}

export interface FormData {
  patientName: string;
  age: string;
  symptoms: string;
  vitalSigns: string;
  medications: string;
}

export interface RiskFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface RiskAssessment {
  score: number;
  factors: RiskFactor[];
  summary: string;
  lastUpdated: string;
}

export interface SymptomAnalysis {
  symptoms: string[];
  possibleConditions: Array<{
    condition: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    recommendations: string[];
  }>;
  urgencyLevel: 'routine' | 'soon' | 'immediate';
  followUpRecommended: boolean;
}

export interface PatientSummary {
  generatedAt: string;
  overview: string;
  keyPoints: string[];
  recentChanges: string[];
  nextSteps: string[];
  aiConfidence: number;
}

export interface RiskPrediction {
  riskScore: number;
  timestamp: string;
  // Add any other relevant properties here
}