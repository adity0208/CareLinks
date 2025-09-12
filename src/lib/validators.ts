import { VALIDATION } from '../constants';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
    return VALIDATION.PHONE_REGEX.test(phone);
}

/**
 * Validate age range
 */
export function isValidAge(age: number): boolean {
    return age >= VALIDATION.MIN_AGE && age <= VALIDATION.MAX_AGE;
}

/**
 * Validate name length and format
 */
export function isValidName(name: string): boolean {
    const trimmed = name.trim();
    return trimmed.length >= VALIDATION.MIN_NAME_LENGTH &&
        trimmed.length <= VALIDATION.MAX_NAME_LENGTH &&
        /^[a-zA-Z\s]+$/.test(trimmed);
}

/**
 * Validate required field
 */
export function isRequired(value: any): boolean {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
}

/**
 * Validate blood pressure format (e.g., "120/80")
 */
export function isValidBloodPressure(bp: string): boolean {
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(bp)) return false;

    const [systolic, diastolic] = bp.split('/').map(Number);
    return systolic >= 70 && systolic <= 200 &&
        diastolic >= 40 && diastolic <= 120;
}

/**
 * Validate temperature range
 */
export function isValidTemperature(temp: number): boolean {
    return temp >= 90 && temp <= 110; // Fahrenheit
}

/**
 * Validate heart rate
 */
export function isValidHeartRate(hr: number): boolean {
    return hr >= 30 && hr <= 200;
}

/**
 * Patient data validation
 */
export interface PatientValidationResult {
    isValid: boolean;
    errors: string[];
}

export function validatePatientData(data: {
    name?: string;
    age?: number;
    gender?: string;
    mobileNumber?: string;
}): PatientValidationResult {
    const errors: string[] = [];

    if (!data.name || !isValidName(data.name)) {
        errors.push('Please enter a valid name (2-100 characters, letters only)');
    }

    if (!data.age || !isValidAge(data.age)) {
        errors.push('Please enter a valid age (0-150)');
    }

    if (!data.gender || !['male', 'female', 'other'].includes(data.gender)) {
        errors.push('Please select a valid gender');
    }

    if (data.mobileNumber && !isValidPhone(data.mobileNumber)) {
        errors.push('Please enter a valid phone number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}