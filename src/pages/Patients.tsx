import React, { useState, useEffect } from 'react';
import { RiWhatsappFill } from 'react-icons/ri';
import { PatientData, firestoreService, AppointmentData } from '../services/firebase/firestore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [loading, setLoading] = useState(initialLoading);
    const [error, setError] = useState(initialError);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
    const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
    const [editedPatient, setEditedPatient] = useState<Omit<PatientData, 'id' | 'createdAt'> | null>(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            setLoading(true);
            try {
                const data = await firestoreService.getPatientData();
                setPatientData(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching patient data:', err);
                setError('Failed to fetch patient data.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [refresh]);

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
            const appointmentData: AppointmentData = {
                id: '',
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
                appointmentDate: selectedDate,
            };

            await firestoreService.saveAppointmentData(appointmentData);
            await firestoreService.updatePatientData(selectedPatient.id, {
                ...selectedPatient,
                hasAppointment: true,
            });

            setRefresh((prev) => !prev);
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

    const handleEditClick = (patient: PatientData) => {
        setEditingPatientId(patient.id);
        const { id, createdAt, ...editablePatientData } = patient;
        setEditedPatient(editablePatientData);
    };

    const handleUpdatePatient = async () => {
        if (editedPatient && editingPatientId) {
            try {
                await firestoreService.updatePatientData(editingPatientId, editedPatient);
                setEditingPatientId(null);
                setEditedPatient(null);
                setRefresh((prev) => !prev);
                toast.success('Patient data updated successfully!');
            } catch (error) {
                console.error('Error updating patient data:', error);
                toast.error('Failed to update patient data.');
            }
        }
    };

    const handleDeletePatient = async (patientId: string) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await firestoreService.deletePatientData(patientId);
                setRefresh((prev) => !prev);
                toast.success('Patient data deleted successfully!');
            } catch (error) {
                console.error('Error deleting patient data:', error);
                toast.error('Failed to delete patient data.');
            }
        }
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
                const nameA = a.name?.toUpperCase() || '';
                const nameB = b.name?.toUpperCase() || '';
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
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6 text-blue-700">Patient Management</h1>

            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">Total Patients: {patientData.length}</p>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded p-2 w-64"
                        onChange={handleSearch}
                    />
                    <select className="border rounded p-2" onChange={handleFilter}>
                        <option value="">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                        Export
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Patient ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => handleSort('age')}>Age</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gender</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Symptoms</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blood Pressure</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Temperature</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Heart Rate</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Appointment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan={12} className="text-center py-4">Loading...</td></tr>}
                        {error && <tr><td colSpan={12} className="text-center py-4 text-red-500">Error: {error}</td></tr>}
                        {!loading && !error && paginatedPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="border px-4 py-3 text-sm text-gray-800">{patient.id}</td>
                                {editingPatientId === patient.id ? (
                                    <>
                                        <td><input type="text" value={editedPatient?.name || ''} onChange={(e) => setEditedPatient({ ...editedPatient!, name: e.target.value })} className="border rounded p-1 w-full" /></td>
                                        <td><input type="number" value={editedPatient?.age || 0} onChange={(e) => setEditedPatient({ ...editedPatient!, age: parseInt(e.target.value) })} className="border rounded p-1 w-full" /></td>
                                        <td>
                                            <select value={editedPatient?.gender || ''} onChange={(e) => setEditedPatient({ ...editedPatient!, gender: e.target.value })} className="border rounded p-1 w-full">
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </td>
                                        <td>{patient.symptoms?.join(', ') || ''}</td> {/* Symptoms not editable here for brevity */}
                                        <td>{patient.vitalSigns?.bloodPressure ?? ''}</td> {/* Vitals not editable here */}
                                        <td>{patient.vitalSigns?.temperature ?? ''}</td>
                                        <td>{patient.vitalSigns?.heartRate ?? ''}</td>
                                        <td><input type="text" value={editedPatient?.notes || ''} onChange={(e) => setEditedPatient({ ...editedPatient!, notes: e.target.value })} className="border rounded p-1 w-full" /></td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">
                                            {patient.mobileNumber && (
                                                <a href={`https://wa.me/91${patient.mobileNumber}`} target="_blank" rel="noopener noreferrer">
                                                    <RiWhatsappFill className="inline-block mr-2 text-green-500" size={20} />
                                                </a>
                                            )}
                                        </td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">
                                            <button onClick={handleUpdatePatient} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded mr-2">Save</button>
                                            <button onClick={() => setEditingPatientId(null)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-1 px-2 rounded">Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="border px-4 py-3 text-sm text-gray-800">{patient.name}</td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">{patient.age}</td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">{patient.gender}</td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">{patient.symptoms?.join(', ') || ''}</td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">{patient.vitalSigns?.bloodPressure ?? ''}</td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">{patient.vitalSigns?.temperature ?? ''}</td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">{patient.vitalSigns?.heartRate ?? ''}</td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">{patient.notes}</td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">
                                            {patient.mobileNumber && (
                                                <a href={`https://wa.me/91${patient.mobileNumber}`} target="_blank" rel="noopener noreferrer">
                                                    <RiWhatsappFill className="inline-block mr-2 text-green-500" size={20} />
                                                </a>
                                            )}
                                        </td>
                                        <td className="border px-4 py-3 text-sm text-gray-800">
                                            <button onClick={() => handleEditClick(patient)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded mr-2">Edit</button>
                                            <button onClick={() => handleDeletePatient(patient.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded">Delete</button>
                                        </td>
                                    </>
                                )}
                                <td className="border px-4 py-3 text-sm text-gray-800">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                                        onClick={() => handleAppointmentButtonClick(patient)}
                                        disabled={editingPatientId !== null} // Disable during edit
                                    >
                                        Appointment
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-6">
                <select className="border rounded p-2" onChange={handleRowsPerPageChange}>
                    <option value="25">25 rows</option>
                    <option value="50">50 rows</option>
                    <option value="100">100 rows</option>
                </select>
                <div className="flex space-x-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-l" onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                    <span className="text-gray-700">Page {page} of {totalPages}</span>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-r" onClick={handleNextPage} disabled={page === totalPages}>Next</button>
                </div>
            </div>

            {showDatePicker && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Select Appointment Date</h2>
                        <DatePicker selected={selectedDate} onChange={handleDateChange} inline />
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2" onClick={() => setShowDatePicker(false)}>Cancel</button>
                            <button className="bg-green-500 hover:bg-green--600 text-white font-semibold py-2 px-4 rounded" onClick={handleScheduleAppointment}>Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;