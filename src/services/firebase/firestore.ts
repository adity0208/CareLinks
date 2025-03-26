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
    FirestoreError // Import FirestoreError
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

    // Save patient data to Firestore
    async savePatientData(data: Omit<PatientData, 'id' | 'createdAt'>): Promise<string> {
        try {
            console.log('Attempting to save patient data:', data); // Debug log
            const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
                ...data,
                createdAt: new Date() // Save the current timestamp
            });

            console.log('Patient data saved to Firestore with ID:', docRef.id); // Success log
            return docRef.id;
        } catch (error: any) {
            console.error('Error saving patient data to Firestore:', error); // Error details
            throw error; // Re-throw the original error
        }
    }

    // Helper function to transform Firestore data to PatientData
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
                bloodPressure: data['vitalSigns']?.bloodPressure || '',
                temperature: data['vitalSigns']?.temperature || 0,
                heartRate: data['vitalSigns']?.heartRate || 0,
            },
            notes: data['notes'],
            mobileNumber: data['mobileNumber'],
            createdAt: createdAt ? createdAt.toDate() : null
        } as PatientData;
    }

    // Fetch patient data from Firestore
    async getPatientData(): Promise<PatientData[]> {
        try {
            console.log('Fetching patient data from Firestore...'); // Debug log
            const q = query(
                collection(db, this.COLLECTION_NAME),
                orderBy('createdAt', 'desc') // Order by creation time
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.warn('No patient data found in Firestore.'); // Handle empty collection
                return [];
            }

            const patients: PatientData[] = querySnapshot.docs.map(doc => this.transformPatientData(doc));

            console.log('Fetched patient data successfully:', patients); // Final success log
            return patients;
        } catch (error: any) {
            console.error('Error fetching patient data from Firestore:', error); // Error details
            throw error; // Re-throw the original error
        }
    }

    // Update existing patient data
    async updatePatientData(id: string, data: Omit<PatientData, 'id' | 'createdAt'>): Promise<void> {
        try {
            console.log(`Updating patient data with ID: ${id}`, data); // Debug log
            const patientDocRef = doc(db, this.COLLECTION_NAME, id);
            await updateDoc(patientDocRef, data);
            console.log('Patient data updated in Firestore:', data); // Success log
        } catch (error: any) {
            console.error('Error updating patient data in Firestore:', error.message); // Error details
            throw error; // Re-throw the original error
        }
    }

    // Delete patient data
    async deletePatientData(id: string): Promise<void> {
        try {
            console.log(`Deleting patient data with ID: ${id}`); // Debug log
            const patientDocRef = doc(db, this.COLLECTION_NAME, id);
            await deleteDoc(patientDocRef);
            console.log('Patient data deleted from Firestore:', id); // Success log
        } catch (error: any) {
            console.error('Error deleting patient data from Firestore:', error); // Error details
            throw error; // Re-throw the original error
        }
    }
}

// Export singleton instance
export const firestoreService = FirestoreService.getInstance();