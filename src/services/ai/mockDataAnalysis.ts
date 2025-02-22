import { PatientData, AnalysisResult, HealthTrend } from '../../types/ai';

export async function analyzePatientData(data: PatientData): Promise<AnalysisResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock risk analysis based on age and symptoms
  const age = parseInt(data.age);
  const hasChronicSymptoms = data.symptoms.toLowerCase().includes('chronic') ||
    data.symptoms.toLowerCase().includes('persistent');

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (age > 60 || hasChronicSymptoms) {
    riskLevel = 'High';
  } else if (age > 40) {
    riskLevel = 'Medium';
  }

  const recommendations = generateRecommendations(riskLevel, data);

  return {
    riskLevel,
    recommendations,
    confidence: 0.89,
    timestamp: new Date().toISOString(),
    insights: [
      {
        type: 'risk',
        title: 'Risk Assessment',
        description: `Patient shows ${riskLevel.toLowerCase()} risk based on age and symptoms.`,
        confidence: 0.92
      },
      {
        type: 'trend',
        title: 'Health Trend',
        description: 'Vital signs indicate stable condition with regular monitoring needed.',
        confidence: 0.88
      }
    ]
  };
}

function generateRecommendations(riskLevel: string, data: PatientData): string[] {
  const baseRecommendations = [
    'Schedule follow-up appointment',
    'Monitor vital signs daily',
    'Review medication compliance'
  ];

  if (riskLevel === 'High') {
    return [
      'Immediate specialist consultation recommended',
      'Daily vital signs monitoring required',
      ...baseRecommendations
    ];
  }

  return baseRecommendations;
}

export async function generateHealthTrends(patientId: string): Promise<HealthTrend[]> {
  await new Promise(resolve => setTimeout(resolve, 600));

  return [
    {
      metric: 'Blood Pressure',
      trend: 'stable',
      confidence: 0.92,
      recommendation: 'Continue current medication regimen',
      historicalData: generateMockHistoricalData()
    },
    {
      metric: 'Medication Adherence',
      trend: 'improving',
      confidence: 0.85,
      recommendation: 'Maintain current reminder system',
      historicalData: generateMockHistoricalData()
    }
  ];
}

function generateMockHistoricalData() {
  const data = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(now.getMonth() - i);
    data.push({
      date: date.toISOString().slice(0, 7),
      value: Math.floor(Math.random() * 30) + 70
    });
  }
  return data;
}