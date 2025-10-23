// Database factory - creates the appropriate adapter based on configuration
import { DatabaseService, AuthService, DatabaseConfig } from './interfaces';
import { FirebaseAdapter } from './firebase-adapter';
import { SupabaseAdapter } from './supabase-adapter';

export class DatabaseFactory {
    private static databaseInstance: DatabaseService | null = null;
    private static authInstance: AuthService | null = null;

    static createDatabase(config: DatabaseConfig): DatabaseService {
        if (this.databaseInstance) {
            return this.databaseInstance;
        }

        switch (config.provider) {
            case 'firebase':
                this.databaseInstance = new FirebaseAdapter();
                break;
            case 'supabase':
                this.databaseInstance = new SupabaseAdapter();
                break;
            case 'mongodb':
                // this.databaseInstance = new MongoAdapter();
                throw new Error('MongoDB adapter not implemented yet');
            case 'postgresql':
                // this.databaseInstance = new PostgreSQLAdapter();
                throw new Error('PostgreSQL adapter not implemented yet');
            default:
                throw new Error(`Unsupported database provider: ${config.provider}`);
        }

        return this.databaseInstance;
    }

    static createAuth(config: DatabaseConfig): AuthService {
        if (this.authInstance) {
            return this.authInstance;
        }

        switch (config.provider) {
            case 'firebase':
                // this.authInstance = new FirebaseAuthAdapter();
                throw new Error('Firebase auth adapter not implemented yet');
            case 'supabase':
                // this.authInstance = new SupabaseAuthAdapter();
                throw new Error('Supabase auth adapter not implemented yet');
            default:
                throw new Error(`Unsupported auth provider: ${config.provider}`);
        }

        return this.authInstance;
    }

    // Reset instances (useful for testing or switching providers)
    static reset(): void {
        this.databaseInstance = null;
        this.authInstance = null;
    }
}

// Configuration from environment
export const getDatabaseConfig = (): DatabaseConfig => {
    const provider = (import.meta.env.VITE_DATABASE_PROVIDER || 'firebase') as DatabaseConfig['provider'];

    return {
        provider,
        config: {
            // Firebase config
            firebase: {
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                // ... other firebase config
            },
            // Supabase config
            supabase: {
                url: import.meta.env.VITE_SUPABASE_URL,
                anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            // Other providers...
        }
    };
};

// Singleton instances
export const database = DatabaseFactory.createDatabase(getDatabaseConfig());
// export const auth = DatabaseFactory.createAuth(getDatabaseConfig());