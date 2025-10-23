// Database abstraction interfaces - vendor agnostic
export interface DatabaseConfig {
    provider: 'firebase' | 'supabase' | 'mongodb' | 'postgresql';
    config: Record<string, any>;
}

export interface QueryOptions {
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    limit?: number;
    where?: Array<{ field: string; operator: '==' | '!=' | '>' | '<' | '>=' | '<='; value: any }>;
}

export interface DatabaseService {
    // Collection/Table operations
    create<T>(collection: string, data: Omit<T, 'id'>): Promise<string>;
    getAll<T>(collection: string, options?: QueryOptions): Promise<T[]>;
    getById<T>(collection: string, id: string): Promise<T | null>;
    update<T>(collection: string, id: string, data: Partial<T>): Promise<void>;
    delete(collection: string, id: string): Promise<void>;

    // User-scoped operations (for multi-tenant apps)
    createUserScoped<T>(userId: string, collection: string, data: Omit<T, 'id'>): Promise<string>;
    getAllUserScoped<T>(userId: string, collection: string, options?: QueryOptions): Promise<T[]>;
    updateUserScoped<T>(userId: string, collection: string, id: string, data: Partial<T>): Promise<void>;
    deleteUserScoped(userId: string, collection: string, id: string): Promise<void>;

    // Cache management
    clearCache(): void;
    clearUserCache(userId: string): void;
}

export interface AuthService {
    signIn(email: string, password: string): Promise<User>;
    signUp(email: string, password: string): Promise<User>;
    signOut(): Promise<void>;
    getCurrentUser(): User | null;
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

// Cache interface
export interface CacheService {
    get<T>(key: string): T | null;
    set<T>(key: string, data: T, ttl?: number): void;
    delete(key: string): void;
    clear(): void;
}