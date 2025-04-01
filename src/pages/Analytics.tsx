import { BarChart2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { firestoreService, PatientData, AppointmentData } from '../services/firebase/firestore';

export default function Analytics() {
    const [patientData, setPatientData] = useState<PatientData[]>([]);
    const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const patients = await firestoreService.getPatientDataForAnalytics();
                setPatientData(patients);

                const appointments = await firestoreService.getAppointmentDataForAnalytics();
                setAppointmentData(appointments);

                setError(null);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading analytics data...</p>;
    if (error) return <p>Error: {error}</p>;

    const riskDistribution = calculateRiskDistribution(patientData);
    const conditionPrevalence = calculateConditionPrevalence(patientData);

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <BarChart2 className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Risk Distribution</h2>
                        <div className="space-y-4">
                            {Object.entries(riskDistribution).map(([risk, percentage]) => (
                                <div key={risk}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium capitalize">{risk} Risk</span>
                                        <span className="text-sm text-gray-600">{percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${risk === 'high' ? 'bg-red-500' :
                                                risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Condition Prevalence</h2>
                        <div className="space-y-3">
                            {conditionPrevalence.map((item) => (
                                <div key={item.condition} className="flex justify-between items-center">
                                    <span>{item.condition}</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {item.count} patients
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                </div>
            </div>
        </div>
    );
}

function calculateRiskDistribution(patients: PatientData[]): { [key: string]: number } {
    return {
        high: 30,
        medium: 40,
        low: 30,
    };
}

function calculateConditionPrevalence(patients: PatientData[]): { condition: string; count: number }[] {
    return [
        { condition: 'Diabetes', count: 15 },
        { condition: 'Hypertension', count: 20 },
        { condition: 'Asthma', count: 10 },
    ];
}