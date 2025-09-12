"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { RiWhatsappFill } from "react-icons/ri"
import { Search, Filter, Plus, Edit, Trash2, Calendar, Save, X, Users, Phone, Stethoscope } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"



interface PatientsProps {
  loading: boolean
  error: string | null
}

import { PatientData, AppointmentData, firestoreService } from '../services/firebase/firestore'

type NewPatientInput = Omit<PatientData, "id" | "createdAt"> & {
  symptomsInput?: string
}

const Patients: React.FC<PatientsProps> = ({ loading: initialLoading, error: initialError }) => {
  const [patientData, setPatientData] = useState<PatientData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState(initialError)

  // State for scheduling appointments
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null)

  // State for editing existing patient
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null)
  const [editedPatient, setEditedPatient] = useState<NewPatientInput | null>(null)

  // New states for adding a patient
  const [showAddRow, setShowAddRow] = useState(false)
  const [newPatient, setNewPatient] = useState<NewPatientInput>({
    name: "",
    age: 0,
    gender: "",
    mobileNumber: "",
    notes: "",
    vitalSigns: { bloodPressure: "", temperature: "", heartRate: "" },
    symptoms: [],
    symptomsInput: "",
  })

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true)
      try {
        const data = await firestoreService.getPatientData()
        setPatientData(data)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching patient data:", err)
        setError("Failed to fetch patient data.")
      } finally {
        setLoading(false)
      }
    }
    fetchPatientData()
  }, [refresh])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value))
    setPage(1)
  }

  const handleNextPage = () => {
    setPage(page + 1)
  }

  const handlePreviousPage = () => {
    setPage(page - 1)
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }

  const handleScheduleAppointment = async () => {
    if (!selectedPatient || !selectedDate) {
      toast.error("Please select a patient and a date.")
      return
    }
    try {
      const appointmentData: Omit<AppointmentData, "id" | "createdAt"> = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        appointmentDate: selectedDate,
      }
      await firestoreService.saveAppointmentData(appointmentData)
      setRefresh((prev) => !prev)
      setShowDatePicker(false)
      setSelectedPatient(null)
      setSelectedDate(null)
      toast.success("Appointment scheduled successfully!")
    } catch (error: any) {
      console.error("Error scheduling appointment:", error)
      toast.error("Failed to schedule appointment.")
    }
  }

  const handleAppointmentButtonClick = (patient: PatientData) => {
    setSelectedPatient(patient)
    setShowDatePicker(true)
    setError(null)
  }

  const handleEditClick = (patient: PatientData) => {
    setShowAddRow(false)
    setEditingPatientId(patient.id)
    setEditedPatient({
      ...patient,
      vitalSigns: {
        bloodPressure: patient.vitalSigns?.bloodPressure || "",
        temperature: patient.vitalSigns?.temperature ? String(patient.vitalSigns.temperature) : "",
        heartRate: patient.vitalSigns?.heartRate ? String(patient.vitalSigns.heartRate) : "",
      },
      symptomsInput: patient.symptoms?.join(", ") || "",
      mobileNumber: patient.mobileNumber || "",
      notes: patient.notes || "",
    })
  }

  const handleUpdatePatient = async () => {
    if (editedPatient && editingPatientId) {
      try {
        const symptomsArray = editedPatient.symptomsInput
          ? editedPatient.symptomsInput
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
          : []

        const vitalSignsData: { bloodPressure?: string; temperature?: number; heartRate?: number } = {}
        if (editedPatient.vitalSigns?.bloodPressure) {
          vitalSignsData.bloodPressure = editedPatient.vitalSigns.bloodPressure
        }
        const parsedTemp = Number.parseFloat(editedPatient.vitalSigns?.temperature as string)
        if (!isNaN(parsedTemp)) {
          vitalSignsData.temperature = parsedTemp
        }
        const parsedHR = Number.parseFloat(editedPatient.vitalSigns?.heartRate as string)
        if (!isNaN(parsedHR)) {
          vitalSignsData.heartRate = parsedHR
        }

        const patientToUpdate: Partial<Omit<PatientData, "id" | "createdAt">> = {
          name: editedPatient.name,
          age: typeof editedPatient.age === "string" ? Number.parseInt(editedPatient.age) : editedPatient.age,
          gender: editedPatient.gender,
          mobileNumber: editedPatient.mobileNumber || "",
          notes: editedPatient.notes || "",
          symptoms: symptomsArray.length > 0 ? symptomsArray : undefined,
          vitalSigns: Object.keys(vitalSignsData).length > 0 ? vitalSignsData : undefined,
        }

        await firestoreService.updatePatientData(editingPatientId, patientToUpdate)
        setEditingPatientId(null)
        setEditedPatient(null)
        setRefresh((prev) => !prev)
        toast.success("Patient data updated successfully!")
      } catch (error) {
        console.error("Error updating patient data:", error)
        toast.error("Failed to update patient data.")
      }
    }
  }

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await firestoreService.deletePatientData(patientId)
        setRefresh((prev) => !prev)
        toast.success("Patient data deleted successfully!")
      } catch (error) {
        console.error("Error deleting patient data:", error)
        toast.error("Failed to delete patient data.")
      }
    }
  }

  const handleAddPatientClick = () => {
    setShowAddRow(true)
    setEditingPatientId(null)
    setEditedPatient(null)
    setNewPatient({
      name: "",
      age: 0,
      gender: "",
      mobileNumber: "",
      notes: "",
      vitalSigns: { bloodPressure: "", temperature: "", heartRate: "" },
      symptoms: [],
      symptomsInput: "",
    })
  }

  const handleNewPatientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith("vitalSigns.")) {
      const vitalSignKey = name.split(".")[1] as "bloodPressure" | "temperature" | "heartRate"
      setNewPatient((prev) => ({
        ...prev,
        vitalSigns: {
          ...(prev.vitalSigns || {}),
          [vitalSignKey]: value,
        },
      }))
    } else if (name === "age") {
      setNewPatient((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
    } else if (name === "symptomsInput") {
      setNewPatient((prev) => ({ ...prev, symptomsInput: value }))
    } else {
      setNewPatient((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSaveNewPatient = async () => {
    if (!newPatient.name || !newPatient.age || !newPatient.gender) {
      toast.error("Please fill in Patient Name, Age, and Gender.")
      return
    }
    try {
      const symptomsArray = newPatient.symptomsInput
        ? newPatient.symptomsInput
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
        : []

      const vitalSignsData: { bloodPressure?: string; temperature?: number; heartRate?: number } = {}
      if (newPatient.vitalSigns?.bloodPressure) {
        vitalSignsData.bloodPressure = newPatient.vitalSigns.bloodPressure
      }
      const parsedTemp = Number.parseFloat(newPatient.vitalSigns?.temperature as string)
      if (!isNaN(parsedTemp)) {
        vitalSignsData.temperature = parsedTemp
      }
      const parsedHR = Number.parseFloat(newPatient.vitalSigns?.heartRate as string)
      if (!isNaN(parsedHR)) {
        vitalSignsData.heartRate = parsedHR
      }

      const patientToSave: Omit<PatientData, "id" | "createdAt"> = {
        name: newPatient.name,
        age: newPatient.age,
        gender: newPatient.gender,
        mobileNumber: newPatient.mobileNumber || "",
        notes: newPatient.notes || "",
        symptoms: symptomsArray.length > 0 ? symptomsArray : undefined,
        vitalSigns: Object.keys(vitalSignsData).length > 0 ? vitalSignsData : undefined,
      }

      await firestoreService.savePatientData(patientToSave)
      setShowAddRow(false)
      setNewPatient({
        name: "",
        age: 0,
        gender: "",
        mobileNumber: "",
        notes: "",
        vitalSigns: { bloodPressure: "", temperature: "", heartRate: "" },
        symptoms: [],
        symptomsInput: "",
      })
      setRefresh((prev) => !prev)
      toast.success("New patient added successfully!")
    } catch (error) {
      console.error("Error adding new patient:", error)
      toast.error("Failed to add new patient.")
    }
  }

  const handleCancelNewPatient = () => {
    setShowAddRow(false)
    setNewPatient({
      name: "",
      age: 0,
      gender: "",
      mobileNumber: "",
      notes: "",
      vitalSigns: { bloodPressure: "", temperature: "", heartRate: "" },
      symptoms: [],
      symptomsInput: "",
    })
  }

  const filteredPatients = patientData
    .filter((patient) => {
      const searchTermLower = searchTerm.toLowerCase()
      return (
        (patient.name && patient.name.toLowerCase().includes(searchTermLower)) ||
        (patient.id && patient.id.toLowerCase().includes(searchTermLower)) ||
        (patient.mobileNumber && patient.mobileNumber.includes(searchTerm))
      )
    })
    .filter((patient) => {
      if (filter === "") return true
      return patient.gender === filter
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const nameA = a.name?.toUpperCase() || ""
        const nameB = b.name?.toUpperCase() || ""
        if (nameA < nameB) {
          return sortOrder === "asc" ? -1 : 1
        }
        if (nameA > nameB) {
          return sortOrder === "asc" ? 1 : -1
        }
        return 0
      }
      if (sortBy === "age") {
        const ageA = typeof a.age === "number" ? a.age : 0
        const ageB = typeof b.age === "number" ? b.age : 0
        return sortOrder === "asc" ? ageA - ageB : ageB - ageA
      }
      return 0
    })

  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
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
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Patient Management
              </h1>
              <p className="text-slate-600 mt-1">Comprehensive healthcare management system</p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{patientData.length}</p>
                  <p className="text-slate-600">Total Patients</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Active Records</p>
                <p className="text-lg font-semibold text-emerald-600">{filteredPatients.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or mobile..."
                  className="pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-80 text-sm placeholder-slate-400"
                  onChange={handleSearch}
                  value={searchTerm}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  className="pl-10 pr-8 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm appearance-none cursor-pointer"
                  onChange={handleFilter}
                  value={filter}
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <button
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 w-full sm:w-auto"
              onClick={handleAddPatientClick}
              disabled={showAddRow || editingPatientId !== null}
            >
              <Plus className="w-5 h-5" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600 font-medium">Loading patient data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-blue-100">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 transition-colors duration-200"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Patient Name</span>
                        {sortBy === "name" && <span className="text-blue-600">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-200/50 transition-colors duration-200"
                      onClick={() => handleSort("age")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Age</span>
                        {sortBy === "age" && <span className="text-blue-600">{sortOrder === "asc" ? "▲" : "▼"}</span>}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Symptoms
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Blood Pressure
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Temperature
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Heart Rate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Appointment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {showAddRow && (
                    <tr className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-l-4 border-blue-500">
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="name"
                          value={newPatient.name}
                          onChange={handleNewPatientInputChange}
                          placeholder="Patient Name"
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          name="age"
                          value={newPatient.age === 0 ? "" : newPatient.age}
                          onChange={handleNewPatientInputChange}
                          placeholder="Age"
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="gender"
                          value={newPatient.gender}
                          onChange={handleNewPatientInputChange}
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="symptomsInput"
                          value={newPatient.symptomsInput}
                          onChange={handleNewPatientInputChange}
                          placeholder="e.g. fever, cough"
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="vitalSigns.bloodPressure"
                          value={newPatient.vitalSigns?.bloodPressure || ""}
                          onChange={handleNewPatientInputChange}
                          placeholder="BP"
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="vitalSigns.temperature"
                          value={newPatient.vitalSigns?.temperature || ""}
                          onChange={handleNewPatientInputChange}
                          placeholder="Temp"
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="vitalSigns.heartRate"
                          value={newPatient.vitalSigns?.heartRate || ""}
                          onChange={handleNewPatientInputChange}
                          placeholder="HR"
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="notes"
                          value={newPatient.notes}
                          onChange={handleNewPatientInputChange}
                          placeholder="Notes"
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="mobileNumber"
                          value={newPatient.mobileNumber}
                          onChange={handleNewPatientInputChange}
                          placeholder="Mobile Number"
                          className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveNewPatient}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelNewPatient}
                            className="bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">N/A</td>
                    </tr>
                  )}
                  {paginatedPatients.length === 0 && !showAddRow ? (
                    <tr>
                      <td colSpan={11} className="text-center py-12 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-lg font-medium">No patients found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedPatients.map((patient, index) => (
                      <tr
                        key={patient.id}
                        className={`hover:bg-slate-50/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white/50" : "bg-slate-50/30"}`}
                      >
                        {editingPatientId === patient.id ? (
                          <>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editedPatient?.name || ""}
                                onChange={(e) => setEditedPatient({ ...editedPatient!, name: e.target.value })}
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                value={editedPatient?.age || 0}
                                onChange={(e) =>
                                  setEditedPatient({ ...editedPatient!, age: Number.parseInt(e.target.value) || 0 })
                                }
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={editedPatient?.gender || ""}
                                onChange={(e) => setEditedPatient({ ...editedPatient!, gender: e.target.value })}
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editedPatient?.symptomsInput || ""}
                                onChange={(e) => setEditedPatient({ ...editedPatient!, symptomsInput: e.target.value })}
                                placeholder="e.g. fever, cough"
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editedPatient?.vitalSigns?.bloodPressure || ""}
                                onChange={(e) =>
                                  setEditedPatient({
                                    ...editedPatient!,
                                    vitalSigns: { ...(editedPatient?.vitalSigns || {}), bloodPressure: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editedPatient?.vitalSigns?.temperature || ""}
                                onChange={(e) =>
                                  setEditedPatient({
                                    ...editedPatient!,
                                    vitalSigns: { ...(editedPatient?.vitalSigns || {}), temperature: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editedPatient?.vitalSigns?.heartRate || ""}
                                onChange={(e) =>
                                  setEditedPatient({
                                    ...editedPatient!,
                                    vitalSigns: { ...(editedPatient?.vitalSigns || {}), heartRate: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editedPatient?.notes || ""}
                                onChange={(e) => setEditedPatient({ ...editedPatient!, notes: e.target.value })}
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={editedPatient?.mobileNumber || ""}
                                onChange={(e) => setEditedPatient({ ...editedPatient!, mobileNumber: e.target.value })}
                                className="w-full px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={handleUpdatePatient}
                                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingPatientId(null)}
                                  className="bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-800">{patient.name}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{patient.age}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${patient.gender === "male"
                                  ? "bg-blue-100 text-blue-800"
                                  : patient.gender === "female"
                                    ? "bg-pink-100 text-pink-800"
                                    : "bg-purple-100 text-purple-800"
                                  }`}
                              >
                                {patient.gender}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {patient.symptoms?.length ? (
                                <div className="flex flex-wrap gap-1">
                                  {patient.symptoms.map((symptom, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full"
                                    >
                                      {symptom}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {patient.vitalSigns?.bloodPressure || <span className="text-slate-400">N/A</span>}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {patient.vitalSigns?.temperature || <span className="text-slate-400">N/A</span>}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {patient.vitalSigns?.heartRate || <span className="text-slate-400">N/A</span>}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {patient.notes || <span className="text-slate-400">N/A</span>}
                            </td>
                            <td className="px-6 py-4">
                              {patient.mobileNumber ? (
                                <a
                                  href={`https://wa.me/91${patient.mobileNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                                  aria-label={`Chat with ${patient.name} on WhatsApp`}
                                >
                                  <RiWhatsappFill size={20} />
                                  <Phone className="w-4 h-4" />
                                </a>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditClick(patient)}
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePatient(patient.id)}
                                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        <td className="px-6 py-4">
                          <button
                            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
                            onClick={() => handleAppointmentButtonClick(patient)}
                            disabled={editingPatientId !== null || showAddRow}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Schedule</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <label htmlFor="rowsPerPage" className="text-slate-700 font-medium">
                Rows per page:
              </label>
              <select
                id="rowsPerPage"
                className="px-3 py-2 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                onChange={handleRowsPerPageChange}
                value={rowsPerPage}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-slate-700 font-medium px-4 py-2 bg-white/60 rounded-lg">
                Page {page} of {totalPages === 0 ? 1 : totalPages}
              </span>
              <button
                className="bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={handleNextPage}
                disabled={page === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Schedule Appointment</h2>
              <p className="text-slate-600 mb-6 text-center">
                for <span className="font-semibold text-slate-800">{selectedPatient?.name}</span>
              </p>
              <div className="mb-6">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  inline
                  className="w-full"
                  minDate={new Date()}
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
              <div className="flex justify-center space-x-4">
                <button
                  className="bg-gradient-to-r from-slate-300 to-slate-400 hover:from-slate-400 hover:to-slate-500 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={() => {
                    setShowDatePicker(false)
                    setError(null)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                  onClick={handleScheduleAppointment}
                  disabled={!selectedDate}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Patients
