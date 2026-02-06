/**
 * VitalInput Component
 * 
 * Smart input field for vital signs with visual health indicators.
 * Features:
 * - Color-coded borders based on clinical thresholds
 * - Real-time validation
 * - Accessibility labels
 * - Warning icons for abnormal values
 */

import { useMemo } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface VitalThreshold {
    normal: { min: number; max: number };
    warning: { min: number; max: number };
    critical: { min: number; max: number };
}

interface VitalInputProps {
    label: string;
    value: number | string;
    onChange: (value: number | string) => void;
    type: 'temperature' | 'heartRate' | 'bloodPressure';
    unit?: string;
    disabled?: boolean;
}

// Clinical thresholds for vital signs
const VITAL_THRESHOLDS: Record<string, VitalThreshold> = {
    temperature: {
        normal: { min: 97.0, max: 99.5 },
        warning: { min: 95.0, max: 100.4 },
        critical: { min: 0, max: 103.0 },
    },
    heartRate: {
        normal: { min: 60, max: 100 },
        warning: { min: 50, max: 110 },
        critical: { min: 0, max: 120 },
    },
};

type VitalStatus = 'normal' | 'warning' | 'critical';

export function VitalInput({
    label,
    value,
    onChange,
    type,
    unit = '',
    disabled = false,
}: VitalInputProps) {
    // Determine vital status based on thresholds
    const vitalStatus: VitalStatus = useMemo(() => {
        if (type === 'bloodPressure') {
            // Blood pressure is a string like "120/80"
            const [systolic, diastolic] = String(value).split('/').map(Number);
            if (!systolic || !diastolic) return 'normal';

            if (systolic >= 140 || diastolic >= 90) return 'critical';
            if (systolic >= 130 || diastolic >= 85) return 'warning';
            return 'normal';
        }

        const numValue = Number(value);
        if (isNaN(numValue)) return 'normal';

        const threshold = VITAL_THRESHOLDS[type];
        if (!threshold) return 'normal';

        // Critical range
        if (numValue > threshold.critical.max || numValue < threshold.critical.min) {
            return 'critical';
        }

        // Warning range
        if (
            numValue > threshold.warning.max ||
            numValue < threshold.warning.min ||
            numValue < threshold.normal.min ||
            numValue > threshold.normal.max
        ) {
            return 'warning';
        }

        return 'normal';
    }, [value, type]);

    // Get status message
    const getStatusMessage = (): string | null => {
        if (type === 'bloodPressure') {
            const [systolic, diastolic] = String(value).split('/').map(Number);
            if (!systolic || !diastolic) return null;

            if (systolic >= 140 || diastolic >= 90) {
                return 'High blood pressure - Immediate attention needed';
            }
            if (systolic >= 130 || diastolic >= 85) {
                return 'Elevated blood pressure - Monitor closely';
            }
            return 'Blood pressure normal';
        }

        const numValue = Number(value);
        if (isNaN(numValue) || !value) return null;

        switch (type) {
            case 'temperature':
                if (numValue > 100.4) return 'Fever detected - Monitor for infection';
                if (numValue > 99.5) return 'Slightly elevated temperature';
                if (numValue < 97.0) return 'Low temperature - Check for hypothermia';
                return 'Temperature normal';

            case 'heartRate':
                if (numValue > 100) return 'Tachycardia - Elevated heart rate';
                if (numValue < 60) return 'Bradycardia - Low heart rate';
                return 'Heart rate normal';

            default:
                return null;
        }
    };

    // Style classes based on status
    const borderColor = {
        normal: 'border-green-300 focus:border-green-500 focus:ring-green-500',
        warning: 'border-amber-400 focus:border-amber-500 focus:ring-amber-500',
        critical: 'border-red-500 focus:border-red-600 focus:ring-red-600',
    }[vitalStatus];

    const bgColor = {
        normal: 'bg-white',
        warning: 'bg-amber-50',
        critical: 'bg-red-50',
    }[vitalStatus];

    const StatusIcon = {
        normal: CheckCircle,
        warning: AlertCircle,
        critical: AlertCircle,
    }[vitalStatus];

    const iconColor = {
        normal: 'text-green-600',
        warning: 'text-amber-600',
        critical: 'text-red-600',
    }[vitalStatus];

    const statusMessage = getStatusMessage();

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {unit && <span className="text-gray-500 ml-1">({unit})</span>}
            </label>

            <div className="relative">
                <input
                    type={type === 'bloodPressure' ? 'text' : 'number'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder={type === 'bloodPressure' ? '120/80' : '0'}
                    step={type === 'temperature' ? '0.1' : '1'}
                    className={`
            w-full px-4 py-2.5 pr-10 rounded-lg border-2 transition-all duration-200
            ${bgColor} ${borderColor}
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${vitalStatus !== 'normal' ? 'font-semibold' : ''}
          `}
                    aria-describedby={`${type}-status`}
                />

                {/* Status Icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <StatusIcon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
                <div
                    id={`${type}-status`}
                    className={`flex items-start gap-2 text-sm mt-1 ${vitalStatus === 'critical'
                        ? 'text-red-700'
                        : vitalStatus === 'warning'
                            ? 'text-amber-700'
                            : 'text-green-700'
                        }`}
                >
                    <span className="font-medium">{statusMessage}</span>
                </div>
            )}
        </div>
    );
}
