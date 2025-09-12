// Secure logging utility
const isDevelopment = import.meta.env.DEV;

export const logger = {
    info: (message: string, ...args: any[]) => {
        if (isDevelopment) {
            console.log(`[INFO] ${message}`, ...args);
        }
    },

    error: (message: string, error?: any) => {
        if (isDevelopment) {
            console.error(`[ERROR] ${message}`, error);
        }
        // In production, you might want to send to error tracking service
    },

    warn: (message: string, ...args: any[]) => {
        if (isDevelopment) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    },

    // Never log sensitive data like user IDs, API keys, etc.
    debug: (message: string, data?: any) => {
        if (isDevelopment) {
            // Sanitize sensitive data
            const sanitizedData = data ? sanitizeData(data) : undefined;
            console.log(`[DEBUG] ${message}`, sanitizedData);
        }
    }
};

// Remove sensitive information from logs
function sanitizeData(data: any): any {
    if (typeof data === 'string') {
        // Hide user IDs, API keys, etc.
        return data.replace(/[a-zA-Z0-9]{20,}/g, '[REDACTED]');
    }

    if (Array.isArray(data)) {
        return `Array(${data.length})`;
    }

    if (typeof data === 'object' && data !== null) {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(data)) {
            if (key.toLowerCase().includes('id') || key.toLowerCase().includes('key')) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = typeof value === 'object' ? '[Object]' : value;
            }
        }
        return sanitized;
    }

    return data;
}