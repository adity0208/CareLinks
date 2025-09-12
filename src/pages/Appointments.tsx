"use client"

import { useState, useEffect } from "react"
import { CalendarDays, UserRound, Clock4, Trash2, Edit, Calendar, Users, Loader } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { optimizedFirestoreService, AppointmentData } from '../services/firebase/optimizedFirestore'
import { useAppointmentData } from '../hooks/useAppointmentData'
import { useAuth } from '../contexts/AuthContext'

// Mock modal component
const RescheduleAppointmentModal = ({
  appointment,
  onClose,
  onSave,
}: {
  appointment: AppointmentData
  onClose: () => void
  onSave: (appointment: AppointmentData) => void
}) => {
  const [newDate, setNewDate] = useState(appointment.appointmentDate.toISOString().slice(0, 16))

  const handleSave = () => {
    onSave({
      ...appointment,
      appointmentDate: new Date(newDate),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Reschedule Appointment</h2>
        <p className="text-slate-600 mb-6 text-center">
          for <span className="font-semibold text-slate-800">{appointment.patientName}</span>
        </p>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">New Date & Time</label>
          <input
            type="datetime-local"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-slate-300 to-slate-400 hover:from-slate-400 hover:to-slate-500 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Appointments() {
  const { currentUser } = useAuth()
  const { appointmentData: appointments, loading, error, refreshAppointments } = useAppointmentData()
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentData | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleRescheduleClick = (appointment: AppointmentData) => {
    setEditingAppointment(appointment)
    setIsRescheduleModalOpen(true)
  }

  const handleSaveReschedule = async (updatedAppointment: AppointmentData) => {
    if (!editingAppointment) return
    try {
      await optimizedFirestoreService.updateAppointmentData(editingAppointment.id, {
        appointmentDate: updatedAppointment.appointmentDate
      }, currentUser!.uid)
      refreshAppointments()
      setIsRescheduleModalOpen(false)
      setEditingAppointment(null)
      toast.success("Appointment rescheduled successfully!")
    } catch (err) {
      console.error("Error rescheduling appointment:", err)
      toast.error("Failed to reschedule appointment.")
    }
  }

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setIsDeleting(id)
      try {
        await optimizedFirestoreService.deleteAppointmentData(id, currentUser!.uid)
        refreshAppointments()
        toast.success("Appointment deleted successfully!")
      } catch (err) {
        console.error("Error deleting appointment:", err)
        toast.error("Failed to delete appointment.")
      } finally {
        setIsDeleting(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600 font-medium">Loading appointments...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <CalendarDays className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Appointments
              </h1>
              <p className="text-slate-600 mt-1">Manage and track patient appointments</p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{appointments.length}</p>
                  <p className="text-slate-600">Total Appointments</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Upcoming</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {appointments.filter((apt) => apt.appointmentDate > new Date()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-blue-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <UserRound className="w-4 h-4" />
                      <span>Patient Name</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Clock4 className="w-4 h-4" />
                      <span>Appointment Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-slate-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium">No appointments found</p>
                      <p className="text-sm">Schedule your first appointment to get started</p>
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment, index) => {
                    const isUpcoming = appointment.appointmentDate > new Date()
                    const isPast = appointment.appointmentDate < new Date()
                    const isToday = appointment.appointmentDate.toDateString() === new Date().toDateString()

                    return (
                      <tr
                        key={appointment.id}
                        className={`hover:bg-slate-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white/50" : "bg-slate-50/30"
                          } ${isToday ? "border-l-4 border-emerald-500" : ""}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-full">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{appointment.patientName}</div>
                              <div className="text-sm text-slate-500">ID: {appointment.patientId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-slate-800">
                              {appointment.appointmentDate instanceof Date
                                ? appointment.appointmentDate.toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                                : "Invalid Date"}
                            </div>
                            <div className="text-sm text-slate-600">
                              {appointment.appointmentDate instanceof Date
                                ? appointment.appointmentDate.toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                : ""}
                            </div>
                            <div className="flex items-center space-x-1">
                              {isToday && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                                  Today
                                </span>
                              )}
                              {isUpcoming && !isToday && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                  Upcoming
                                </span>
                              )}
                              {isPast && !isToday && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
                                  Past
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRescheduleClick(appointment)}
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                              title="Reschedule Appointment"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
                              title="Delete Appointment"
                              disabled={isDeleting === appointment.id}
                            >
                              {isDeleting === appointment.id ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reschedule Modal */}
        {isRescheduleModalOpen && editingAppointment && (
          <RescheduleAppointmentModal
            appointment={editingAppointment}
            onClose={() => setIsRescheduleModalOpen(false)}
            onSave={handleSaveReschedule}
          />
        )}
      </div>
    </div>
  )
}
