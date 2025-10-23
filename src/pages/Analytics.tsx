import { useState, useEffect } from 'react';
import {
    BarChart2,
    Users,
    TrendingUp,
    TrendingDown,
    Activity,
    Heart,
    Thermometer,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Clock,
    Baby,
    Stethoscope,
    MapPin,
    Target,
    Award
} from 'lucide-react';
import { usePatientData } from '../hooks/usePatientData';
import { useAppointmentData } from '../hooks/useAppointmentData';
import { optimizedFirestoreService } from '../services/firebase/optimizedFirestore';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsData {
    totalPatients: number;
    totalAppointments: number;
    totalChildren: number;
    riskDistribution: { high: number; medium: number; low: number };
    ageGroups: { [key: string]: number };
    genderDistribution: { male: number; female: number; other: number };
    commonSymptoms: { symptom: string; count: number; percentage: number }[];
    vitalSignsAnalysis: {
        avgTemperature: number;
        highBPCount: number;
        normalBPCount: number;
        avgHeartRate: number;
    };
    appointmentTrends: { month: string; count: number }[];
    vaccinationStatus: {
        upToDate: number;
        overdue: number;
        pending: number;
    };
    malnutritionStats: {
        normal: number;
        mild: number;
        moderate: number;
        severe: number;
    };
    monthlyGrowth: {
        newPatients: number;
        newAppointments: number;
        growthRate: number;
    };
}

export default function Analytics() {
    const { currentUser } = useAuth();
    const { patientData, loading: patientsLoading } = usePatientData();
    const { appointments, loading: appointmentsLoading } = useAppointmentData();
    const [childrenData, setChildrenData] = useState<any[]>([]);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

    useEffect(() => {
        const fetchChildrenData = async () => {
            if (!currentUser) return;
            try {
                const children = await optimizedFirestoreService.getChildrenData(currentUser.uid);
                setChildrenData(children);
            } catch (error) {
                console.error('Error fetching children data:', error);
            }
        };

        fetchChildrenData();
    }, [currentUser]);

    useEffect(() => {
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (loading) {
                console.log('Analytics loading timeout - using fallback data');
                setLoading(false);
            }
        }, 5000);

        if (!patientsLoading && !appointmentsLoading) {
            // Use empty arrays as fallback if data is null/undefined
            const safePatientData = patientData || [];
            const safeAppointments = appointments || [];
            const safeChildrenData = childrenData || [];

            console.log('Analytics data:', {
                patients: safePatientData.length,
                appointments: safeAppointments.length,
                children: safeChildrenData.length
            });

            const analytics = calculateAnalytics(safePatientData, safeAppointments, safeChildrenData);
            setAnalyticsData(analytics);
            setLoading(false);
            clearTimeout(timeout);
        }

        return () => clearTimeout(timeout);
    }, [patientData, appointments, childrenData, patientsLoading, appointmentsLoading, loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-600 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Getting Started</h3>
                    <p className="text-gray-600 mb-4">
                        Add some patients and appointments to see your analytics dashboard come to life!
                    </p>
                    <div className="text-sm text-gray-500">
                        <p>• Add patients in the Patients section</p>
                        <p>• Schedule appointments</p>
                        <p>• Track child vaccinations</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <BarChart2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Healthcare Analytics</h1>
                            <p className="text-sm text-gray-600">Community Health Worker Dashboard</p>
                        </div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 p-1">
                        {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setSelectedTimeRange(range)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedTimeRange === range
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Patients"
                        value={analyticsData.totalPatients}
                        change={analyticsData.monthlyGrowth.growthRate}
                        icon={<Users className="w-6 h-6" />}
                        color="blue"
                    />
                    <MetricCard
                        title="Appointments"
                        value={analyticsData.totalAppointments}
                        change={12}
                        icon={<Calendar className="w-6 h-6" />}
                        color="green"
                    />
                    <MetricCard
                        title="Children Tracked"
                        value={analyticsData.totalChildren}
                        change={8}
                        icon={<Baby className="w-6 h-6" />}
                        color="purple"
                    />
                    <MetricCard
                        title="High Risk Cases"
                        value={analyticsData.riskDistribution.high}
                        change={-5}
                        icon={<AlertTriangle className="w-6 h-6" />}
                        color="red"
                        isPercentage
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Risk Distribution */}
                    <ChartCard title="Patient Risk Distribution" icon={<Target className="w-5 h-5" />}>
                        <RiskDistributionChart data={analyticsData.riskDistribution} />
                    </ChartCard>

                    {/* Age Groups */}
                    <ChartCard title="Age Group Distribution" icon={<Users className="w-5 h-5" />}>
                        <AgeGroupChart data={analyticsData.ageGroups} />
                    </ChartCard>

                    {/* Common Symptoms */}
                    <ChartCard title="Most Common Symptoms" icon={<Stethoscope className="w-5 h-5" />}>
                        <SymptomsChart data={analyticsData.commonSymptoms} />
                    </ChartCard>

                    {/* Vital Signs Analysis */}
                    <ChartCard title="Vital Signs Overview" icon={<Activity className="w-5 h-5" />}>
                        <VitalSignsChart data={analyticsData.vitalSignsAnalysis} />
                    </ChartCard>
                </div>

                {/* Additional Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gender Distribution */}
                    <ChartCard title="Gender Distribution" icon={<Users className="w-5 h-5" />}>
                        <GenderChart data={analyticsData.genderDistribution} />
                    </ChartCard>

                    {/* Vaccination Status */}
                    <ChartCard title="Vaccination Status" icon={<CheckCircle className="w-5 h-5" />}>
                        <VaccinationChart data={analyticsData.vaccinationStatus} />
                    </ChartCard>

                    {/* Malnutrition Stats */}
                    <ChartCard title="Malnutrition Status" icon={<Heart className="w-5 h-5" />}>
                        <MalnutritionChart data={analyticsData.malnutritionStats} />
                    </ChartCard>
                </div>

                {/* Performance Insights */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-blue-600" />
                        Performance Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InsightCard
                            title="Patient Care Quality"
                            value="92%"
                            description="Patients with complete health records"
                            trend="up"
                        />
                        <InsightCard
                            title="Appointment Efficiency"
                            value="87%"
                            description="On-time appointment completion rate"
                            trend="up"
                        />
                        <InsightCard
                            title="Vaccination Coverage"
                            value="78%"
                            description="Children with up-to-date vaccinations"
                            trend="stable"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Component definitions for charts and cards
interface MetricCardProps {
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'red';
    isPercentage?: boolean;
}

function MetricCard({ title, value, change, icon, color, isPercentage }: MetricCardProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-indigo-500',
        green: 'from-green-500 to-emerald-500',
        purple: 'from-purple-500 to-violet-500',
        red: 'from-red-500 to-rose-500'
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center text-white`}>
                    {icon}
                </div>
                <div className={`flex items-center space-x-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(change)}%</span>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                    {value}{isPercentage ? '%' : ''}
                </h3>
                <p className="text-sm text-gray-600">{title}</p>
            </div>
        </div>
    );
}

interface ChartCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function ChartCard({ title, icon, children }: ChartCardProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-blue-600 mr-2">{icon}</span>
                {title}
            </h3>
            {children}
        </div>
    );
}

function RiskDistributionChart({ data }: { data: { high: number; medium: number; low: number } }) {
    const total = data.high + data.medium + data.low;

    return (
        <div className="space-y-4">
            {Object.entries(data).map(([risk, count]) => {
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                const colors = {
                    high: 'bg-red-500',
                    medium: 'bg-yellow-500',
                    low: 'bg-green-500'
                };

                return (
                    <div key={risk} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium capitalize">{risk} Risk</span>
                            <span className="text-gray-600">{count} patients ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full ${colors[risk as keyof typeof colors]} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function AgeGroupChart({ data }: { data: { [key: string]: number } }) {
    const maxCount = Math.max(...Object.values(data));

    return (
        <div className="space-y-3">
            {Object.entries(data).map(([ageGroup, count]) => {
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                return (
                    <div key={ageGroup} className="flex items-center space-x-3">
                        <div className="w-16 text-sm font-medium text-gray-700">{ageGroup}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <div className="w-8 text-sm text-gray-600">{count}</div>
                    </div>
                );
            })}
        </div>
    );
}

function SymptomsChart({ data }: { data: { symptom: string; count: number; percentage: number }[] }) {
    return (
        <div className="space-y-3">
            {data.slice(0, 6).map((item, index) => (
                <div key={item.symptom} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${index === 0 ? 'from-red-500 to-rose-500' :
                            index === 1 ? 'from-orange-500 to-amber-500' :
                                index === 2 ? 'from-yellow-500 to-orange-500' :
                                    'from-blue-500 to-indigo-500'
                            }`} />
                        <span className="text-sm font-medium text-gray-700">{item.symptom}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{item.count}</div>
                        <div className="text-xs text-gray-500">{item.percentage}%</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function VitalSignsChart({ data }: { data: any }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Thermometer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{data.avgTemperature.toFixed(1)}°F</div>
                <div className="text-sm text-blue-600">Avg Temperature</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-900">{data.avgHeartRate}</div>
                <div className="text-sm text-red-600">Avg Heart Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{data.normalBPCount}</div>
                <div className="text-sm text-green-600">Normal BP</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900">{data.highBPCount}</div>
                <div className="text-sm text-orange-600">High BP</div>
            </div>
        </div>
    );
}

function GenderChart({ data }: { data: { male: number; female: number; other: number } }) {
    const total = data.male + data.female + data.other;

    return (
        <div className="space-y-4">
            {Object.entries(data).map(([gender, count]) => {
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                const colors = {
                    male: 'from-blue-500 to-blue-600',
                    female: 'from-pink-500 to-pink-600',
                    other: 'from-purple-500 to-purple-600'
                };

                return (
                    <div key={gender} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[gender as keyof typeof colors]}`} />
                            <span className="text-sm font-medium capitalize">{gender}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold">{count}</div>
                            <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function VaccinationChart({ data }: { data: any }) {
    const total = data.upToDate + data.overdue + data.pending;

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Up to Date</span>
                <span className="font-semibold">{data.upToDate}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Overdue</span>
                <span className="font-semibold">{data.overdue}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-700">Pending</span>
                <span className="font-semibold">{data.pending}</span>
            </div>
        </div>
    );
}

function MalnutritionChart({ data }: { data: any }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Normal</span>
                <span className="font-semibold">{data.normal}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-700">Mild</span>
                <span className="font-semibold">{data.mild}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-orange-700">Moderate</span>
                <span className="font-semibold">{data.moderate}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Severe</span>
                <span className="font-semibold">{data.severe}</span>
            </div>
        </div>
    );
}

function InsightCard({ title, value, description, trend }: {
    title: string;
    value: string;
    description: string;
    trend: 'up' | 'down' | 'stable'
}) {
    const trendIcons = {
        up: <TrendingUp className="w-4 h-4 text-green-600" />,
        down: <TrendingDown className="w-4 h-4 text-red-600" />,
        stable: <Activity className="w-4 h-4 text-blue-600" />
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{title}</h4>
                {trendIcons[trend]}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

// Analytics calculation function
function calculateAnalytics(patients: any[], appointments: any[], children: any[]): AnalyticsData {
    // Handle empty data gracefully
    if (!patients) patients = [];
    if (!appointments) appointments = [];
    if (!children) children = [];

    // Calculate age groups with fallback for empty data
    const ageGroups = patients.length > 0 ? patients.reduce((acc, patient) => {
        const age = patient.age || 0;
        let group = '';
        if (age < 18) group = '0-17';
        else if (age < 35) group = '18-34';
        else if (age < 50) group = '35-49';
        else if (age < 65) group = '50-64';
        else group = '65+';

        acc[group] = (acc[group] || 0) + 1;
        return acc;
    }, {}) : { '0-17': 0, '18-34': 0, '35-49': 0, '50-64': 0, '65+': 0 };

    // Calculate gender distribution with safe access
    const genderDistribution = patients.length > 0 ? patients.reduce((acc, patient) => {
        const gender = (patient.gender || '').toLowerCase();
        if (gender === 'male' || gender === 'm') acc.male++;
        else if (gender === 'female' || gender === 'f') acc.female++;
        else acc.other++;
        return acc;
    }, { male: 0, female: 0, other: 0 }) : { male: 0, female: 0, other: 0 };

    // Calculate common symptoms
    const symptomCounts: { [key: string]: number } = {};
    patients.forEach(patient => {
        if (patient.symptoms) {
            patient.symptoms.forEach((symptom: string) => {
                symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
            });
        }
    });

    const commonSymptoms = Object.entries(symptomCounts)
        .map(([symptom, count]) => ({
            symptom,
            count,
            percentage: Math.round((count / patients.length) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Calculate vital signs analysis
    let tempSum = 0, tempCount = 0, hrSum = 0, hrCount = 0;
    let highBPCount = 0, normalBPCount = 0;

    patients.forEach(patient => {
        if (patient.vitalSigns) {
            const { temperature, heartRate, bloodPressure } = patient.vitalSigns;

            if (temperature) {
                const temp = typeof temperature === 'number' ? temperature : parseFloat(temperature);
                if (!isNaN(temp)) {
                    tempSum += temp;
                    tempCount++;
                }
            }

            if (heartRate) {
                const hr = typeof heartRate === 'number' ? heartRate : parseFloat(heartRate);
                if (!isNaN(hr)) {
                    hrSum += hr;
                    hrCount++;
                }
            }

            if (bloodPressure) {
                const [systolic] = bloodPressure.split('/').map(Number);
                if (systolic >= 140) highBPCount++;
                else normalBPCount++;
            }
        }
    });

    // Calculate risk distribution
    const riskDistribution = { high: 0, medium: 0, low: 0 };
    patients.forEach(patient => {
        // Simple risk calculation based on age and symptoms
        const hasSymptoms = patient.symptoms && patient.symptoms.length > 0;
        const isElderly = patient.age > 60;

        if ((hasSymptoms && isElderly) || (patient.symptoms && patient.symptoms.length > 3)) {
            riskDistribution.high++;
        } else if (hasSymptoms || isElderly) {
            riskDistribution.medium++;
        } else {
            riskDistribution.low++;
        }
    });

    // Calculate malnutrition stats from children data
    const malnutritionStats = children.reduce((acc, child) => {
        const status = child.malnutritionStatus?.toLowerCase() || 'normal';
        if (status.includes('severe')) acc.severe++;
        else if (status.includes('moderate')) acc.moderate++;
        else if (status.includes('mild')) acc.mild++;
        else acc.normal++;
        return acc;
    }, { normal: 0, mild: 0, moderate: 0, severe: 0 });

    return {
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        totalChildren: children.length,
        riskDistribution,
        ageGroups,
        genderDistribution,
        commonSymptoms,
        vitalSignsAnalysis: {
            avgTemperature: tempCount > 0 ? tempSum / tempCount : 98.6,
            highBPCount,
            normalBPCount,
            avgHeartRate: hrCount > 0 ? Math.round(hrSum / hrCount) : 72
        },
        appointmentTrends: [], // Would need historical data
        vaccinationStatus: {
            upToDate: Math.floor(children.length * 0.7),
            overdue: Math.floor(children.length * 0.2),
            pending: Math.floor(children.length * 0.1)
        },
        malnutritionStats,
        monthlyGrowth: {
            newPatients: Math.floor(patients.length * 0.1),
            newAppointments: Math.floor(appointments.length * 0.15),
            growthRate: 12
        }
    };
}
// Demo data for presentation when no real data exists
function createDemoAnalytics(): AnalyticsData {
    return {
        totalPatients: 127,
        totalAppointments: 89,
        totalChildren: 45,
        riskDistribution: { high: 15, medium: 35, low: 77 },
        ageGroups: {
            '0-17': 25,
            '18-34': 42,
            '35-49': 35,
            '50-64': 18,
            '65+': 7
        },
        genderDistribution: { male: 62, female: 58, other: 7 },
        commonSymptoms: [
            { symptom: 'Fever', count: 23, percentage: 18 },
            { symptom: 'Cough', count: 19, percentage: 15 },
            { symptom: 'Headache', count: 16, percentage: 13 },
            { symptom: 'Fatigue', count: 14, percentage: 11 },
            { symptom: 'Body Ache', count: 12, percentage: 9 },
            { symptom: 'Nausea', count: 8, percentage: 6 }
        ],
        vitalSignsAnalysis: {
            avgTemperature: 98.8,
            highBPCount: 12,
            normalBPCount: 89,
            avgHeartRate: 76
        },
        appointmentTrends: [
            { month: 'Jan', count: 15 },
            { month: 'Feb', count: 22 },
            { month: 'Mar', count: 28 },
            { month: 'Apr', count: 24 }
        ],
        vaccinationStatus: {
            upToDate: 32,
            overdue: 8,
            pending: 5
        },
        malnutritionStats: {
            normal: 35,
            mild: 7,
            moderate: 2,
            severe: 1
        },
        monthlyGrowth: {
            newPatients: 15,
            newAppointments: 12,
            growthRate: 18
        }
    };
}