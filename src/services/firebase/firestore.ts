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
    FirestoreError
} from 'firebase/firestore';

// Patient data structure
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
    mobileNumber: string;
    createdAt?: Date | null;
    hasAppointment?: boolean;
}

// Reference to the Firestore 'patients' collection
const patientsCollectionRef = collection(db, "patients");

class FirestoreService {
    private static instance: FirestoreService | null = null;
    private readonly COLLECTION_NAME = 'patients';

    private constructor() { }

    public static getInstance(): FirestoreService {
        if (!FirestoreService.instance) {
            FirestoreService.instance = new FirestoreService();
        }
        return FirestoreService.instance;
    }

    async savePatientData(data: Omit<PatientData, 'id' | 'createdAt'>): Promise<string> {
        try {
            console.log('Attempting to save patient data:', data);
            const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
                ...data,
                createdAt: new Date()
            });

            console.log('Patient data saved to Firestore with ID:', docRef.id);
            return docRef.id;
        } catch (error: any) {
            console.error('Error saving patient data to Firestore:', error);
            throw error;
        }
    }

    private transformPatientData(doc: any): PatientData {
        const data = doc.data();
        const createdAt = data['createdAt'] as Timestamp;

        return {
            id: doc.id,
            name: data['name'],
            age: data['age'],
            gender: data['gender'],
            symptoms: data['symptoms'],
            vitalSigns: {
                bloodPressure: data['vitalSigns'] ? data['vitalSigns']?.bloodPressure || '' : '',
                temperature: data['vitalSigns'] ? data['vitalSigns']?.temperature || 0 : 0,
                heartRate: data['vitalSigns'] ? data['vitalSigns']?.heartRate || 0 : 0,
            },
            notes: data['notes'],
            mobileNumber: data['mobileNumber'],
            createdAt: createdAt ? createdAt.toDate() : null
        } as PatientData;
    }

    async getPatientData(): Promise<PatientData[]> {
        try {
            console.log('Fetching patient data from Firestore...');
            const q = query(
                collection(db, this.COLLECTION_NAME),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.warn('No patient data found in Firestore.');
                return [];
            }

            const patients: PatientData[] = querySnapshot.docs.map(doc => this.transformPatientData(doc));

            console.log('Fetched patient data successfully:', patients);
            return patients;
        } catch (error: any) {
            console.error('Error fetching patient data from Firestore:', error);
            throw error;
        }
    }

    async updatePatientData(id: string, data: Omit<PatientData, 'id' | 'createdAt'>): Promise<void> {
        try {
            console.log(`Updating patient data with ID: ${id}`, data);
            const patientDocRef = doc(db, this.COLLECTION_NAME, id);
            await updateDoc(patientDocRef, data);
            console.log('Patient data updated in Firestore:', data);
        } catch (error: any) {
            console.error('Error updating patient data in Firestore:', error.message);
            throw error;
        }
    }

    async deletePatientData(id: string): Promise<void> {
        try {
            console.log(`Deleting patient data with ID: ${id}`);
            const patientDocRef = doc(db, this.COLLECTION_NAME, id);
            await deleteDoc(patientDocRef);
            console.log('Patient data deleted from Firestore:', id);
        } catch (error: any) {
            console.error('Error deleting patient data from Firestore:', error);
            throw error;
        }
    }

    async getAppointmentData(): Promise<AppointmentData[]> {
        try {
            console.log('Fetching appointment data from Firestore...');
            const q = query(collection(db, "appointments"), orderBy('appointmentDate', 'desc'));
            const querySnapshot = await getDocs(q);

            const appointments: AppointmentData[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                let appointmentDate: Date;

                if (data.appointmentDate instanceof Timestamp) {
                    appointmentDate = data.appointmentDate.toDate();
                } else if (data.appointmentDate instanceof Date) {
                    appointmentDate = data.appointmentDate;
                } else {
                    console.error('Invalid appointmentDate format:', data.appointmentDate);
                    throw new Error('Invalid appointmentDate format in Firestore');
                }

                return {
                    patientId: data.patientId,
                    patientName: data.patientName,
                    appointmentDate: appointmentDate,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || null,
                };
            });

            console.log('Fetched appointment data successfully:', appointments);
            return appointments;
        } catch (error: any) {
            console.error('Error fetching appointment data from Firestore:', error);
            throw error;
        }
    }

    async saveAppointmentData(data: AppointmentData): Promise<string> {
        try {
            console.log('Attempting to save appointment data:', data);
            const docRef = await addDoc(collection(db, "appointments"), {
                ...data,
                createdAt: new Date()
            });
            console.log('Appointment data saved to Firestore with ID:', docRef.id);
            return docRef.id;
        } catch (error: any) {
            console.error('Error saving appointment data to Firestore:', error);
            throw error;
        }
    }
}

export const firestoreService = FirestoreService.getInstance();

export interface AppointmentData {
    patientId: string;
    patientName: string;
    appointmentDate: Date;
    createdAt?: Date;
}