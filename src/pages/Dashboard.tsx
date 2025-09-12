import AnalyticsCard from '../components/Dashboard/AnalyticsCard';
import PatientCard from '../components/Dashboard/PatientCard';
import SyncIndicator from '../components/common/SyncIndicator';
import { mockSyncStatus } from '../data/mockData';
import { usePatientDataForDashboard } from '../hooks/usePatientDataForDashboard';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

export default function Dashboard() {
  const { patients, loading: patientsLoading, error: patientsError } = usePatientDataForDashboard();
  const { analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalyticsData();

  const handleSync = () => {
    console.log('Syncing data...');
  };

  // Filter only high-risk patients
  const highRiskPatients = patients.filter(patient => patient.riskLevel === 'high');

  const loading = patientsLoading || analyticsLoading;
  const error = patientsError || analyticsError;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <SyncIndicator status={mockSyncStatus} onSync={handleSync} />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <SyncIndicator status={mockSyncStatus} onSync={handleSync} />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <SyncIndicator status={mockSyncStatus} onSync={handleSync} />
      </div>
      <div className="space-y-6">
        <AnalyticsCard data={analyticsData} />
        <div>
          <h2 className="text-xl font-semibold mb-4">High Risk Patients</h2>
          {highRiskPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No high-risk patients found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highRiskPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}