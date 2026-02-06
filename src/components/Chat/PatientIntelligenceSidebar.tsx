/**
 * Patient Intelligence Sidebar
 * 
 * Real-time display of extracted patient data from AI conversation
 * Features:
 * - Detected symptoms with color-coded tags
 * - Vital signs with clinical threshold indicators
 * - Risk level visualization
 * - Red flags alerts
 * - WhatsApp referral summary generation
 */

import { useState } from 'react';
import {
    Activity,
    AlertTriangle,
    Heart,
    Thermometer,
    TrendingUp,
    FileText,
    Send,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PatientExtraction, ChatMessage } from '../../types';
import { generateReferralSummary, generateWhatsAppLink } from '../../services/chat/chatService';

interface PatientIntelligenceSidebarProps {
    extraction: PatientExtraction;
    conversationHistory: ChatMessage[];
    patientName?: string;
}

export function PatientIntelligenceSidebar({
    extraction,
    conversationHistory,
    patientName = 'Patient'
}: PatientIntelligenceSidebarProps) {
    const [showReferralSuccess, setShowReferralSuccess] = useState(false);

    // Risk level configuration
    const riskConfig = {
        low: {
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-700',
            icon: CheckCircle,
            label: 'Low Risk'
        },
        moderate: {
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-300',
            textColor: 'text-yellow-700',
            icon: AlertCircle,
            label: 'Moderate Risk'
        },
        high: {
            color: 'orange',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-300',
            textColor: 'text-orange-700',
            icon: AlertTriangle,
            label: 'High Risk'
        },
        critical: {
            color: 'red',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-300',
            textColor: 'text-red-700',
            icon: AlertTriangle,
            label: 'CRITICAL - Urgent'
        }
    };

    const currentRisk = riskConfig[extraction.riskLevel];
    const RiskIcon = currentRisk.icon;

    // Vital signs validation
    const getTemperatureStatus = (temp?: number) => {
        if (!temp) return 'normal';
        if (temp > 101) return 'critical'; // Red flag
        if (temp > 99.5) return 'warning';
        if (temp < 97) return 'warning';
        return 'normal';
    };

    const getHeartRateStatus = (hr?: number) => {
        if (!hr) return 'normal';
        if (hr > 100) return 'critical'; // Tachycardia
        if (hr < 60) return 'critical'; // Bradycardia
        if (hr > 90 || hr < 70) return 'warning';
        return 'normal';
    };

    const getBloodPressureStatus = (bp?: string) => {
        if (!bp) return 'normal';
        const [systolic, diastolic] = bp.split('/').map(Number);
        if (systolic >= 140 || diastolic >= 90) return 'critical';
        if (systolic >= 130 || diastolic >= 85) return 'warning';
        return 'normal';
    };

    const statusColors = {
        normal: 'text-green-600 bg-green-50 border-green-200',
        warning: 'text-yellow-700 bg-yellow-50 border-yellow-300',
        critical: 'text-red-700 bg-red-50 border-red-300'
    };

    // Handle referral generation
    const handleGenerateReferral = () => {
        const summary = generateReferralSummary(patientName, extraction, conversationHistory);
        const whatsappLink = generateWhatsAppLink(summary);

        // Open WhatsApp with pre-filled message
        window.open(whatsappLink, '_blank');

        // Show success message
        setShowReferralSuccess(true);
        setTimeout(() => setShowReferralSuccess(false), 3000);
    };

    return (
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <div className="flex items-center space-x-2 text-white">
                    <Activity className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Patient Intelligence</h2>
                </div>
                <p className="text-purple-100 text-xs mt-1">Real-time AI extraction</p>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Risk Level Indicator */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`${currentRisk.bgColor} ${currentRisk.borderColor} border-2 rounded-xl p-4`}
                >
                    <div className="flex items-center space-x-3">
                        <RiskIcon className={`w-6 h-6 ${currentRisk.textColor}`} />
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Risk Assessment</p>
                            <p className={`text-lg font-bold ${currentRisk.textColor}`}>
                                {currentRisk.label}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Detected Symptoms */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <Heart className="w-4 h-4" />
                        <span>Detected Symptoms</span>
                    </h3>
                    <AnimatePresence mode="popLayout">
                        {extraction.symptoms.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {extraction.symptoms.map((symptom, index) => (
                                    <motion.span
                                        key={symptom}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                                    >
                                        {symptom}
                                    </motion.span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No symptoms detected yet</p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Vital Signs */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <Thermometer className="w-4 h-4" />
                        <span>Vital Signs</span>
                    </h3>
                    <div className="space-y-2">
                        {/* Temperature */}
                        {extraction.vitals.temperature && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className={`p-3 rounded-lg border ${statusColors[getTemperatureStatus(extraction.vitals.temperature)]}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Temperature</span>
                                    <span className="text-lg font-bold">{extraction.vitals.temperature}°F</span>
                                </div>
                                {getTemperatureStatus(extraction.vitals.temperature) === 'critical' && (
                                    <p className="text-xs mt-1 font-medium">⚠️ Fever detected</p>
                                )}
                            </motion.div>
                        )}

                        {/* Heart Rate */}
                        {extraction.vitals.heartRate && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className={`p-3 rounded-lg border ${statusColors[getHeartRateStatus(extraction.vitals.heartRate)]}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Heart Rate</span>
                                    <span className="text-lg font-bold">{extraction.vitals.heartRate} bpm</span>
                                </div>
                                {getHeartRateStatus(extraction.vitals.heartRate) === 'critical' && (
                                    <p className="text-xs mt-1 font-medium">
                                        {extraction.vitals.heartRate > 100 ? '⚠️ Tachycardia' : '⚠️ Bradycardia'}
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {/* Blood Pressure */}
                        {extraction.vitals.bloodPressure && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className={`p-3 rounded-lg border ${statusColors[getBloodPressureStatus(extraction.vitals.bloodPressure)]}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Blood Pressure</span>
                                    <span className="text-lg font-bold">{extraction.vitals.bloodPressure}</span>
                                </div>
                                {getBloodPressureStatus(extraction.vitals.bloodPressure) === 'critical' && (
                                    <p className="text-xs mt-1 font-medium">⚠️ Hypertension</p>
                                )}
                            </motion.div>
                        )}

                        {!extraction.vitals.temperature && !extraction.vitals.heartRate && !extraction.vitals.bloodPressure && (
                            <p className="text-sm text-gray-400 italic">No vitals recorded yet</p>
                        )}
                    </div>
                </div>

                {/* Red Flags */}
                {extraction.redFlags.length > 0 && (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-red-50 border-2 border-red-300 rounded-xl p-4"
                    >
                        <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Red Flags - Immediate Attention</span>
                        </h3>
                        <ul className="space-y-1">
                            {extraction.redFlags.map((flag, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-sm text-red-700 flex items-start space-x-2"
                                >
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>{flag}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>

            {/* Footer - Generate Referral Button */}
            <div className="border-t border-gray-100 p-4 bg-white/60">
                <AnimatePresence>
                    {showReferralSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-3 bg-green-50 border border-green-200 rounded-lg p-2 flex items-center space-x-2"
                        >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">WhatsApp opened!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleGenerateReferral}
                    disabled={extraction.symptoms.length === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center space-x-2"
                >
                    <Send className="w-4 h-4" />
                    <span>Send to Doctor (WhatsApp)</span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                    Generates professional referral summary
                </p>
            </div>
        </div>
    );
}
