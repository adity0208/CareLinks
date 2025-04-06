import { Patient, Appointment, ChatMessage, AnalyticsData, SyncStatus } from '../types';
import { ExtendedAnalyticsData } from '../types/analytics';

export const mockPatients: Patient[] = [
    {
        id: '1',
        name: 'John Doe',
        age: 45,
        riskLevel: 'high',
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
        message: 'Hello! How can I help you with basic health and diet information today?',
        timestamp: '2025-04-06T11:54:00Z' // Using current time
    },
    {
        id: '2',
        sender: 'user',
        message: 'What is the recommended diet for diabetes?',
        timestamp: '2025-04-06T11:54:30Z' // Using current time
    }
];

export const mockAnalytics: AnalyticsData = {
    pendingAppointments: 28,
    totalPatients: 156,
    childVaccinations: 45,
    healthcareCamps: 8
};

export const mockSyncStatus: SyncStatus = {
    lastSynced: '2024-03-01T09:30:00Z',
    isOnline: true,
    pendingChanges: 3
};

export const mockExtendedAnalytics: ExtendedAnalyticsData = {
    ...mockAnalytics,
    followUpRate: 83, // Added missing property
    completedVisits: 120, // Added missing property
    missedAppointments: 12, // Added missing property
    patientSatisfaction: 91, // Added missing property
    trends: {
        followUpRateTrend: [
            { date: '2025-01', value: 82 },
            { date: '2025-02', value: 84 },
            { date: '2025-03', value: 85 }
        ],
        patientSatisfactionTrend: [
            { date: '2025-01', value: 88 },
            { date: '2025-02', value: 90 },
            { date: '2025-03', value: 92 }
        ],
        visitCompletionTrend: [
            { date: '2025-01', value: 95 },
            { date: '2025-02', value: 93 },
            { date: '2025-03', value: 94 }
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