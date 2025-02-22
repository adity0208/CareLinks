import { RiskAssessment, AIInsight, SymptomAnalysis } from '../types/ai';
import { Patient } from '../types';

export function generateRiskAssessment(patient: Patient): RiskAssessment {
  return {
    score: 75,
    factors: [
      {
        factor: 'Age',
        impact: 'medium',
        recommendation: 'Regular health screenings recommended'
      },
      {
        factor: 'Medical History',
        impact: 'high',
        recommendation: 'Close monitoring of chronic conditions required'
      },
      {
        factor: 'Appointment Adherence',
        impact: 'low',
        recommendation: 'Maintain current follow-up schedule'
      }
    ],
    summary: 'Based on recent health data and medical history, the patient shows elevated risk factors that require attention. Regular monitoring and preventive care recommended.',
    lastUpdated: new Date().toISOString()
  };
}

export function generateAIInsights(data: any): AIInsight[] {
  return [
    {
      type: 'trend',
      title: 'Improving Patient Engagement',
      description: 'Analysis shows a 15% increase in patient follow-up rates over the last quarter, correlating with improved health outcomes.',
      confidence: 0.89,
      timestamp: new Date().toISOString()
    },
    {
      type: 'recommendation',
      title: 'Preventive Care Opportunity',
      description: 'Based on demographic and health patterns, consider implementing diabetes screening program for at-risk patients.',
      confidence: 0.92,
      timestamp: new Date().toISOString()
    }
  ];
}

export function analyzeSymptoms(symptoms: string[]): SymptomAnalysis {
  return {
    symptoms,
    possibleConditions: [
      {
        condition: 'Common Cold',
        probability: 0.75,
        description: 'Viral upper respiratory infection with typical symptoms'
      },
      {
        condition: 'Seasonal Allergies',
        probability: 0.65,
        description: 'Environmental allergen reaction'
      }
    ],
    recommendations: [
      'Rest and hydration',
      'Monitor symptoms for 24-48 hours',
      'Seek immediate care if symptoms worsen'
    ],
    disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice.'
  };
}

export function generateChatResponse(message: string): string {
  // Mock responses based on keywords
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return 'Hello! How can I assist you with patient care today?';
  }
  
  if (message.toLowerCase().includes('appointment') || message.toLowerCase().includes('schedule')) {
    return 'I can help you schedule an appointment. Please provide the patient name and preferred date/time.';
  }
  
  if (message.toLowerCase().includes('symptom') || message.toLowerCase().includes('pain')) {
    return 'I understand you\'re experiencing symptoms. Could you please describe them in detail? This will help me provide better assistance.';
  }
  
  if (message.toLowerCase().includes('medicine') || message.toLowerCase().includes('medication')) {
    return 'For medication-related queries, I recommend consulting with your healthcare provider. Would you like me to help schedule a consultation?';
  }
  
  // Default response
  return 'I\'m here to help with your healthcare needs. Could you please provide more details about your query?';
}