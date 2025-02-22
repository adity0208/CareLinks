// Specific condition risk analysis
import { Patient } from '../../types';

export const analyzeConditionRisks = (patient: Patient): any[] => {
  const conditions: any[] = [
    {
      name: 'Diabetes',
      riskLevel: calculateDiabetesRisk(patient),
      factors: [
        'Age', 'BMI', 'Family History',
        'Physical Activity Level', 'Diet'
      ],
      preventiveActions: [
        'Regular blood sugar monitoring',
        'Balanced diet rich in whole grains',
        'Daily physical activity',
        'Weight management'
      ]
    },
    {
      name: 'Hypertension',
      riskLevel: calculateHypertensionRisk(patient),
      factors: [
        'Blood Pressure History',
        'Sodium Intake',
        'Stress Levels',
        'Exercise Routine'
      ],
      preventiveActions: [
        'Daily blood pressure monitoring',
        'Low-sodium diet',
        'Stress management techniques',
        'Regular cardiovascular exercise'
      ]
    }
  ];

  return conditions;
};

function calculateDiabetesRisk(patient: Patient): number {
  // Mock risk calculation based on patient data
  return patient.age > 45 ? 75 : 45;
}

function calculateHypertensionRisk(patient: Patient): number {
  // Mock risk calculation based on medical history
  return patient.medicalHistory.toLowerCase().includes('hypertension') ? 85 : 55;
}