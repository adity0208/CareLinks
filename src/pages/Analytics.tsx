import { BarChart2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { firestoreService, PatientData, AppointmentData } from '../services/firebase/firestore';

export default function Analytics() {
    const [patientData, setPatientData] = useState<PatientData[]>([]);
    const [, setAppointmentData] = useState<AppointmentData[]>([]);
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
    if (patients.length === 0) {
        return { high: 0, medium: 0, low: 0 };
    }

    const riskCounts = { high: 0, medium: 0, low: 0 };

    patients.forEach(patient => {
        const symptoms = patient.symptoms || [];
        const vitalSigns = patient.vitalSigns;

        // High risk indicators
        const highRiskSymptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'high fever'];
        const hasHighRiskSymptoms = symptoms.some(symptom =>
            highRiskSymptoms.some(risk => symptom.toLowerCase().includes(risk))
        );

        // Check vital signs for high risk
        const hasHighBP = vitalSigns?.bloodPressure &&
            (vitalSigns.bloodPressure.includes('140') || vitalSigns.bloodPressure.includes('90'));
        const hasHighTemp = vitalSigns?.temperature &&
            (typeof vitalSigns.temperature === 'number' ? vitalSigns.temperature > 101 : parseFloat(vitalSigns.temperature) > 101);

        if (hasHighRiskSymptoms || hasHighBP || hasHighTemp) {
            riskCounts.high++;
        } else if (symptoms.length > 2 || patient.age > 60) {
            riskCounts.medium++;
        } else {
            riskCounts.low++;
        }
    });

    // Convert to percentages
    const total = patients.length;
    return {
        high: Math.round((riskCounts.high / total) * 100),
        medium: Math.round((riskCounts.medium / total) * 100),
        low: Math.round((riskCounts.low / total) * 100),
    };
}

function calculateConditionPrevalence(patients: PatientData[]): { condition: string; count: number }[] {
    const conditionCounts: { [key: string]: number } = {};

    patients.forEach(patient => {
        const symptoms = patient.symptoms || [];
        const notes = patient.notes || '';

        // Common conditions to look for
        const conditions = [
            'diabetes', 'hypertension', 'asthma', 'fever', 'cough',
            'headache', 'chest pain', 'fatigue', 'nausea', 'dizziness'
        ];

        conditions.forEach(condition => {
            const hasCondition = symptoms.some(symptom =>
                symptom.toLowerCase().includes(condition)
            ) || notes.toLowerCase().includes(condition);

            if (hasCondition) {
                conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
            }
        });
    });

    // Convert to array and sort by count
    return Object.entries(conditionCounts)
        .map(([condition, count]) => ({
            condition: condition.charAt(0).toUpperCase() + condition.slice(1),
            count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 conditions
}