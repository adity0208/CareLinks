// Application Constants
export const APP_CONFIG = {
    name: 'CareLinks',
    version: '1.0.0',
    description: 'Healthcare Management System',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
    FIREBASE: {
        PATIENTS: 'patients',
        APPOINTMENTS: 'appointments',
        CHILDREN: 'children',
        VACCINATIONS: 'vaccinations',
    },
    GEMINI: {
        BASE_URL: 'https://generativelanguage.googleapis.com',
        MODEL: 'gemini-pro',
    },
} as const;

// UI Constants
export const UI_CONSTANTS = {
    SIDEBAR_WIDTH: 288,
    HEADER_HEIGHT: 56,
    MOBILE_BREAKPOINT: 768,
    ANIMATION_DURATION: 200,
} as const;

// Healthcare Constants
export const HEALTHCARE_CONSTANTS = {
    RISK_LEVELS: ['low', 'medium', 'high'] as const,
    APPOINTMENT_STATUSES: ['scheduled', 'completed', 'cancelled'] as const,
    VITAL_SIGNS: {
        NORMAL_TEMP_RANGE: [97.0, 99.5],
        NORMAL_HEART_RATE: [60, 100],
        NORMAL_BP_SYSTOLIC: [90, 140],
        NORMAL_BP_DIASTOLIC: [60, 90],
    },
} as const;

// Validation Constants
export const VALIDATION = {
    MIN_AGE: 0,
    MAX_AGE: 150,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    PHONE_REGEX: /^[+]?[\d\s\-\(\)]{10,15}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Time Constants
export const TIME_CONSTANTS = {
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    VALIDATION_FAILED: 'Please check your input and try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    PATIENT_CREATED: 'Patient created successfully!',
    PATIENT_UPDATED: 'Patient updated successfully!',
    PATIENT_DELETED: 'Patient deleted successfully!',
    APPOINTMENT_SCHEDULED: 'Appointment scheduled successfully!',
    DATA_SYNCED: 'Data synchronized successfully!',
} as const;