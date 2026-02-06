/**
 * Chat Page - Secure Multi-Agent Clinical Interviewer
 * 
 * Features:
 * - Firebase Cloud Functions for secure AI calls
 * - Real-time patient data extraction
 * - 2-column layout: Chat (2/3) + Intelligence Sidebar (1/3)
 * - WhatsApp referral generation
 * - Clinical threshold validation
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatInterface from '../components/Chat/ChatInterface';
import { PatientIntelligenceSidebar } from '../components/Chat/PatientIntelligenceSidebar';
import { MessageSquare, Activity } from 'lucide-react';
import type { PatientExtraction } from '../types';

export default function Chat() {
    const { currentUser } = useAuth();

    // State for extracted patient data
    const [extractedData, setExtractedData] = useState<PatientExtraction>({
        symptoms: [],
        vitals: {},
        riskLevel: 'low',
        redFlags: []
    });

    // Handle extraction updates from ChatInterface
    const handleExtractionUpdate = (extraction: PatientExtraction) => {
        console.log('📊 Extraction updated:', extraction);
        setExtractedData(extraction);
    };

    // Check authentication
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please sign in to access the AI Clinical Interviewer.
                    </p>
                    <a
                        href="/login"
                        className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Sign In
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">AI Clinical Interviewer</h1>
                            <p className="text-sm text-gray-600">Secure multi-agent patient assessment</p>
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span>AI Active</span>
                    </div>
                </div>

                {/* 2-Column Layout: Chat (2/3) + Sidebar (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chat Interface - 2/3 width */}
                    <div className="lg:col-span-2">
                        <ChatInterface
                            onExtractionUpdate={handleExtractionUpdate}
                        />
                    </div>

                    {/* Patient Intelligence Sidebar - 1/3 width */}
                    <div className="lg:col-span-1">
                        <PatientIntelligenceSidebar
                            extraction={extractedData}
                            conversationHistory={[]}
                            patientName="Current Patient"
                        />
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mt-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-blue-800">Secure AI-Powered Clinical Assessment</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                All conversations are processed securely through Firebase Cloud Functions. Patient data is extracted in real-time and can be shared directly with physicians via WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Medical Disclaimer */}
                <div className="mt-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <Activity className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-amber-800">Medical Disclaimer</h4>
                            <p className="text-sm text-amber-700 mt-1">
                                This AI assistant provides clinical interview support only. Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment decisions. For emergencies, call 108 immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}