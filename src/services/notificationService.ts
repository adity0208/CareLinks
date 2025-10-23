import { optimizedFirestoreService } from './firebase/optimizedFirestore';
import type { PatientData } from './firebase/optimizedFirestore';

export interface Notification {
    id: string;
    type: 'new_patient' | 'high_risk_patient' | 'ngo_registration' | 'appointment_reminder' | 'system_alert';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high' | 'critical';
    data?: any; // Additional data related to the notification
}

export interface NGORegistration {
    id: string;
    ngoName: string;
    location: string;
    contactPerson: string;
    services: string[];
    registrationDate: Date;
    status: 'pending' | 'approved' | 'rejected';
}

class NotificationService {
    private static instance: NotificationService;
    private notifications: Notification[] = [];
    private listeners: ((notifications: Notification[]) => void)[] = [];
    private lastCheckTimestamp: Date = new Date();

    private constructor() {
        // Initialize empty notifications array
        this.notifications = [];

        // Start real-time monitoring
        this.startRealTimeMonitoring();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }



    private startRealTimeMonitoring() {
        // Check for new data every 30 seconds
        setInterval(() => {
            this.checkForNewNotifications();
        }, 30000);
    }

    private async checkForNewNotifications() {
        try {
            // This would typically check your database for new entries
            // For now, we'll simulate real-time notifications

            // Simulate random notifications for demonstration
            if (Math.random() < 0.1) { // 10% chance every 30 seconds
                this.generateRandomNotification();
            }
        } catch (error) {
            console.error('Error checking for new notifications:', error);
        }
    }

    private generateRandomNotification() {
        const notificationTypes = [
            {
                type: 'new_patient' as const,
                title: 'New Patient Registered',
                getMessage: () => `New patient ${this.getRandomName()} has been added to the system.`,
                priority: 'medium' as const
            },
            {
                type: 'high_risk_patient' as const,
                title: 'High Risk Patient Alert',
                getMessage: () => `Patient ${this.getRandomName()} has been flagged as high risk.`,
                priority: 'critical' as const
            },
            {
                type: 'ngo_registration' as const,
                title: 'New NGO Registration',
                getMessage: () => `${this.getRandomNGOName()} NGO has registered for collaboration.`,
                priority: 'medium' as const
            },
            {
                type: 'appointment_reminder' as const,
                title: 'Upcoming Appointments',
                getMessage: () => `You have ${Math.floor(Math.random() * 5) + 1} appointments scheduled for today.`,
                priority: 'low' as const
            }
        ];

        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

        const notification: Notification = {
            id: Date.now().toString(),
            type: randomType.type,
            title: randomType.title,
            message: randomType.getMessage(),
            timestamp: new Date(),
            isRead: false,
            priority: randomType.priority
        };

        this.addNotification(notification);
    }

    private getRandomName(): string {
        const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor'];
        return names[Math.floor(Math.random() * names.length)];
    }

    private getRandomNGOName(): string {
        const ngoNames = ['Health First', 'Care Connect', 'Wellness Warriors', 'Community Health', 'Hope Foundation', 'Life Savers'];
        return ngoNames[Math.floor(Math.random() * ngoNames.length)];
    }

    public addNotification(notification: Notification) {
        this.notifications.unshift(notification); // Add to beginning

        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        this.notifyListeners();
    }

    public getNotifications(): Notification[] {
        return [...this.notifications];
    }

    public getUnreadCount(): number {
        return this.notifications.filter(n => !n.isRead).length;
    }

    public markAsRead(notificationId: string) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.notifyListeners();
        }
    }

    public markAllAsRead() {
        this.notifications.forEach(n => n.isRead = true);
        this.notifyListeners();
    }

    public deleteNotification(notificationId: string) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.notifyListeners();
    }

    public subscribe(listener: (notifications: Notification[]) => void) {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }

    // Method to manually trigger notifications for specific events
    public async checkForNewPatients(userId: string) {
        try {
            const patients = await optimizedFirestoreService.getPatientData(userId);

            // Check for patients added in the last 5 minutes
            const recentPatients = patients.filter(patient => {
                if (!patient.createdAt) return false;
                const patientDate = patient.createdAt instanceof Date ? patient.createdAt : new Date(patient.createdAt);
                return patientDate > new Date(Date.now() - 5 * 60 * 1000);
            });

            recentPatients.forEach(patient => {
                this.addNotification({
                    id: `patient_${patient.id}_${Date.now()}`,
                    type: 'new_patient',
                    title: 'New Patient Added',
                    message: `${patient.name} (Age ${patient.age}) has been registered in the system.`,
                    timestamp: new Date(),
                    isRead: false,
                    priority: 'medium',
                    data: { patientId: patient.id, patientName: patient.name }
                });

                // Check if it's a high-risk patient
                if (this.isHighRiskPatient(patient)) {
                    this.addNotification({
                        id: `high_risk_${patient.id}_${Date.now()}`,
                        type: 'high_risk_patient',
                        title: 'High Risk Patient Alert',
                        message: `${patient.name} has been flagged as high risk. Immediate attention required.`,
                        timestamp: new Date(),
                        isRead: false,
                        priority: 'critical',
                        data: { patientId: patient.id, patientName: patient.name, riskFactors: this.getRiskFactors(patient) }
                    });
                }
            });
        } catch (error) {
            console.error('Error checking for new patients:', error);
        }
    }

    private isHighRiskPatient(patient: PatientData): boolean {
        const symptoms = patient.symptoms || [];
        const vitalSigns = patient.vitalSigns;

        // High risk indicators
        const highRiskSymptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'high fever'];
        const hasHighRiskSymptoms = symptoms.some(symptom =>
            highRiskSymptoms.some(risk => symptom.toLowerCase().includes(risk))
        );

        // Check vital signs for high risk
        const hasHighBP = vitalSigns?.bloodPressure &&
            (vitalSigns.bloodPressure.includes('140') || vitalSigns.bloodPressure.includes('90'));
        const hasHighTemp = vitalSigns?.temperature &&
            (typeof vitalSigns.temperature === 'number' ? vitalSigns.temperature > 101 : parseFloat(String(vitalSigns.temperature)) > 101);

        return hasHighRiskSymptoms || hasHighBP || hasHighTemp || patient.age > 70;
    }

    private getRiskFactors(patient: PatientData): string[] {
        const factors: string[] = [];

        if (patient.age > 70) factors.push('Advanced age');
        if (patient.vitalSigns?.bloodPressure?.includes('140')) factors.push('High blood pressure');
        if (patient.vitalSigns?.temperature && parseFloat(String(patient.vitalSigns.temperature)) > 101) factors.push('High fever');
        if (patient.symptoms?.some(s => s.toLowerCase().includes('chest pain'))) factors.push('Chest pain');
        if (patient.symptoms?.some(s => s.toLowerCase().includes('breathing'))) factors.push('Breathing difficulties');

        return factors;
    }
}

export const notificationService = NotificationService.getInstance();