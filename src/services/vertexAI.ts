import { Patient } from '../types';
import { RiskPrediction, HealthTrend } from '../types/ai';

// Simulated Vertex AI prediction service
export async function predictPatientRisk(patient: Patient): Promise<RiskPrediction> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const riskFactors = analyzeRiskFactors(patient);
  const score = calculateRiskScore(riskFactors);

  return {
    patientId: patient.id,
    riskScore: score,
    confidence: 0.89,
    factors: riskFactors,
    timestamp: new Date().toISOString(),
    nextAssessmentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    recommendations: generateRecommendations(score, riskFactors)
  };
}

export async function analyzeHealthTrends(patientId: string): Promise<HealthTrend[]> {
  await new Promise(resolve => setTimeout(resolve, 600));

  return [
    {
      metric: 'Blood Pressure',
      trend: 'stable',
      confidence: 0.92,
      recommendation: 'Continue current medication regimen',
      historicalData: [
        { date: '2024-01', value: 120 },
        { date: '2024-02', value: 118 },
        { date: '2024-03', value: 122 }
      ]
    },
    {
      metric: 'Medication Adherence',
      trend: 'improving',
      confidence: 0.85,
      recommendation: 'Maintain current reminder system',
      historicalData: [
        { date: '2024-01', value: 75 },
        { date: '2024-02', value: 82 },
        { date: '2024-03', value: 88 }
      ]
    }
  ];
}

// Private helper functions
function analyzeRiskFactors(patient: Patient) {
  return [
    {
      name: 'Age',
      impact: patient.age > 60 ? 'high' : 'medium',
      value: patient.age,
      description: 'Age-related risk factors present'
    },
    {
      name: 'Medical History',
      impact: patient.medicalHistory.includes('Diabetes') ? 'high' : 'low',
      value: patient.medicalHistory,
      description: 'Chronic condition management required'
    }
  ];
}

function calculateRiskScore(factors: any[]): number {
  return Math.floor(Math.random() * 40) + 60; // Simulate risk score between 60-100
}

function generateRecommendations(score: number, factors: any[]): string[] {
  const recommendations = [
    'Schedule follow-up appointment within 2 weeks',
    'Review medication adherence',
    'Conduct comprehensive health assessment'
  ];

  if (score > 80) {
    recommendations.push('Immediate intervention required');
    recommendations.push('Consider specialist referral');
  }

  return recommendations;
}