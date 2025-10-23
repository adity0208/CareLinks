import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { handleFirebaseError } from '../lib/errors';

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    clinicName: string;
    role: 'chw' | 'doctor' | 'nurse' | 'admin';
    createdAt: Date;
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string, clinicName: string, role: 'chw' | 'doctor' | 'nurse' | 'admin') => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function register(email: string, password: string, displayName: string, clinicName: string, role: 'chw' | 'doctor' | 'nurse' | 'admin') {
        try {
            setError(null);
            if (!auth || !db) {
                throw new Error('Firebase is not properly initialized');
            }

            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile
            await updateProfile(user, { displayName });

            // Create user profile in Firestore
            const userProfile: UserProfile = {
                uid: user.uid,
                email: user.email!,
                displayName,
                clinicName,
                role,
                createdAt: new Date()
            };

            await setDoc(doc(db, 'users', user.uid), userProfile);
            setUserProfile(userProfile);
        } catch (error: any) {
            const appError = handleFirebaseError(error);
            setError(appError.message);
            throw appError;
        }
    }

    async function login(email: string, password: string) {
        try {
            setError(null);
            if (!auth) {
                throw new Error('Firebase Auth is not properly initialized');
            }
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            const appError = handleFirebaseError(error);
            setError(appError.message);
            throw appError;
        }
    }

    async function logout() {
        try {
            setError(null);
            setUserProfile(null);
            if (auth) {
                await signOut(auth);
            }
        } catch (error: any) {
            const appError = handleFirebaseError(error);
            setError(appError.message);
            throw appError;
        }
    }

    async function resetPassword(email: string) {
        try {
            setError(null);
            if (!auth) {
                throw new Error('Firebase Auth is not properly initialized');
            }
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            const appError = handleFirebaseError(error);
            setError(appError.message);
            throw appError;
        }
    }

    function clearError() {
        setError(null);
    }

    useEffect(() => {
        // Check if Firebase is properly initialized
        if (!auth) {
            setError('Firebase is not properly configured. Please check your environment variables.');
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                setCurrentUser(user);

                if (user && db) {
                    // Fetch user profile from Firestore
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data() as UserProfile);
                    }

                    // Handle redirect after login
                    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
                    if (redirectPath) {
                        sessionStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirectPath;
                    }
                } else {
                    setUserProfile(null);
                }
            } catch (error: any) {
                console.error('Error in auth state change:', error);
                const appError = handleFirebaseError(error);
                setError(appError.message);
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value: AuthContextType = {
        currentUser,
        userProfile,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}