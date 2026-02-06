/**
 * PatientFormModal Component
 * 
 * Comprehensive patient form with integrated Safety Monitor.
 * Features:
 * - Real-time AI safety analysis
 * - Visual vital indicators
 * - Emergency banner with quick actions
 * - Debounced AI calls (500ms)
 * - Accessible form design
 */

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafetyMonitor } from '../../hooks/useSafetyMonitor';
import { EmergencyBanner } from '../AI/EmergencyBanner';
import { VitalInput } from '../common/VitalInput';
import type { PatientData } from '../../services/firebase/optimizedFirestore';

interface PatientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (patient: Partial<PatientData>) => Promise<void>;
    patient?: PatientData | null;
    mode: 'add' | 'edit';
}

export function PatientFormModal({
    isOpen,
    onClose,
    onSave,
    patient,
    mode,
}: PatientFormModalProps) {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        age: 0,
        gender: '',
        mobileNumber: '',
        notes: '',
        symptomsInput: '',
        temperature: 98.6,
        bloodPressure: '120/80',
        heartRate: 72,
    });

    const [saving, setSaving] = useState(false);
    const [dismissedAlert, setDismissedAlert] = useState(false);

    // Initialize form with patient data if editing
    useEffect(() => {
        if (patient && mode === 'edit') {
            setFormData({
                name: patient.name || '',
                age: patient.age || 0,
                gender: patient.gender || '',
                mobileNumber: patient.mobileNumber || '',
                notes: patient.notes || '',
                symptomsInput: patient.symptoms?.join(', ') || '',
                temperature: typeof patient.vitalSigns?.temperature === 'number' ? patient.vitalSigns.temperature : Number(patient.vitalSigns?.temperature) || 98.6,
                bloodPressure: patient.vitalSigns?.bloodPressure || '120/80',
                heartRate: typeof patient.vitalSigns?.heartRate === 'number' ? patient.vitalSigns.heartRate : Number(patient.vitalSigns?.heartRate) || 72,
            });
        } else {
            // Reset form for add mode
            setFormData({
                name: '',
                age: 0,
                gender: '',
                mobileNumber: '',
                notes: '',
                symptomsInput: '',
                temperature: 98.6,
                bloodPressure: '120/80',
                heartRate: 72,
            });
        }
        setDismissedAlert(false);
    }, [patient, mode, isOpen]);

    // Parse symptoms into array
    const symptomsArray = formData.symptomsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    // Safety Monitor Integration
    const { analysis, loading: aiLoading, error: aiError } = useSafetyMonitor({
        symptoms: symptomsArray,
        vitals: {
            temperature: formData.temperature,
            bloodPressure: formData.bloodPressure,
            heartRate: formData.heartRate,
        },
        patientId: patient?.id || 'new-patient',
        enabled: isOpen && symptomsArray.length > 0,
        debounceMs: 500,
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.age || !formData.gender) {
            alert('Please fill in Patient Name, Age, and Gender.');
            return;
        }

        setSaving(true);
        try {
            const patientData: Partial<PatientData> = {
                name: formData.name,
                age: formData.age,
                gender: formData.gender,
                mobileNumber: formData.mobileNumber || '',
                notes: formData.notes || '',
                symptoms: symptomsArray.length > 0 ? symptomsArray : undefined,
                vitalSigns: {
                    temperature: formData.temperature,
                    bloodPressure: formData.bloodPressure,
                    heartRate: formData.heartRate,
                },
            };

            await onSave(patientData);
            onClose();
        } catch (error) {
            console.error('Error saving patient:', error);
            alert('Failed to save patient data. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleQuickReferral = (message: string) => {
        // Copy to clipboard
        navigator.clipboard.writeText(message);
        alert('Referral message copied to clipboard!');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {mode === 'add' ? '➕ Add New Patient' : '✏️ Edit Patient'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Emergency Banner */}
                        {analysis && !dismissedAlert && (
                            <div className="mb-6">
                                <EmergencyBanner
                                    analysis={analysis}
                                    patientName={formData.name || 'Patient'}
                                    patientContact={formData.mobileNumber}
                                    onDismiss={() => setDismissedAlert(true)}
                                    onQuickReferral={handleQuickReferral}
                                />
                            </div>
                        )}

                        {/* AI Loading Indicator */}
                        {aiLoading && (
                            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm font-medium">Analyzing patient safety...</span>
                            </div>
                        )}

                        {/* AI Error */}
                        {aiError && (
                            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">{aiError}</span>
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Patient Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter patient name"
                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Age <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.age || ''}
                                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                                    placeholder="Enter age"
                                    min="0"
                                    max="150"
                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.mobileNumber}
                                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                    placeholder="9876543210"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                            </div>
                        </div>

                        {/* Symptoms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Symptoms (comma-separated)
                            </label>
                            <input
                                type="text"
                                value={formData.symptomsInput}
                                onChange={(e) => handleInputChange('symptomsInput', e.target.value)}
                                placeholder="e.g., fever, cough, headache"
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                            {symptomsArray.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {symptomsArray.map((symptom, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full"
                                        >
                                            {symptom}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vital Signs with Visual Indicators */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                📊 Vital Signs
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <VitalInput
                                    label="Temperature"
                                    value={formData.temperature}
                                    onChange={(value) => handleInputChange('temperature', Number(value))}
                                    type="temperature"
                                    unit="°F"
                                />

                                <VitalInput
                                    label="Blood Pressure"
                                    value={formData.bloodPressure}
                                    onChange={(value) => handleInputChange('bloodPressure', value)}
                                    type="bloodPressure"
                                    unit="mmHg"
                                />

                                <VitalInput
                                    label="Heart Rate"
                                    value={formData.heartRate}
                                    onChange={(value) => handleInputChange('heartRate', Number(value))}
                                    type="heartRate"
                                    unit="bpm"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Additional notes or observations..."
                                rows={3}
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {mode === 'add' ? 'Add Patient' : 'Save Changes'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
