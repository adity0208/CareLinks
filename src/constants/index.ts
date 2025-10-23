/**
 * Application constants and error messages
 */

export const ERROR_MESSAGES = {
    // Generic errors
    GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
    NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',

    // Authentication errors
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_NOT_FOUND: 'No user found with this email address.',
    EMAIL_ALREADY_EXISTS: 'An account with this email already exists.',
    WEAK_PASSWORD: 'Password should be at least 6 characters long.',

    // Validation errors
    VALIDATION_FAILED: 'Please check your input and try again.',
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid phone number.',

    // Firebase errors
    FIREBASE_CONFIG_ERROR: 'Firebase configuration is missing or invalid.',
    FIRESTORE_ERROR: 'Database operation failed. Please try again.',

    // Patient management errors
    PATIENT_NOT_FOUND: 'Patient record not found.',
    PATIENT_SAVE_ERROR: 'Failed to save patient information.',

    // Appointment errors
    APPOINTMENT_CONFLICT: 'This time slot is already booked.',
    APPOINTMENT_SAVE_ERROR: 'Failed to save appointment.',

    // File upload errors
    FILE_TOO_LARGE: 'File size is too large. Maximum size is 5MB.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload an image file.',
} as const;

export const APP_CONFIG = {
    // App metadata
    APP_NAME: 'CareLinks',
    APP_VERSION: '1.0.0',

    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,

    // File upload limits
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

    // Date formats
    DATE_FORMAT: 'YYYY-MM-DD',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY_DATE_FORMAT: 'MMM DD, YYYY',

    // Validation rules
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 50,
    MAX_DESCRIPTION_LENGTH: 500,
} as const;

export const USER_ROLES = {
    CHW: 'chw',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    ADMIN: 'admin',
} as const;

export const APPOINTMENT_STATUS = {
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
} as const;

export const PATIENT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DISCHARGED: 'discharged',
} as const;

export const VACCINATION_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    OVERDUE: 'overdue',
    SKIPPED: 'skipped',
} as const;

// Navigation routes
export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    PATIENTS: '/patients',
    APPOINTMENTS: '/appointments',
    ANALYTICS: '/analytics',
    VACCINATIONS: '/vaccinations',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    LOGIN: '/login',
    REGISTER: '/register',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    USER_PREFERENCES: 'carelinks_user_preferences',
    THEME: 'carelinks_theme',
    LANGUAGE: 'carelinks_language',
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
    PATIENTS: '/api/patients',
    APPOINTMENTS: '/api/appointments',
    ANALYTICS: '/api/analytics',
    VACCINATIONS: '/api/vaccinations',
    USERS: '/api/users',
} as const;