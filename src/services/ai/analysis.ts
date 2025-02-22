import { PatientData } from '../google/sheets';

export interface HealthAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  predictions: string[];
  recommendations: string[];
  trends: {
    category: string;
    trend: 'improving' | 'stable' | 'declining';
    details: string;
  }[];
}

class AIAnalysisService {
  private static instance: AIAnalysisService;

  private constructor() {}

  public static getInstance(): AIAnalysisService {
    if (!AIAnalysisService.instance) {
      AIAnalysisService.instance = new AIAnalysisService();
    }
    return AIAnalysisService.instance;
  }

  async analyzePatientData(data: PatientData): Promise<HealthAnalysis> {
    // Mock AI analysis - replace with actual AI service integration
    return {
      riskLevel: this.calculateRiskLevel(data),
      predictions: this.generatePredictions(data),
      recommendations: this.generateRecommendations(data),
      trends: this.analyzeTrends(data)
    };
  }

  private calculateRiskLevel(data: PatientData): 'low' | 'medium' | 'high' {
    // Mock risk calculation based on vital signs
    const { temperature, heartRate } = data.vitalSigns;
    if (temperature > 101 || heartRate > 100) return 'high';
    if (temperature > 99.5 || heartRate > 90) return 'medium';
    return 'low';
  }

  private generatePredictions(_data: PatientData): string[] {
    // Mock predictions based on symptoms and vital signs
    return [
      'Patient may need follow-up within 2 weeks',
      'Monitor blood pressure closely',
      'Risk of developing complications is low'
    ];
  }

  private generateRecommendations(_data: PatientData): string[] {
    // Mock recommendations based on analysis
    return [
      'Schedule regular check-ups',
      'Maintain healthy diet and exercise',
      'Continue prescribed medication'
    ];
  }

  private analyzeTrends(_data: PatientData): { category: string; trend: 'improving' | 'stable' | 'declining'; details: string; }[] {
    // Mock trend analysis
    return [
      {
        category: 'Blood Pressure',
        trend: 'stable',
        details: 'Blood pressure has remained within normal range'
      },
      {
        category: 'General Health',
        trend: 'improving',
        details: 'Overall health indicators show improvement'
      }
    ];
  }
}

export const aiService = AIAnalysisService.getInstance();
