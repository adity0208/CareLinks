// Vendor-agnostic patient service
import { database } from './database/factory';
import { PatientData } from './firebase/optimizedFirestore'; // We'll move this to types later

export class PatientService {
    private readonly COLLECTION_NAME = 'patients';

    async getPatients(userId: string): Promise<PatientData[]> {
        return database.getAllUserScoped<PatientData>(
            userId,
            this.COLLECTION_NAME,
            { orderBy: { field: 'createdAt', direction: 'desc' } }
        );
    }

    async createPatient(userId: string, patientData: Omit<PatientData, 'id' | 'createdAt'>): Promise<string> {
        return database.createUserScoped<PatientData>(userId, this.COLLECTION_NAME, patientData);
    }

    async updatePatient(userId: string, patientId: string, updates: Partial<PatientData>): Promise<void> {
        return database.updateUserScoped<PatientData>(userId, this.COLLECTION_NAME, patientId, updates);
    }

    async deletePatient(userId: string, patientId: string): Promise<void> {
        return database.deleteUserScoped(userId, this.COLLECTION_NAME, patientId);
    }

    clearCache(): void {
        database.clearCache();
    }

    clearUserCache(userId: string): void {
        database.clearUserCache(userId);
    }
}

export const patientService = new PatientService();