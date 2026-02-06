/**
 * EmergencyBanner Component
 * 
 * High-visibility alert banner for medical emergencies detected by AI.
 * Features:
 * - Color-coded severity (red for emergency, amber for warnings)
 * - Pulse animation to grab attention
 * - Quick referral action button
 * - Displays red flags and AI recommendations
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, MessageSquare, X, ArrowRight } from 'lucide-react';
import type { SafetyAnalysis } from '../../hooks/useSafetyMonitor';

interface EmergencyBannerProps {
    analysis: SafetyAnalysis;
    patientName: string;
    patientContact?: string;
    onDismiss?: () => void;
    onQuickReferral: (message: string) => void;
}

export function EmergencyBanner({
    analysis,
    patientName,
    patientContact,
    onDismiss,
    onQuickReferral,
}: EmergencyBannerProps) {
    const isEmergency = analysis.isEmergency;
    const hasRedFlags = analysis.redFlags.length > 0;

    // Generate WhatsApp referral message
    const generateReferralMessage = () => {
        const timestamp = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        return `🚨 URGENT MEDICAL REFERRAL

Patient: ${patientName}
Date/Time: ${timestamp}

⚠️ RED FLAGS DETECTED:
${analysis.redFlags.map((flag, idx) => `${idx + 1}. ${flag}`).join('\n')}

📋 AI RECOMMENDATION:
${analysis.recommendation}

Please prioritize this case for immediate medical attention.

- Community Health Worker`;
    };

    const handleQuickReferral = () => {
        const message = generateReferralMessage();
        onQuickReferral(message);

        // If patient has contact, open WhatsApp
        if (patientContact) {
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${patientContact.replace(/\D/g, '')}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    // Don't render if no red flags
    if (!hasRedFlags) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                {/* Pulse animation wrapper for emergencies */}
                <motion.div
                    animate={isEmergency ? {
                        boxShadow: [
                            '0 0 0 0 rgba(239, 68, 68, 0.7)',
                            '0 0 0 10px rgba(239, 68, 68, 0)',
                            '0 0 0 0 rgba(239, 68, 68, 0)',
                        ],
                    } : {}}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop',
                    }}
                    className={`rounded-lg overflow-hidden ${isEmergency
                            ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-500'
                            : 'bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-500'
                        }`}
                >
                    <div className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={isEmergency ? { rotate: [0, 10, -10, 0] } : {}}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                >
                                    <AlertTriangle
                                        className={`w-6 h-6 ${isEmergency ? 'text-red-600' : 'text-amber-600'
                                            }`}
                                    />
                                </motion.div>
                                <div>
                                    <h3
                                        className={`font-bold text-lg ${isEmergency ? 'text-red-900' : 'text-amber-900'
                                            }`}
                                    >
                                        {isEmergency ? '🚨 MEDICAL EMERGENCY DETECTED' : '⚠️ Health Concerns Identified'}
                                    </h3>
                                    <p
                                        className={`text-sm ${isEmergency ? 'text-red-700' : 'text-amber-700'
                                            }`}
                                    >
                                        AI Safety Analysis for {patientName}
                                    </p>
                                </div>
                            </div>

                            {onDismiss && (
                                <button
                                    onClick={onDismiss}
                                    className={`p-1 rounded-full hover:bg-white/50 transition-colors ${isEmergency ? 'text-red-600' : 'text-amber-600'
                                        }`}
                                    aria-label="Dismiss alert"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Red Flags */}
                        <div className="mb-4">
                            <h4
                                className={`font-semibold mb-2 ${isEmergency ? 'text-red-800' : 'text-amber-800'
                                    }`}
                            >
                                Red Flags:
                            </h4>
                            <ul className="space-y-1">
                                {analysis.redFlags.map((flag, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex items-start gap-2 text-sm ${isEmergency ? 'text-red-800' : 'text-amber-800'
                                            }`}
                                    >
                                        <span className="font-bold mt-0.5">•</span>
                                        <span>{flag}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* AI Recommendation */}
                        <div
                            className={`p-3 rounded-md mb-4 ${isEmergency
                                    ? 'bg-red-100 border border-red-300'
                                    : 'bg-amber-100 border border-amber-300'
                                }`}
                        >
                            <h4
                                className={`font-semibold mb-1 text-sm ${isEmergency ? 'text-red-900' : 'text-amber-900'
                                    }`}
                            >
                                📋 Recommendation:
                            </h4>
                            <p
                                className={`text-sm ${isEmergency ? 'text-red-800' : 'text-amber-800'
                                    }`}
                            >
                                {analysis.recommendation}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleQuickReferral}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${isEmergency
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-amber-600 hover:bg-amber-700'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Quick Referral via WhatsApp
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>

                            {isEmergency && (
                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="tel:108"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call Emergency (108)
                                </motion.a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
