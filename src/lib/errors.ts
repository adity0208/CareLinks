import { ERROR_MESSAGES } from '../constants';

/**
 * Custom error classes for better error handling
 */

export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        code: string = 'GENERIC_ERROR',
        statusCode: number = 500,
        isOperational: boolean = true
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = ERROR_MESSAGES.VALIDATION_FAILED) {
        super(message, 'VALIDATION_ERROR', 400);
    }
}

export class NetworkError extends AppError {
    constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR) {
        super(message, 'NETWORK_ERROR', 503);
    }
}

export class AuthError extends AppError {
    constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
        super(message, 'AUTH_ERROR', 401);
    }
}

export class FirebaseError extends AppError {
    constructor(message: string, originalError?: any) {
        super(message, 'FIREBASE_ERROR', 500);
        if (originalError) {
            this.stack = originalError.stack;
        }
    }
}

/**
 * Error handler utility functions
 */

export function handleFirebaseError(error: any): AppError {
    const errorCode = error.code || 'unknown';
    const errorMessage = error.message || ERROR_MESSAGES.GENERIC_ERROR;

    switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return new AuthError('Invalid credentials');

        case 'auth/too-many-requests':
            return new AppError('Too many failed attempts. Please try again later.', 'RATE_LIMIT', 429);

        case 'permission-denied':
            return new AuthError('You do not have permission to perform this action');

        case 'unavailable':
            return new NetworkError('Service temporarily unavailable');

        default:
            return new FirebaseError(errorMessage, error);
    }
}

export function handleApiError(error: any): AppError {
    if (error instanceof AppError) {
        return error;
    }

    if (error.name === 'NetworkError' || !navigator.onLine) {
        return new NetworkError();
    }

    if (error.status === 401 || error.status === 403) {
        return new AuthError();
    }

    if (error.status >= 400 && error.status < 500) {
        return new ValidationError(error.message);
    }

    return new AppError(error.message || ERROR_MESSAGES.GENERIC_ERROR);
}

/**
 * Error logging utility
 */
export function logError(error: Error, context?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
        if (context) {
            console.error('Context:', context);
        }
    }

    // In production, you might want to send errors to a logging service
    // Example: Sentry, LogRocket, etc.
}

/**
 * Safe async function wrapper
 */
export function safeAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
    return async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            logError(error as Error, { function: fn.name, args });
            return null;
        }
    };
}

/**
 * Retry utility for failed operations
 */
export async function retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (attempt === maxAttempts) {
                throw lastError;
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }

    throw lastError!;
}