import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
  vitalSigns: {
    bloodPressure: string;
    temperature: number;
    heartRate: number;
  };
  notes: string;
}

class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private spreadsheetId: string;
  private mockData: PatientData[];

  private constructor() {
    // Use Vite's import.meta.env instead of process.env
    this.spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID || '';
    
    // Initialize mock data
    this.mockData = [
      {
        id: '1',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        symptoms: ['Fever', 'Cough'],
        vitalSigns: {
          bloodPressure: '120/80',
          temperature: 98.6,
          heartRate: 72
        },
        notes: 'Patient reports mild symptoms'
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 35,
        gender: 'Female',
        symptoms: ['Headache', 'Fatigue'],
        vitalSigns: {
          bloodPressure: '118/75',
          temperature: 98.4,
          heartRate: 68
        },
        notes: 'Follow-up required in 2 weeks'
      }
    ];
  }

  public static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  async savePatientData(data: PatientData): Promise<void> {
    // Mock implementation - store in memory
    this.mockData.push(data);
    console.log('Saving patient data (mock):', data);
  }

  async getPatientData(): Promise<PatientData[]> {
    // Return mock data
    return Promise.resolve(this.mockData);
  }
}

export const sheetsService = GoogleSheetsService.getInstance();
