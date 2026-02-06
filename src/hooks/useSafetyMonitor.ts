/**
 * useSafetyMonitor Hook
 * 
 * Monitors patient symptoms and vitals for medical red flags using
 * server-side AI analysis via Firebase Cloud Functions.
 * 
 * Features:
 * - Debounced input monitoring (500ms delay)
 * - Automatic safety analysis on input changes
 * - Loading and error state management
 * - Emergency detection alerts
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export interface SafetyAnalysis {
    isEmergency: boolean;
    redFlags: string[];
    recommendation: string;
}

export interface SafetyMonitorResult {
    analysis: SafetyAnalysis | null;
    loading: boolean;
    error: string | null;
    lastChecked: Date | null;
}

interface UseSafetyMonitorParams {
    symptoms: string[];
    vitals: {
        temperature: number;
        bloodPressure: string;
        heartRate: number;
    };
    patientId: string;
    enabled?: boolean;
    debounceMs?: number;
}

/**
 * Custom hook for real-time patient safety monitoring
 * 
 * @param symptoms - Array of patient symptoms
 * @param vitals - Patient vital signs
 * @param patientId - Patient document ID
 * @param enabled - Whether monitoring is active (default: true)
 * @param debounceMs - Debounce delay in milliseconds (default: 500)
 * @returns Safety analysis result with loading and error states
 */
export function useSafetyMonitor({
    symptoms,
    vitals,
    patientId,
    enabled = true,
    debounceMs = 500,
}: UseSafetyMonitorParams): SafetyMonitorResult {
    const [analysis, setAnalysis] = useState<SafetyAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    // Ref to track the debounce timeout
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Ref to track if component is mounted
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    /**
     * Calls the Cloud Function to analyze patient safety
     */
    const analyzeSafety = useCallback(async () => {
        // Skip if monitoring is disabled
        if (!enabled) return;

        // Validate inputs
        if (!patientId) {
            setError('Patient ID is required');
            return;
        }

        if (!symptoms || symptoms.length === 0) {
            // No symptoms to analyze, clear previous analysis
            setAnalysis(null);
            setError(null);
            return;
        }

        if (!vitals || !vitals.temperature || !vitals.bloodPressure || !vitals.heartRate) {
            setError('Complete vital signs are required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Call the Cloud Function
            const analyzePatientSafety = httpsCallable(functions, 'analyzePatientSafety');

            const result = await analyzePatientSafety({
                symptoms,
                vitals,
                patientId,
            });

            // Only update state if component is still mounted
            if (!isMountedRef.current) return;

            const data = result.data as {
                success: boolean;
                analysis: SafetyAnalysis;
                timestamp: string;
            };

            if (data.success) {
                setAnalysis(data.analysis);
                setLastChecked(new Date(data.timestamp));
            } else {
                setError('Safety analysis failed. Please try again.');
            }
        } catch (err: any) {
            if (!isMountedRef.current) return;

            console.error('Safety analysis error:', err);

            // Extract user-friendly error message
            let errorMessage = 'Failed to analyze patient safety. Please try again.';

            if (err.code === 'unauthenticated') {
                errorMessage = 'You must be logged in to perform safety analysis.';
            } else if (err.code === 'permission-denied') {
                errorMessage = 'You do not have permission to analyze this patient.';
            } else if (err.code === 'not-found') {
                errorMessage = 'Patient record not found.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            setAnalysis(null);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [symptoms, vitals, patientId, enabled]);

    /**
     * Debounced effect that triggers safety analysis when inputs change
     */
    useEffect(() => {
        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Skip if monitoring is disabled
        if (!enabled) {
            setAnalysis(null);
            setError(null);
            return;
        }

        // Set new debounce timer
        debounceTimerRef.current = setTimeout(() => {
            analyzeSafety();
        }, debounceMs);

        // Cleanup function
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [symptoms, vitals, patientId, enabled, debounceMs, analyzeSafety]);

    return {
        analysis,
        loading,
        error,
        lastChecked,
    };
}
