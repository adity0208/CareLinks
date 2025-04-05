import AnalyticsCard from '../components/Dashboard/AnalyticsCard';
import PatientCard from '../components/Dashboard/PatientCard';
import SyncIndicator from '../components/common/SyncIndicator';
import { mockPatients, mockAnalytics, mockSyncStatus } from '../data/mockData';

export default function Dashboard() {
  const handleSync = () => {
    console.log('Syncing data...');
  };

  // Filter only high-risk patients
  const highRiskPatients = mockPatients.filter(patient => patient.riskLevel === 'high');

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <SyncIndicator status={mockSyncStatus} onSync={handleSync} />
      </div>
      <div className="space-y-6">
        <AnalyticsCard data={mockAnalytics} />
        <div>
          <h2 className="text-xl font-semibold mb-4">High Risk Patients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highRiskPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}