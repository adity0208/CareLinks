import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    allowedRoles?: string[];
}

export default function ProtectedRoute({
    children,
    requireAuth = true,
    allowedRoles = ['chw']
}: ProtectedRouteProps) {
    const { currentUser, userProfile, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Redirect to login if not authenticated and trying to access protected route
        if (!loading && requireAuth && !currentUser) {
            // Store the attempted URL to redirect after login
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/auth', { replace: true });
        }
    }, [currentUser, loading, requireAuth, navigate, location.pathname]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-600 font-medium">Verifying access...</p>
                    <p className="text-sm text-gray-500 mt-2">Checking authentication status</p>
                </div>
            </div>
        );
    }

    // Redirect to auth if not authenticated
    if (requireAuth && !currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        You need to be logged in to access this page.
                    </p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Check role-based access
    if (currentUser && userProfile && !allowedRoles.includes(userProfile.role)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Restricted</h2>
                    <p className="text-gray-600 mb-4">
                        Your account type ({userProfile.role === 'doctor' ? 'Doctor' :
                            userProfile.role === 'nurse' ? 'Nurse' :
                                userProfile.role === 'admin' ? 'Administrator' : 'User'})
                        doesn't have access to this feature yet.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-4">
                        <h3 className="font-medium text-blue-800 mb-2">Available Soon</h3>
                        <p className="text-sm text-blue-700">
                            We're working on enabling access for all healthcare professionals.
                            Currently, only Community Health Workers have full access.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Render children if all checks pass
    return <>{children}</>;
}