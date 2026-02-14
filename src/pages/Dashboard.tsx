import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  MoreVertical,
  Plus,
  Search,
  Filter,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { optimizedFirestoreService, PatientData, AppointmentData } from "../services/firebase/optimizedFirestore";
import { toast } from "react-toastify";
import { ScrollReveal, FadeInStagger, FadeInItem } from "../components/UI/ScrollReveal";

interface DashboardStats {
  totalPatients: number;
  appointmentsToday: number;
  criticalAlerts: number;
  pendingReviews: number;
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    appointmentsToday: 0,
    criticalAlerts: 0,
    pendingReviews: 0,
  });
  const [recentPatients, setRecentPatients] = useState<PatientData[]>([]);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        // Parallel data fetching for performance
        const [patientsData, appointmentsData] = await Promise.all([
          optimizedFirestoreService.getPatientData(currentUser.uid),
          optimizedFirestoreService.getAppointmentData(currentUser.uid),
        ]);

        // Calculate Stats
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const todaysAppointments = appointmentsData.filter(app => {
          if (!app.appointmentDate) return false;
          const appDate = new Date(app.appointmentDate);
          return appDate.toISOString().split('T')[0] === todayStr;
        });

        // Mock logic for critical alerts (e.g., high BP)
        const criticalCount = patientsData.filter(p =>
          p.vitalSigns?.bloodPressure && parseInt(p.vitalSigns.bloodPressure.split('/')[0]) > 140
        ).length;

        setStats({
          totalPatients: patientsData.length,
          appointmentsToday: todaysAppointments.length,
          criticalAlerts: criticalCount,
          pendingReviews: 5, // Mock data
        });

        setRecentPatients(patientsData.slice(0, 5));
        setAppointments(todaysAppointments.slice(0, 5));

      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      trend: "+12%",
      trendUp: true,
      color: "blue",
      description: "Active patients"
    },
    {
      title: "Appointments",
      value: stats.appointmentsToday,
      icon: Calendar,
      trend: "+4",
      trendUp: true,
      color: "indigo",
      description: "Scheduled for today"
    },
    {
      title: "Critical Alerts",
      value: stats.criticalAlerts,
      icon: AlertTriangle,
      trend: "-2",
      trendUp: false,
      color: "rose",
      description: "Requires attention"
    },
    {
      title: "Health Index",
      value: "94%",
      icon: Activity,
      trend: "+2.4%",
      trendUp: true,
      color: "emerald",
      description: "Overall community health"
    }
  ];

  const quickActions = [
    { label: "New Patient", icon: Plus, color: "blue", to: "/patients" },
    { label: "Schedule Visit", icon: Calendar, color: "indigo", to: "/appointments" },
    { label: "Record Vitals", icon: Activity, color: "emerald", to: "/patients" }, // Redirects to patients
    { label: "Search", icon: Search, color: "slate", to: "/patients" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-8">

        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-slate-600 mt-1">
                Welcome back, {currentUser?.displayName || 'Healthcare Provider'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md transition-all">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <Link to="/patients" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Entry</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Grid */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <FadeInItem key={index} className="h-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-100 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <span>{stat.trend}</span>
                    {stat.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                  <p className="text-slate-500 font-medium">{stat.title}</p>
                  <p className="text-xs text-slate-400 mt-2">{stat.description}</p>
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Area (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Actions */}
            <ScrollReveal delay={0.2}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 px-1">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link to={action.to} key={index} className="group">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center h-full flex flex-col items-center justify-center gap-3">
                      <div className={`p-4 rounded-full bg-${action.color}-50 text-${action.color}-600 group-hover:bg-${action.color}-100 transition-colors`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <span className="font-medium text-slate-700">{action.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollReveal>

            {/* Recent Patients */}
            <ScrollReveal delay={0.3}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Recent Patients</h2>
                  <Link to="/patients" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="divide-y divide-slate-50">
                  {recentPatients.length > 0 ? recentPatients.map((patient) => (
                    <div key={patient.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{patient.name}</p>
                          <p className="text-sm text-slate-500">{patient.gender}, {patient.age} years</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-400">
                          {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-slate-500">No recent patients found.</div>
                  )}
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Sidebar Area (Right 1/3) */}
          <div className="space-y-8">

            {/* Today's Appointments */}
            <ScrollReveal delay={0.4}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800">Upcoming Visits</h2>
                </div>
                <div className="p-4 space-y-4">
                  {appointments.length > 0 ? appointments.map((apt) => (
                    <div key={apt.id} className="flex items-start space-x-4 p-3 rounded-xl bg-slate-50/50 hover:bg-blue-50/50 transition-colors">
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-center min-w-[3.5rem]">
                        <p className="text-xs text-slate-500 uppercase">{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' }) : 'NA'}</p>
                        <p className="text-lg font-bold text-slate-800">{apt.appointmentDate ? new Date(apt.appointmentDate).getDate() : 'NA'}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 mb-1">{apt.patientName}</p>
                        <div className="flex items-center text-xs text-slate-500 space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-slate-500 py-4">No appointments today.</div>
                  )}

                  <Link to="/appointments" className="block w-full py-2 text-center text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                    View Calendar
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* High Risk Alerts */}
            <ScrollReveal delay={0.5}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-rose-500 mr-2" />
                    Alerts
                  </h2>
                  <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded-full">{stats.criticalAlerts} New</span>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {/* Mock Alerts */}
                    {stats.criticalAlerts > 0 ? (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start space-x-3">
                        <div className="mt-0.5">
                          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">High Risk Patients Detected</p>
                          <p className="text-xs text-slate-500 mt-1">{stats.criticalAlerts} patient(s) need attention</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-slate-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                        <p className="text-sm">All systems normal</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </div>
    </div>
  );
}