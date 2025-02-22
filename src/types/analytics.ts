export interface TrendData {
  date: string;
  value: number;
}

export interface AnalyticsTrend {
  followUpRateTrend: TrendData[];
  patientSatisfactionTrend: TrendData[];
  visitCompletionTrend: TrendData[];
}

export interface ExtendedAnalyticsData {
  followUpRate: number;
  completedVisits: number;
  missedAppointments: number;
  patientSatisfaction: number;
  trends: AnalyticsTrend;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  conditionPrevalence: {
    condition: string;
    count: number;
  }[];
}