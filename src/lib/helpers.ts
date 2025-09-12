import { HEALTHCARE_CONSTANTS } from '../constants';

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string): number {
    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    return age;
}

/**
 * Calculate BMI
 */
export function calculateBMI(weight: number, height: number): number {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

/**
 * Calculate risk level based on vital signs
 */
export function calculateRiskLevel(vitalSigns: {
    temperature?: number;
    heartRate?: number;
    bloodPressure?: string;
}): 'low' | 'medium' | 'high' {
    const { temperature, heartRate, bloodPressure } = vitalSigns;

    // High risk indicators
    if (temperature && temperature > 101) return 'high';
    if (heartRate && (heartRate > 100 || heartRate < 60)) return 'high';

    if (bloodPressure) {
        const [systolic, diastolic] = bloodPressure.split('/').map(Number);
        if (systolic > 140 || diastolic > 90) return 'high';
    }

    // Medium risk indicators
    if (temperature && temperature > 99.5) return 'medium';
    if (heartRate && (heartRate > 90 || heartRate < 70)) return 'medium';

    return 'low';
}

/**
 * Get next appointment date suggestion
 */
export function getNextAppointmentSuggestion(riskLevel: 'low' | 'medium' | 'high'): Date {
    const today = new Date();
    const daysToAdd = riskLevel === 'high' ? 7 : riskLevel === 'medium' ? 14 : 30;

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    return nextDate;
}

/**
 * Check if vital signs are normal
 */
export function areVitalSignsNormal(vitalSigns: {
    temperature?: number;
    heartRate?: number;
    bloodPressure?: string;
}): boolean {
    const { temperature, heartRate, bloodPressure } = vitalSigns;

    if (temperature) {
        const [min, max] = HEALTHCARE_CONSTANTS.VITAL_SIGNS.NORMAL_TEMP_RANGE;
        if (temperature < min || temperature > max) return false;
    }

    if (heartRate) {
        const [min, max] = HEALTHCARE_CONSTANTS.VITAL_SIGNS.NORMAL_HEART_RATE;
        if (heartRate < min || heartRate > max) return false;
    }

    if (bloodPressure) {
        const [systolic, diastolic] = bloodPressure.split('/').map(Number);
        const [minSys, maxSys] = HEALTHCARE_CONSTANTS.VITAL_SIGNS.NORMAL_BP_SYSTOLIC;
        const [minDia, maxDia] = HEALTHCARE_CONSTANTS.VITAL_SIGNS.NORMAL_BP_DIASTOLIC;

        if (systolic < minSys || systolic > maxSys || diastolic < minDia || diastolic > maxDia) {
            return false;
        }
    }

    return true;
}

/**
 * Generate patient summary
 */
export function generatePatientSummary(patient: {
    name: string;
    age: number;
    symptoms?: string[];
    vitalSigns?: any;
}): string {
    const riskLevel = calculateRiskLevel(patient.vitalSigns || {});
    const symptomsText = patient.symptoms?.length
        ? `Current symptoms: ${patient.symptoms.join(', ')}.`
        : 'No current symptoms reported.';

    return `${patient.name}, age ${patient.age}. Risk level: ${riskLevel}. ${symptomsText}`;
}

/**
 * Sort patients by priority (high risk first)
 */
export function sortPatientsByPriority<T extends { riskLevel?: string }>(patients: T[]): T[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 };

    return [...patients].sort((a, b) => {
        const aPriority = priorityOrder[a.riskLevel as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.riskLevel as keyof typeof priorityOrder] || 0;
        return bPriority - aPriority;
    });
}

/**
 * Check if appointment is overdue
 */
export function isAppointmentOverdue(appointmentDate: Date | string): boolean {
    const date = typeof appointmentDate === 'string' ? new Date(appointmentDate) : appointmentDate;
    return date < new Date();
}

/**
 * Get appointment status color
 */
export function getAppointmentStatusColor(status: string): string {
    switch (status) {
        case 'scheduled': return 'text-blue-600 bg-blue-50';
        case 'completed': return 'text-green-600 bg-green-50';
        case 'cancelled': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
    }
}