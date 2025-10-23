/**
 * Environment configuration with validation
 */

interface EnvConfig {
    // Firebase
    FIREBASE_API_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MESSAGING_SENDER_ID: string;
    FIREBASE_APP_ID: string;
    FIREBASE_MEASUREMENT_ID: string;

    // AI Services
    GEMINI_API_KEY: string;
    GOOGLE_TRANSLATION_API_KEY: string;

    // App Config
    NODE_ENV: 'development' | 'production' | 'test';
    DEV: boolean;
    PROD: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
    const value = import.meta.env[key] || defaultValue;
    if (!value) {
        console.warn(`Environment variable ${key} is required but not set`);
        return '';
    }
    return value;
}

function getOptionalEnvVar(key: string, defaultValue = ''): string {
    return import.meta.env[key] || defaultValue;
}

// Create environment configuration with safe defaults
let env: EnvConfig;

try {
    env = {
        // Firebase Configuration
        FIREBASE_API_KEY: getEnvVar('VITE_FIREBASE_API_KEY'),
        FIREBASE_AUTH_DOMAIN: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
        FIREBASE_PROJECT_ID: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
        FIREBASE_STORAGE_BUCKET: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
        FIREBASE_MESSAGING_SENDER_ID: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
        FIREBASE_APP_ID: getEnvVar('VITE_FIREBASE_APP_ID'),
        FIREBASE_MEASUREMENT_ID: getOptionalEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),

        // AI Services
        GEMINI_API_KEY: getEnvVar('VITE_GEMINI_API_KEY'),
        GOOGLE_TRANSLATION_API_KEY: getOptionalEnvVar('VITE_GOOGLE_TRANSLATION_API_KEY'),

        // App Environment
        NODE_ENV: (import.meta.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
        DEV: import.meta.env.DEV || false,
        PROD: import.meta.env.PROD || false,
    };
} catch (error) {
    console.error('Error loading environment configuration:', error);
    // Provide fallback configuration
    env = {
        FIREBASE_API_KEY: '',
        FIREBASE_AUTH_DOMAIN: '',
        FIREBASE_PROJECT_ID: '',
        FIREBASE_STORAGE_BUCKET: '',
        FIREBASE_MESSAGING_SENDER_ID: '',
        FIREBASE_APP_ID: '',
        FIREBASE_MEASUREMENT_ID: '',
        GEMINI_API_KEY: '',
        GOOGLE_TRANSLATION_API_KEY: '',
        NODE_ENV: 'development',
        DEV: true,
        PROD: false,
    };
}

export { env };

// Validate required environment variables
export function validateEnv(): void {
    const requiredVars = [
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_PROJECT_ID',
        'GEMINI_API_KEY'
    ];

    const missing = requiredVars.filter(key => !env[key as keyof EnvConfig]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

// Development helpers
export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';