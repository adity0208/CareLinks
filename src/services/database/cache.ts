import { CacheService } from './interfaces';

export class MemoryCache implements CacheService {
    private cache = new Map<string, { data: any; timestamp: number; ttl?: number }>();
    private readonly DEFAULT_TTL = 30000; // 30 seconds

    get<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const ttl = cached.ttl || this.DEFAULT_TTL;
        if (Date.now() - cached.timestamp > ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    set<T>(key: string, data: T, ttl?: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.DEFAULT_TTL
        });
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}