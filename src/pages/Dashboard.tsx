import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Syringe,
  Tent,
  AlertTriangle,
  Activity,
  Heart,
  Shield,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import PatientCard from '../components/Dashboard/PatientCard';
import SyncIndicator from '../components/common/SyncIndicator';
import { usePatientDataForDashboard } from '../hooks/usePatientDataForDashboard';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { useTranslation } from '../hooks/useTranslation';

export default function Dashboard() {
  const { patients, loading: patientsLoading, error: patientsError } = usePatientDataForDashboard();
  const { analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalyticsData();
  const { translate } = useTranslation();

  // Real sync status
  const syncStatus = {
    isOnline: navigator.onLine,
    lastSynced: new Date().toISOString(),
    pendingChanges: 0
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  const [labels, setLabels] = useState({
    healthcareDashboard: 'Healthcare Dashboard',
    totalPatients: 'Total Patients',
    activeInSystem: 'Active in system',
    pendingAppointments: 'Pending Appointments',
    scheduledAhead: 'Scheduled ahead',
    childVaccinations: 'Child Vaccinations',
    thisMonth: 'This month',
    healthcareCamps: 'Healthcare Camps',
    activePrograms: 'Active programs',
    riskDistribution: 'Risk Distribution',
    highRisk: 'High Risk',
    mediumRisk: 'Medium Risk',
    lowRisk: 'Low Risk',
    patients: 'patients',
    quickActions: 'Quick Actions',
    addNewPatient: 'Add New Patient',
    scheduleAppointment: 'Schedule Appointment',
    viewAnalytics: 'View Analytics',
    systemHealth: 'System Health',
    databaseStatus: 'Database Status',
    syncStatus: 'Sync Status',
    performance: 'Performance',
    online: 'Online',
    synced: 'Synced',
    optimal: 'Optimal',
    highRiskPatients: 'High Risk Patients',
    patientsRequiringAttention: 'Patients requiring immediate attention',
    allClear: 'All Clear!',
    noHighRiskPatients: 'No high-risk patients found. Great job maintaining patient health!',
    loadingDashboard: 'Loading your healthcare dashboard...',
    preparingInsights: 'Preparing insights and analytics',
    dashboardError: 'Dashboard Error',
    unableToLoad: 'Unable to load dashboard data',
    quickAction: 'Quick Action'
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const translateLabels = async () => {
      const translatedLabels = {
        healthcareDashboard: await translate('Healthcare Dashboard'),
        totalPatients: await translate('Total Patients'),
        activeInSystem: await translate('Active in system'),
        pendingAppointments: await translate('Pending Appointments'),
        scheduledAhead: await translate('Scheduled ahead'),
        childVaccinations: await translate('Child Vaccinations'),
        thisMonth: await translate('This month'),
        healthcareCamps: await translate('Healthcare Camps'),
        activePrograms: await translate('Active programs'),
        riskDistribution: await translate('Risk Distribution'),
        highRisk: await translate('High Risk'),
        mediumRisk: await translate('Medium Risk'),
        lowRisk: await translate('Low Risk'),
        patients: await translate('patients'),
        quickActions: await translate('Quick Actions'),
        addNewPatient: await translate('Add New Patient'),
        scheduleAppointment: await translate('Schedule Appointment'),
        viewAnalytics: await translate('View Analytics'),
        systemHealth: await translate('System Health'),
        databaseStatus: await translate('Database Status'),
        syncStatus: await translate('Sync Status'),
        performance: await translate('Performance'),
        online: await translate('Online'),
        synced: await translate('Synced'),
        optimal: await translate('Optimal'),
        highRiskPatients: await translate('High Risk Patients'),
        patientsRequiringAttention: await translate('Patients requiring immediate attention'),
        allClear: await translate('All Clear!'),
        noHighRiskPatients: await translate('No high-risk patients found. Great job maintaining patient health!'),
        loadingDashboard: await translate('Loading your healthcare dashboard...'),
        preparingInsights: await translate('Preparing insights and analytics'),
        dashboardError: await translate('Dashboard Error'),
        unableToLoad: await translate('Unable to load dashboard data'),
        quickAction: await translate('Quick Action')
      };
      setLabels(translatedLabels);
    };

    translateLabels();
  }, [translate]);

  const handleSync = () => {
    console.log('Syncing data...');
  };

  // Calculate dashboard metrics
  const highRiskPatients = patients.filter(patient => patient.riskLevel === 'high');
  const mediumRiskPatients = patients.filter(patient => patient.riskLevel === 'medium');
  const lowRiskPatients = patients.filter(patient => patient.riskLevel === 'low');

  // Mock trend data (in real app, this would come from analytics)
  const trends = {
    patients: { value: analyticsData.totalPatients, change: +12, isPositive: true },
    appointments: { value: analyticsData.pendingAppointments, change: +8, isPositive: true },
    vaccinations: { value: analyticsData.childVaccinations, change: -3, isPositive: false },
    camps: { value: analyticsData.healthcareCamps, change: +2, isPositive: true }
  };

  const loading = patientsLoading || analyticsLoading;
  const error = patientsError || analyticsError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-6">
          <div className="mb-6">
            <SyncIndicator status={syncStatus} onSync={handleSync} />
          </div>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-xl"></div>
              </div>
              <p className="text-blue-600 font-semibold text-lg">{labels.loadingDashboard}ashboard...</p>
              <p className="text-slate-500 text-sm mt-2">Preparing insights and analytics</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        <div className="relative z-10 p-6">
          <div className="mb-6">
            <SyncIndicator status={syncStatus} onSync={handleSync} />
          </div>
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-red-800 font-semibold text-lg">Dashboard Error</h3>
                <p className="text-red-600">Unable to load dashboard data</p>
              </div>
            </div>
            <p className="text-red-700 bg-red-100/50 p-4 rounded-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/3 to-teal-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Healthcare Dashboard
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} • {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <SyncIndicator status={syncStatus} onSync={handleSync} />
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Quick Action</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Patients */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {trends.patients.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={trends.patients.isPositive ? 'text-emerald-600' : 'text-red-600'}>
                  {trends.patients.change > 0 ? '+' : ''}{trends.patients.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{analyticsData.totalPatients}</p>
              <p className="text-slate-600 text-sm">Total Patients</p>
              <p className="text-xs text-slate-500 mt-2">Active in system</p>
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {trends.appointments.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={trends.appointments.isPositive ? 'text-emerald-600' : 'text-red-600'}>
                  {trends.appointments.change > 0 ? '+' : ''}{trends.appointments.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{analyticsData.pendingAppointments}</p>
              <p className="text-slate-600 text-sm">Pending Appointments</p>
              <p className="text-xs text-slate-500 mt-2">Scheduled ahead</p>
            </div>
          </div>

          {/* Child Vaccinations */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Syringe className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {trends.vaccinations.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={trends.vaccinations.isPositive ? 'text-emerald-600' : 'text-red-600'}>
                  {trends.vaccinations.change > 0 ? '+' : ''}{trends.vaccinations.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{analyticsData.childVaccinations}</p>
              <p className="text-slate-600 text-sm">Child Vaccinations</p>
              <p className="text-xs text-slate-500 mt-2">This month</p>
            </div>
          </div>

          {/* Healthcare Camps */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Tent className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-sm">
                {trends.camps.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={trends.camps.isPositive ? 'text-emerald-600' : 'text-red-600'}>
                  {trends.camps.change > 0 ? '+' : ''}{trends.camps.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800 mb-1">{analyticsData.healthcareCamps}</p>
              <p className="text-slate-600 text-sm">Healthcare Camps</p>
              <p className="text-xs text-slate-500 mt-2">Active programs</p>
            </div>
          </div>
        </div>

        {/* Risk Assessment Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Risk Distribution</h3>
              <BarChart3 className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">High Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-800">{highRiskPatients.length}</span>
                  <span className="text-slate-500 text-sm">patients</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Medium Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-800">{mediumRiskPatients.length}</span>
                  <span className="text-slate-500 text-sm">patients</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-slate-800">{lowRiskPatients.length}</span>
                  <span className="text-slate-500 text-sm">patients</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Quick Actions</h3>
              <Zap className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700 font-medium">Add New Patient</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Schedule Appointment</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 rounded-xl transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="text-slate-700 font-medium">View Analytics</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">System Health</h3>
              <Shield className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Database Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-600 font-medium text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Sync Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-600 font-medium text-sm">Synced</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Performance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-600 font-medium text-sm">Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High Risk Patients Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">High Risk Patients</h2>
                <p className="text-slate-600 text-sm">Patients requiring immediate attention</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-slate-500" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-slate-500" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {highRiskPatients.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Heart className="w-12 h-12 text-emerald-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">All Clear!</h3>
              <p className="text-slate-600">No high-risk patients found. Great job maintaining patient health!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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