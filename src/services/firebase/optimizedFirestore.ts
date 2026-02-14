// Optimized Firestore service with caching and minimal logging
import { db } from '../../config/firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp,
} from 'firebase/firestore';
import { logger } from '../../utils/logger';

// Types
export interface PatientData {
    id: string;
    name: string;
    age: number;
    gender: string;
    symptoms?: string[];
    vitalSigns?: {
        bloodPressure?: string;
        temperature?: number | string;
        heartRate?: number | string;
    };
    notes?: string;
    mobileNumber?: string;
    createdAt?: Date | null;
    hasAppointment?: boolean;
}

export interface AppointmentData {
    id: string;
    patientId: string;
    patientName: string;
    appointmentDate: Date;
    createdAt?: Date;
}

export interface ChildData {
    childId: string;
    name: string;
    dateOfBirth: Date | null;
    gender: string;
    malnutritionStatus: string;
    weight: number;
    height: number;
    nextAppointment?: string;
    mobileNumber?: string;
}

// Cache implementation
class DataCache {
    private cache = new Map<string, { data: any; timestamp: number }>();
    private readonly CACHE_DURATION = 30000; // 30 seconds

    get<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    set<T>(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

class OptimizedFirestoreService {
    private static instance: OptimizedFirestoreService | null = null;
    private cache = new DataCache();
    private readonly PATIENTS_COLLECTION = 'patients';
    private readonly CHILDREN_COLLECTION = 'children';
    private readonly APPOINTMENTS_COLLECTION = 'appointments';

    private constructor() { }

    public static getInstance(): OptimizedFirestoreService {
        if (!OptimizedFirestoreService.instance) {
            OptimizedFirestoreService.instance = new OptimizedFirestoreService();
        }
        return OptimizedFirestoreService.instance;
    }

    // Patient operations
    async getPatientData(userId: string): Promise<PatientData[]> {
        const cacheKey = `patients_${userId}`;
        const cached = this.cache.get<PatientData[]>(cacheKey);

        if (cached) {
            logger.debug('Using cached patient data');
            return cached;
        }

        try {
            const q = query(
                collection(db, `users/${userId}/${this.PATIENTS_COLLECTION}`),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            const patients: PatientData[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    age: data.age,
                    gender: data.gender,
                    symptoms: data.symptoms || [],
                    vitalSigns: data.vitalSigns || undefined,
                    notes: data.notes || '',
                    mobileNumber: data.mobileNumber || '',
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
                    hasAppointment: data.hasAppointment || false,
                };
            });

            this.cache.set(cacheKey, patients);
            logger.debug('Fetched and cached patient data', patients);
            return patients;
        } catch (error: any) {
            logger.error('Error fetching patient data', error);
            throw error;
        }
    }

    async savePatientData(data: Omit<PatientData, 'id' | 'createdAt'>, userId: string): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, `users/${userId}/${this.PATIENTS_COLLECTION}`), {
                ...data,
                createdAt: new Date(),
                userId,
            });

            // Invalidate cache
            this.cache.delete(`patients_${userId}`);
            logger.info('Patient data saved successfully');
            return docRef.id;
        } catch (error: any) {
            logger.error('Error saving patient data', error);
            throw error;
        }
    }

    async updatePatientData(id: string, data: Partial<Omit<PatientData, 'id' | 'createdAt'>>, userId: string): Promise<void> {
        try {
            const patientDocRef = doc(db, `users/${userId}/${this.PATIENTS_COLLECTION}`, id);
            await updateDoc(patientDocRef, data);

            // Invalidate cache
            this.cache.delete(`patients_${userId}`);
            logger.info('Patient data updated successfully');
        } catch (error: any) {
            logger.error('Error updating patient data', error);
            throw error;
        }
    }

    async deletePatientData(id: string, userId: string): Promise<void> {
        try {
            const patientDocRef = doc(db, `users/${userId}/${this.PATIENTS_COLLECTION}`, id);
            await deleteDoc(patientDocRef);

            // Invalidate cache
            this.cache.delete(`patients_${userId}`);
            logger.info('Patient data deleted successfully');
        } catch (error: any) {
            logger.error('Error deleting patient data', error);
            throw error;
        }
    }

    // Appointment operations
    async getAppointmentData(userId: string): Promise<AppointmentData[]> {
        const cacheKey = `appointments_${userId}`;
        const cached = this.cache.get<AppointmentData[]>(cacheKey);

        if (cached) {
            logger.debug('Using cached appointment data');
            return cached;
        }

        try {
            const q = query(
                collection(db, `users/${userId}/${this.APPOINTMENTS_COLLECTION}`),
                orderBy('appointmentDate', 'desc')
            );
            const querySnapshot = await getDocs(q);

            const appointments: AppointmentData[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                let appointmentDate: Date;

                if (data.appointmentDate instanceof Timestamp) {
                    appointmentDate = data.appointmentDate.toDate();
                } else if (data.appointmentDate instanceof Date) {
                    appointmentDate = data.appointmentDate;
                } else {
                    appointmentDate = new Date();
                }

                return {
                    id: doc.id,
                    patientId: data.patientId,
                    patientName: data.patientName,
                    appointmentDate: appointmentDate,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || undefined,
                };
            });

            this.cache.set(cacheKey, appointments);
            logger.debug('Fetched and cached appointment data', appointments);
            return appointments;
        } catch (error: any) {
            logger.error('Error fetching appointment data', error);
            throw error;
        }
    }

    async saveAppointmentData(data: Omit<AppointmentData, 'id' | 'createdAt'>, userId: string): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, `users/${userId}/${this.APPOINTMENTS_COLLECTION}`), {
                ...data,
                appointmentDate: Timestamp.fromDate(data.appointmentDate),
                createdAt: new Date(),
            });

            // Invalidate cache
            this.cache.delete(`appointments_${userId}`);
            logger.info('Appointment data saved successfully');
            return docRef.id;
        } catch (error: any) {
            logger.error('Error saving appointment data', error);
            throw error;
        }
    }

    // Children operations
    async getChildrenData(userId: string): Promise<ChildData[]> {
        const cacheKey = `children_${userId}`;
        const cached = this.cache.get<ChildData[]>(cacheKey);

        if (cached) {
            logger.debug('Using cached children data');
            return cached;
        }

        try {
            const q = query(collection(db, `users/${userId}/${this.CHILDREN_COLLECTION}`));
            const querySnapshot = await getDocs(q);

            const children: ChildData[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                let dateOfBirth: Date | null = null;

                if (data.dateOfBirth instanceof Timestamp) {
                    dateOfBirth = data.dateOfBirth.toDate();
                } else if (data.dateOfBirth instanceof Date) {
                    dateOfBirth = data.dateOfBirth;
                } else if (data.dateOfBirth == null) {
                    dateOfBirth = null;
                }

                return {
                    childId: doc.id,
                    name: data.name,
                    dateOfBirth: dateOfBirth,
                    gender: data.gender,
                    malnutritionStatus: data.malnutritionStatus,
                    weight: data.weight,
                    height: data.height,
                    nextAppointment: data.nextAppointment,
                    mobileNumber: data.mobileNumber,
                };
            });

            this.cache.set(cacheKey, children);
            logger.debug('Fetched and cached children data', children);
            return children;
        } catch (error: any) {
            logger.error('Error fetching children data', error);
            throw error;
        }
    }

    async saveChildData(childData: Omit<ChildData, 'childId'>, userId: string): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, `users/${userId}/${this.CHILDREN_COLLECTION}`), childData);

            // Invalidate cache
            this.cache.delete(`children_${userId}`);
            logger.info('Child data saved successfully');
            return docRef.id;
        } catch (error: any) {
            logger.error('Error saving child data', error);
            throw error;
        }
    }

    async updateChildData(childId: string, childData: Partial<Omit<ChildData, 'childId'>>, userId: string): Promise<void> {
        try {
            const childDocRef = doc(db, `users/${userId}/${this.CHILDREN_COLLECTION}`, childId);
            await updateDoc(childDocRef, childData);

            // Invalidate cache
            this.cache.delete(`children_${userId}`);
            logger.info('Child data updated successfully');
        } catch (error: any) {
            logger.error('Error updating child data', error);
            throw error;
        }
    }

    async deleteChildData(childId: string, userId: string): Promise<void> {
        try {
            const childDocRef = doc(db, `users/${userId}/${this.CHILDREN_COLLECTION}`, childId);
            await deleteDoc(childDocRef);

            // Invalidate cache
            this.cache.delete(`children_${userId}`);
            logger.info('Child data deleted successfully');
        } catch (error: any) {
            logger.error('Error deleting child data', error);
            throw error;
        }
    }

    // Cache management
    clearCache(): void {
        this.cache.clear();
        logger.info('Cache cleared');
    }

    clearUserCache(userId: string): void {
        this.cache.delete(`patients_${userId}`);
        this.cache.delete(`appointments_${userId}`);
        this.cache.delete(`children_${userId}`);
        logger.info('User cache cleared');
    }
}

export const optimizedFirestoreService = OptimizedFirestoreService.getInstance();