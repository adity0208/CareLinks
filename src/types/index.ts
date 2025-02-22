export interface Patient {
  id: string;
  name: string;
  age: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastVisit: string;
  nextAppointment: string | null;
  medicalHistory: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}

export interface AnalyticsData {
  followUpRate: number;
  completedVisits: number;
  missedAppointments: number;
  patientSatisfaction: number;
}

export interface SyncStatus {
  lastSynced: string | null;
  isOnline: boolean;
  pendingChanges: number;
}