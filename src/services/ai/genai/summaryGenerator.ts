import { Patient } from '../../types';
import { PatientSummary } from '../../types/ai';

export const generatePatientSummary = async (patient: Patient): Promise<PatientSummary> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    overview: `${patient.name} is a ${patient.age}-year-old patient with ${patient.medicalHistory}. Current risk level: ${patient.riskLevel}.`,
    keyPoints: [
      'Regular follow-up required',
      'Medication adherence is crucial',
      'Monitor vital signs weekly'
    ],
    recentChanges: [
      'Improved medication compliance',
      'Stable blood pressure readings',
      'Increased physical activity'
    ],
    nextSteps: [
      'Schedule follow-up appointment',
      'Review medication list',
      'Update care plan'
    ],
    aiConfidence: 0.94,
    generatedAt: new Date().toISOString()
  };
};