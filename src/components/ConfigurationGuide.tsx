import React from 'react';

interface ConfigurationGuideProps {
    missingVars: string[];
}

const ConfigurationGuide: React.FC<ConfigurationGuideProps> = ({ missingVars }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CareLinks</h1>
                    <p className="text-gray-600">Configuration required to get started</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-yellow-800 mb-1">Missing Configuration</h3>
                            <p className="text-sm text-yellow-700">
                                The following environment variables are required but not configured:
                            </p>
                            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                                {missingVars.map((varName) => (
                                    <li key={varName}><code className="bg-yellow-100 px-1 rounded">{varName}</code></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Setup Instructions</h2>

                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">1. Create Environment File</h3>
                                <p className="text-sm text-gray-600 mb-2">Create a <code className="bg-gray-100 px-1 rounded">.env</code> file in your project root:</p>
                                <div className="bg-gray-50 rounded p-3 text-sm font-mono">
                                    <div className="text-gray-600"># Firebase Configuration</div>
                                    <div>VITE_FIREBASE_API_KEY=your_api_key_here</div>
                                    <div>VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com</div>
                                    <div>VITE_FIREBASE_PROJECT_ID=your_project_id</div>
                                    <div>VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com</div>
                                    <div>VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id</div>
                                    <div>VITE_FIREBASE_APP_ID=your_app_id</div>
                                    <div className="mt-2 text-gray-600"># AI Services</div>
                                    <div>VITE_GEMINI_API_KEY=your_gemini_key</div>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">2. Firebase Setup</h3>
                                <p className="text-sm text-gray-600 mb-2">Get your Firebase configuration:</p>
                                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                                    <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
                                    <li>Create a new project or select existing one</li>
                                    <li>Go to Project Settings → General → Your apps</li>
                                    <li>Add a web app and copy the configuration</li>
                                    <li>Enable Authentication and Firestore Database</li>
                                </ol>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-2">3. AI Services (Optional)</h3>
                                <p className="text-sm text-gray-600 mb-2">For AI features, get a Gemini API key:</p>
                                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                                    <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
                                    <li>Create an API key for Gemini</li>
                                    <li>Add it to your environment variables</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            Check Configuration
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Check the <a href="#" className="text-blue-600 hover:underline">documentation</a> or
                        <a href="mailto:adityakushwaha0208@gmail.com" className="text-blue-600 hover:underline ml-1">contact support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConfigurationGuide;