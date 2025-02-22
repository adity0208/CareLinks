import { ChatMessage, Patient } from '../types';

// Simulated Google Cloud Generative AI service
export async function generateCarePlan(patient: Patient): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return `Based on ${patient.name}'s medical history and current condition:

1. Primary Focus Areas:
   - ${patient.medicalHistory}
   - Regular monitoring of vital signs
   - Medication adherence support

2. Recommended Actions:
   - Weekly blood pressure checks
   - Monthly wellness check-ins
   - Dietary and exercise guidance

3. Support Services:
   - Connect with community resources
   - Family education sessions
   - Transportation assistance if needed`;
}

export async function generateHealthGuidelines(condition: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const guidelines: Record<string, string> = {
    diabetes: `Diabetes Management Guidelines:
1. Blood sugar monitoring schedule
2. Proper medication timing
3. Diet modifications
4. Exercise recommendations
5. Regular foot examinations`,
    hypertension: `Hypertension Management:
1. Daily blood pressure monitoring
2. Sodium intake restrictions
3. Regular physical activity
4. Stress management techniques
5. Medication compliance importance`
  };

  return guidelines[condition.toLowerCase()] || 'No specific guidelines available for this condition.';
}

export async function analyzeSymptoms(symptoms: string[]): Promise<{
  analysis: string;
  urgency: 'low' | 'medium' | 'high';
  recommendations: string[];
}> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  return {
    analysis: 'Based on the reported symptoms, this appears to be a mild respiratory infection.',
    urgency: 'medium',
    recommendations: [
      'Rest and hydration',
      'Monitor temperature',
      'Seek immediate care if symptoms worsen',
      'Follow up with primary care provider within 48 hours'
    ]
  };
}