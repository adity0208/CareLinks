import { useState, useEffect } from 'react';
import ChatInterface from '../components/Chat/ChatInterface';
import { MessageSquare, Key, ExternalLink, Info, CheckCircle, Sparkles, Shield, Zap, Clock } from 'lucide-react';
import { testGeminiAPI } from '../services/genAI/index';

export default function Chat() {
    const [apiKey, setApiKey] = useState('');
    const [isApiKeyValid, setIsApiKeyValid] = useState(false);
    const [showApiKeyInput, setShowApiKeyInput] = useState(true);

    // Check if API key is stored in localStorage
    useEffect(() => {
        const storedApiKey = localStorage.getItem('gemini_api_key');
        console.log('🔍 Checking stored API key:', {
            hasKey: !!storedApiKey,
            keyLength: storedApiKey ? storedApiKey.length : 0,
            keyPreview: storedApiKey ? storedApiKey.substring(0, 10) + '...' : 'none'
        });

        if (storedApiKey && storedApiKey.length > 20) {
            setApiKey(storedApiKey);
            setIsApiKeyValid(true);
            setShowApiKeyInput(false);
        }
    }, []);

    const handleApiKeySubmit = async () => {
        if (apiKey.trim().length > 20) {
            const trimmedKey = apiKey.trim();
            console.log('💾 Testing and saving API key:', {
                keyLength: trimmedKey.length,
                keyPreview: trimmedKey.substring(0, 10) + '...'
            });

            // Test the API key first
            const isValid = await testGeminiAPI(trimmedKey);
            console.log('🧪 API Key test result:', isValid);

            if (isValid) {
                localStorage.setItem('gemini_api_key', trimmedKey);
                setIsApiKeyValid(true);
                setShowApiKeyInput(false);
            } else {
                alert('API key test failed. Please check your key and try again.');
            }
        } else {
            alert('Please enter a valid API key (should be longer than 20 characters)');
        }
    };

    const handleApiKeyChange = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setIsApiKeyValid(false);
        setShowApiKeyInput(true);
    };

    if (!isApiKeyValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Assistant</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get instant, intelligent health guidance powered by Google's Gemini AI
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Safe & Reliable</h3>
                            <p className="text-sm text-gray-600">
                                Professional health guidance with proper medical disclaimers and emergency protocols
                            </p>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Instant Responses</h3>
                            <p className="text-sm text-gray-600">
                                Get immediate answers to health questions, symptoms, and wellness guidance
                            </p>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">24/7 Available</h3>
                            <p className="text-sm text-gray-600">
                                Access healthcare assistance anytime, anywhere for you and your patients
                            </p>
                        </div>
                    </div>

                    {/* Setup Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
                            <div className="flex items-center space-x-3">
                                <Key className="w-6 h-6" />
                                <h2 className="text-xl font-semibold">Quick Setup Required</h2>
                            </div>
                            <p className="mt-2 text-blue-100">
                                Connect your free Google AI API key to start using the assistant
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Step 1 */}
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                    1
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-2">Get Your Free API Key</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Click the button below to get your free Google AI Studio API key. No credit card required.
                                    </p>
                                    <a
                                        href="https://aistudio.google.com/api-keys"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        <span>Get API Key</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">Quick Instructions:</h4>
                                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                                    <li>Sign in with your Google account</li>
                                    <li>Click "Create API key in new project"</li>
                                    <li>Copy the generated API key</li>
                                    <li>Paste it in the field below</li>
                                </ol>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                    2
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-2">Enter Your API Key</h3>
                                    <div className="flex space-x-3">
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="Paste your Gemini API key here..."
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <button
                                            onClick={handleApiKeySubmit}
                                            disabled={apiKey.trim().length < 20}
                                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            Connect
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        <p className="text-xs text-gray-500">
                                            Your API key is stored securely in your browser and never sent to our servers
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Development Notice */}
                    <div className="mt-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-blue-800">Development Mode Notice</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    If you get fallback responses instead of AI responses, install a CORS browser extension like
                                    "CORS Unblock" for Chrome or "CORS Everywhere" for Firefox. This is only needed in development -
                                    the deployed app works normally.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="mt-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-amber-800">Important Notice</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                    This AI assistant provides general health information only. Always consult qualified healthcare
                                    professionals for medical advice, diagnosis, or treatment decisions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">AI Health Assistant</h1>
                            <p className="text-sm text-gray-600">Powered by Google Gemini AI</p>
                        </div>
                    </div>

                    {/* Status & Settings */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Connected</span>
                        </div>
                        <button
                            onClick={handleApiKeyChange}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Change API Key
                        </button>
                    </div>
                </div>

                {/* Chat Interface */}
                <ChatInterface messages={[]} apiKey={apiKey} />
            </div>
        </div>
    );
}