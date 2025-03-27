import React, { useState, useEffect } from 'react';
import { RiWhatsappFill } from 'react-icons/ri';
import { PatientData, firestoreService, AppointmentData } from '../services/firebase/firestore';
import { RefreshCw } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface PatientsProps {
  loading: boolean;
  error: string | null;
}

const Patients: React.FC<PatientsProps> = ({ loading: initialLoading, error: initialError }) => {
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(initialLoading); // Use local loading state
  const [error, setError] = useState(initialError); // Use local error state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const data = await firestoreService.getPatientData();
        setPatientData(data);
        setError(null); // Clear any previous errors
      } catch (err: any) {
        console.error("Error fetching patient data:", err);
        setError("Failed to fetch patient data."); // Set the error state
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleScheduleAppointment = async () => {
    if (!selectedPatient || !selectedDate) {
      setError('Please select a patient and a date.');
      return;
    }

    try {
      // Create appointment data
      const appointmentData: AppointmentData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        appointmentDate: selectedDate, // Use the selected date
      };

      // Save appointment data to Firestore
      await firestoreService.saveAppointmentData(appointmentData);

      // Update patient data in Firestore
      await firestoreService.updatePatientData(selectedPatient.id, { ...selectedPatient, hasAppointment: true });

      // Refresh patient data
      setRefresh(prev => !prev);

      console.log('Appointment scheduled successfully!');
      setShowDatePicker(false);
      setSelectedPatient(null);
      setSelectedDate(null);
    } catch (error: any) {
      console.error('Error scheduling appointment:', error);
      setError('Failed to schedule appointment.');
    }
  };

  const handleAppointmentButtonClick = (patient: PatientData) => {
    setSelectedPatient(patient);
    setShowDatePicker(true);
    setError(null);
  };

  const filteredPatients = patientData
    .filter((patient) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (patient.name && patient.name.toLowerCase().includes(searchTermLower)) ||
        (patient.id && patient.id.toLowerCase().includes(searchTermLower))
      );
    })
    .filter((patient) => {
      if (filter === '') return true;
      return patient.gender === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.name?.toUpperCase() || ''; // Handle potential null/undefined
        const nameB = b.name?.toUpperCase() || ''; // Handle potential null/undefined
        if (nameA < nameB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (nameA > nameB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      }
      if (sortBy === 'age') {
        return sortOrder === 'asc' ? a.age - b.age : b.age - a.age;
      }
      return 0;
    });

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>

      <div className="mb-4">
        <p>Total Patients: {patientData.length}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by Name, ID, Contact"
          className="border rounded p-2 w-1/3" // Adjust width as needed
          onChange={handleSearch}
        />
        <div className="flex items-center">
          <select className="border rounded p-2 mr-2" onChange={handleFilter}>
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-2">Patient ID</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('age')}>Age</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Symptoms</th>
              <th className="px-4 py-2">Blood Pressure</th>
              <th className="px-4 py-2">Temperature</th>
              <th className="px-4 py-2">Heart Rate</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Actions</th>
              <th className="px-4 py-2">Appointment</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={11} className="text-center py-4">Loading...</td></tr>}
            {error && <tr><td colSpan={11} className="text-center py-4 text-red-500">Error: {error}</td></tr>}
            {!loading && !error && (
              paginatedPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="border px-4 py-2">{patient.id}</td>
                  <td className="border px-4 py-2">{patient.name}</td>
                  <td className="border px-4 py-2">{patient.age}</td>
                  <td className="border px-4 py-2">{patient.gender}</td>
                  <td className="border px-4 py-2">{patient.symptoms?.join(', ') || ''}</td> {/* Handle potential null/undefined */}
                  <td className="border px-4 py-2">{patient.vitalSigns?.bloodPressure}</td>
                  <td className="border px-4 py-2">{patient.vitalSigns?.temperature}</td>
                  <td className="border px-4 py-2">{patient.vitalSigns?.heartRate}</td>
                  <td className="border px-4 py-2">{patient.notes}</td>
                  <td className="border px-4 py-2">
                    <a href={`https://wa.me/91${patient.mobileNumber}`} target="_blank" rel="noopener noreferrer">
                      <RiWhatsappFill className="inline-block mr-2 text-green-500" size={20} />
                    </a>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleAppointmentButtonClick(patient)}
                    >
                      Appointment
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <select className="border rounded p-2" onChange={handleRowsPerPageChange}>
            <option value="25">25 rows</option>
            <option value="50">50 rows</option>
            <option value="100">100 rows</option>
          </select>
        </div>
        <div>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="mx-2">Page {page} of {totalPages}</span>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showDatePicker && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Select Appointment Date</h2>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowDatePicker(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleScheduleAppointment}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;