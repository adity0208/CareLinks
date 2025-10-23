import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Clock, AlertCircle } from 'lucide-react';

interface RoleGuardProps {
    allowedRoles: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
    const { userProfile } = useAuth();

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Profile</h2>
                    <p className="text-gray-600">Please wait while we verify your account...</p>
                </div>
            </div>
        );
    }

    if (!allowedRoles.includes(userProfile.role)) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center max-w-md">
                    {userProfile.role === 'chw' ? (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Granted</h2>
                            <p className="text-gray-600 mb-4">
                                Welcome, Community Health Worker! You have full access to all features.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Under Review</h2>
                            <p className="text-gray-600 mb-4">
                                Your {userProfile.role === 'doctor' ? 'Doctor' :
                                    userProfile.role === 'nurse' ? 'Nurse' :
                                        userProfile.role === 'admin' ? 'Administrator' : 'Professional'} account is currently under review.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                                <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Our team is reviewing your credentials</li>
                                    <li>• You'll receive an email once approved</li>
                                    <li>• Currently only CHWs have immediate access</li>
                                    <li>• Other roles will be activated soon</li>
                                </ul>
                            </div>
                            <div className="mt-4 text-xs text-gray-500">
                                <p>Account Type: <span className="font-medium capitalize">{userProfile.role}</span></p>
                                <p>Organization: <span className="font-medium">{userProfile.clinicName}</span></p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return <>{children}</>;
}