/**
 * Type definitions for Safety Monitor
 */

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

export interface VitalSigns {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
}
