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
import { v4 as uuidv4 } from 'uuid'; // Import uuid

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

// Child data structure
export interface ChildData {
    childId: string;
    name: string;
    dateOfBirth: Date | null; // Updated to Date | null
    gender: string;
    malnutritionStatus: string;
    weight: number;
    height: number;
    nextAppointment?: string;
    mobileNumber?: string;
}

// Appointment data structure
export interface AppointmentData {
    id: string;
    patientId: string;
    patientName: string;
    appointmentDate: Date;
    createdAt?: Date;
}

// Vaccination data structure
export interface VaccinationData {
    vaccinationId: string;
    childId: string;
    vaccineName: string;
    administeredDate: Date;
}

class FirestoreService {
    private static instance: FirestoreService | null = null;
    private readonly PATIENTS_COLLECTION = 'patients';
    private readonly CHILDREN_COLLECTION = 'children';
    private readonly VACCINATIONS_COLLECTION = 'vaccinations';

    private constructor() {}

    public static getInstance(): FirestoreService {
        if (!FirestoreService.instance) {
            FirestoreService.instance = new FirestoreService();
        }
        return FirestoreService.instance;
    }

    // Patient functions
    async savePatientData(data: Omit<PatientData, 'id' | 'createdAt'>): Promise<string> {
        try {
            console.log('Attempting to save patient data:', data);
            const docRef = await addDoc(collection(db, this.PATIENTS_COLLECTION), {
                ...data,
                createdAt: new Date(),
            });
            console.log('Patient data saved to Firestore with ID:', docRef.id);
            return docRef.id;
        } catch (error: any) {
            console.error('Error saving patient data to Firestore:', error);
            throw error;
        }
    }

    async getPatientData(): Promise<PatientData[]> {
        try {
            console.log('Fetching patient data from Firestore...');
            const q = query(collection(db, this.PATIENTS_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const patients: PatientData[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<PatientData, 'id'>),
            }));

            console.log('Fetched patient data successfully:', patients);
            return patients;
        } catch (error: any) {
            console.error('Error fetching patient data from Firestore:', error);
            throw error;
        }
    }

    async updatePatientData(id: string, data: Omit<PatientData, 'id'>): Promise<void> {
        try {
            console.log(`Updating patient data with ID: ${id}`, data);
            const patientDocRef = doc(db, this.PATIENTS_COLLECTION, id);
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
            const patientDocRef = doc(db, this.PATIENTS_COLLECTION, id);
            await deleteDoc(patientDocRef);
            console.log('Patient data deleted from Firestore:', id);
        } catch (error: any) {
            console.error('Error deleting patient data from Firestore:', error);
            throw error;
        }
    }

    // Child functions
    async getChildrenData(): Promise<ChildData[]> {
        try {
            console.log('Fetching children data from Firestore...');
            const q = query(collection(db, this.CHILDREN_COLLECTION));
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
                } else {
                    console.error('Invalid dateOfBirth format:', data.dateOfBirth);
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

            console.log('Fetched children data successfully:', children);
            return children;
        } catch (error: any) {
            console.error('Error fetching children data from Firestore:', error);
            throw error;
        }
    }

    async saveChildData(childData: Omit<ChildData, 'childId'>): Promise<void> {
        try {
            console.log('Attempting to save child data:', childData);
            await addDoc(collection(db, this.CHILDREN_COLLECTION), childData);
            console.log('Child data saved to Firestore:', childData);
        } catch (error: any) {
            console.error('Error saving child data to Firestore:', error);
            throw error;
        }
    }

    async updateChildData(childId: string, data: Omit<ChildData, 'childId'>): Promise<void> {
        try {
            console.log(`Updating child data with ID: ${childId}`, data);
            const childDocRef = doc(db, this.CHILDREN_COLLECTION, childId);
            await updateDoc(childDocRef, data);
            console.log('Child data updated in Firestore:', data);
        } catch (error: any) {
            console.error('Error updating child data in Firestore:', error.message);
            throw error;
        }
    }

    async deleteChildData(childId: string): Promise<void> {
        try {
            console.log(`Deleting child data with ID: ${childId}`);
            const childDocRef = doc(db, this.CHILDREN_COLLECTION, childId);
            await deleteDoc(childDocRef);
            console.log('Child data deleted from Firestore:', childId);
        } catch (error: any) {
            console.error('Error deleting child data from Firestore:', error);
            throw error;
        }
    }

    // Appointment functions
    async getAppointmentData(): Promise<AppointmentData[]> {
        try {
            console.log('Fetching appointment data from Firestore...');
            const q = query(collection(db, 'appointments'), orderBy('appointmentDate', 'desc'));
            const querySnapshot = await getDocs(q);

            const appointments: AppointmentData[] = querySnapshot.docs.map((doc) => {
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
                    id: data.id,
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

    async saveAppointmentData(data: Omit<AppointmentData, 'id' | 'createdAt'>): Promise<string> {
        try {
            console.log('Attempting to save appointment data:', data);
            const id = uuidv4();
            const docRef = await addDoc(collection(db, 'appointments'), {
                id: id,
                ...data,
                createdAt: new Date(),
            });
            console.log('Appointment data saved to Firestore with ID:', docRef.id);
            return id;
        } catch (error: any) {
            console.error('Error saving appointment data to Firestore:', error);
            throw error;
        }
    }

    // Vaccination functions
    async getVaccinationData(childId: string): Promise<VaccinationData[]> {
        try {
            console.log(`Fetching vaccination data for child ID: ${childId}`);
            const q = query(collection(db, this.VACCINATIONS_COLLECTION), orderBy('administeredDate', 'desc'));
            const querySnapshot = await getDocs(q);

            const vaccinations: VaccinationData[] = querySnapshot.docs
                .filter((doc) => doc.data().childId === childId)
                .map((doc) => ({
                    vaccinationId: doc.id,
                    ...(doc.data() as Omit<VaccinationData, 'vaccinationId'>),
                }));

            console.log('Fetched vaccination data successfully:', vaccinations);
            return vaccinations;
        } catch (error: any) {
            console.error('Error fetching vaccination data from Firestore:', error);
            throw error;
        }
    }

    async saveVaccinationData(vaccinationData: VaccinationData): Promise<void> {
        try {
            console.log('Attempting to save vaccination data:', vaccinationData);
            await addDoc(collection(db, this.VACCINATIONS_COLLECTION), vaccinationData);
            console.log('Vaccination data saved to Firestore:', vaccinationData);
        } catch (error: any) {
            console.error('Error saving vaccination data to Firestore:', error);
            throw error;
        }
    }

    // Analytics functions
    async getPatientDataForAnalytics(): Promise<PatientData[]> {
        try {
            console.log('Fetching patient data for analytics from Firestore...');
            const patientCollection = collection(db, 'patients');
            const querySnapshot = await getDocs(query(patientCollection));

            const patients: PatientData[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    age: data.age,
                    gender: data.gender,
                    medicalHistory: data.medicalHistory || [],
                    symptoms: data.symptoms || [],
                    vitalSigns: data.vitalSigns || { bloodPressure: '', temperature: '', heartRate: '' },
                    notes: data.notes || '',
                    mobileNumber: data.mobileNumber,
                };
            });

            console.log('Fetched patient data for analytics successfully:', patients);
            return patients;
        } catch (error: any) {
            console.error('Error fetching patient data for analytics from Firestore:', error);
            throw error;
        }
    }

    async getAppointmentDataForAnalytics(): Promise<AppointmentData[]> {
        try {
            console.log('Fetching appointment data for analytics from Firestore...');
            const appointmentCollection = collection(db, 'appointments');
            const querySnapshot = await getDocs(query(appointmentCollection));

            const appointments: AppointmentData[] = querySnapshot.docs.map((doc) => {
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
                    id: doc.id,
                    patientId: data.patientId,
                    patientName: data.patientName,
                    appointmentDate: appointmentDate,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || null,
                };
            });

            console.log('Fetched appointment data for analytics successfully:', appointments);
            return appointments;
        } catch (error: any) {
            console.error('Error fetching appointment data for analytics from Firestore:', error);
            throw error;
        }
    }
}

export const firestoreService = FirestoreService.getInstance();