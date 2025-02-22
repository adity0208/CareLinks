import { Patient, Appointment, ChatMessage, AnalyticsData, SyncStatus } from '../types';
import { ExtendedAnalyticsData } from '../types/analytics';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    riskLevel: 'medium',
    lastVisit: '2024-02-15',
    nextAppointment: '2024-03-20',
    medicalHistory: 'Hypertension, Type 2 Diabetes'
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 62,
    riskLevel: 'high',
    lastVisit: '2024-02-28',
    nextAppointment: '2024-03-15',
    medicalHistory: 'COPD, Arthritis'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    age: 35,
    riskLevel: 'low',
    lastVisit: '2024-02-20',
    nextAppointment: null,
    medicalHistory: 'Seasonal Allergies'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    date: '2024-03-20',
    type: 'Follow-up',
    status: 'scheduled'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Smith',
    date: '2024-03-15',
    type: 'Check-up',
    status: 'scheduled'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'bot',
    message: 'Hello! How can I assist you with patient care today?',
    timestamp: '2024-03-01T10:00:00Z'
  },
  {
    id: '2',
    sender: 'user',
    message: 'I need information about diabetes management guidelines.',
    timestamp: '2024-03-01T10:01:00Z'
  },
  {
    id: '3',
    sender: 'bot',
    message: 'I can help you with diabetes management guidelines. What specific information are you looking for?',
    timestamp: '2024-03-01T10:01:30Z'
  }
];

export const mockAnalytics: AnalyticsData = {
  followUpRate: 85,
  completedVisits: 128,
  missedAppointments: 12,
  patientSatisfaction: 92
};

export const mockSyncStatus: SyncStatus = {
  lastSynced: '2024-03-01T09:30:00Z',
  isOnline: true,
  pendingChanges: 3
};

export const mockExtendedAnalytics: ExtendedAnalyticsData = {
  ...mockAnalytics,
  trends: {
    followUpRateTrend: [
      { date: '2024-01', value: 82 },
      { date: '2024-02', value: 84 },
      { date: '2024-03', value: 85 }
    ],
    patientSatisfactionTrend: [
      { date: '2024-01', value: 88 },
      { date: '2024-02', value: 90 },
      { date: '2024-03', value: 92 }
    ],
    visitCompletionTrend: [
      { date: '2024-01', value: 95 },
      { date: '2024-02', value: 93 },
      { date: '2024-03', value: 94 }
    ]
  },
  riskDistribution: {
    high: 15,
    medium: 35,
    low: 50
  },
  conditionPrevalence: [
    { condition: 'Hypertension', count: 45 },
    { condition: 'Diabetes', count: 38 },
    { condition: 'Asthma', count: 27 },
    { condition: 'Arthritis', count: 22 }
  ]
};