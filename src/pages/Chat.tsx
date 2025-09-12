import ChatInterface from '../components/Chat/ChatInterface';
import { MessageSquare, Heart, Shield, Clock } from 'lucide-react';

export default function Chat() {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-75"></div>
                        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        AI Health Assistant
                    </h1>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Get instant health guidance, wellness tips, and care information from our AI-powered healthcare assistant.
                </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Heart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Health Guidance</h3>
                            <p className="text-sm text-gray-600">General health tips and wellness advice</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Safe & Secure</h3>
                            <p className="text-sm text-gray-600">Privacy-focused health conversations</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">24/7 Available</h3>
                            <p className="text-sm text-gray-600">Get help anytime, anywhere</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="max-w-4xl mx-auto">
                <ChatInterface messages={[]} />
            </div>

            {/* Disclaimer */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-800">Important Disclaimer</h4>
                            <p className="text-sm text-amber-700 mt-1">
                                This AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment.
                                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}