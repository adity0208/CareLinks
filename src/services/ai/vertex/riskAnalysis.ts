import { Patient } from '../../../types';

export function analyzeRiskFactors(patient: Patient) {
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