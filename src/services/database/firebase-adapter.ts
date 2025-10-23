// Firebase implementation of DatabaseService
import { DatabaseService, QueryOptions, CacheService } from './interfaces';
import { db } from '../../config/firebase';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    limit,
    Timestamp,
} from 'firebase/firestore';
import { MemoryCache } from './cache';

export class FirebaseAdapter implements DatabaseService {
    private cache: CacheService;

    constructor(cache?: CacheService) {
        this.cache = cache || new MemoryCache();
    }

    async create<T>(collection: string, data: Omit<T, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(db, collection), {
            ...data,
            createdAt: new Date(),
        });
        this.cache.delete(`collection_${collection}`);
        return docRef.id;
    }

    async getAll<T>(collectionName: string, options?: QueryOptions): Promise<T[]> {
        const cacheKey = `collection_${collectionName}_${JSON.stringify(options)}`;
        const cached = this.cache.get<T[]>(cacheKey);

        if (cached) return cached;

        let q = query(collection(db, collectionName));

        if (options?.orderBy) {
            q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
        }

        if (options?.where) {
            options.where.forEach(condition => {
                q = query(q, where(condition.field, condition.operator, condition.value));
            });
        }

        if (options?.limit) {
            q = query(q, limit(options.limit));
        }

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...this.convertFirebaseData(doc.data()),
        })) as T[];

        this.cache.set(cacheKey, results);
        return results;
    }

    async getById<T>(collectionName: string, id: string): Promise<T | null> {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return null;

        return {
            id: docSnap.id,
            ...this.convertFirebaseData(docSnap.data()),
        } as T;
    }

    async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data as any);
        this.cache.delete(`collection_${collectionName}`);
    }

    async delete(collectionName: string, id: string): Promise<void> {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        this.cache.delete(`collection_${collectionName}`);
    }

    // User-scoped operations
    async createUserScoped<T>(userId: string, collectionName: string, data: Omit<T, 'id'>): Promise<string> {
        const userCollection = `users/${userId}/${collectionName}`;
        return this.create(userCollection, data);
    }

    async getAllUserScoped<T>(userId: string, collectionName: string, options?: QueryOptions): Promise<T[]> {
        const userCollection = `users/${userId}/${collectionName}`;
        return this.getAll(userCollection, options);
    }

    async updateUserScoped<T>(userId: string, collectionName: string, id: string, data: Partial<T>): Promise<void> {
        const userCollection = `users/${userId}/${collectionName}`;
        return this.update(userCollection, id, data);
    }

    async deleteUserScoped(userId: string, collectionName: string, id: string): Promise<void> {
        const userCollection = `users/${userId}/${collectionName}`;
        return this.delete(userCollection, id);
    }

    clearCache(): void {
        this.cache.clear();
    }

    clearUserCache(userId: string): void {
        // Clear all cache entries for this user
        this.cache.clear(); // For simplicity, clear all cache
    }

    private convertFirebaseData(data: any): any {
        const converted = { ...data };

        // Convert Firebase Timestamps to regular Dates
        Object.keys(converted).forEach(key => {
            if (converted[key] instanceof Timestamp) {
                converted[key] = converted[key].toDate();
            }
        });

        return converted;
    }
}