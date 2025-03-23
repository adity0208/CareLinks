import React, { useState, useEffect } from 'react';
import { mockPatients } from '../data/mockData'; // Using mock data for now
import { RiWhatsappFill } from 'react-icons/ri'; // Import WhatsApp icon

export default function Patients() {
  const [patients, setPatients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Placeholder for real-time synchronization with Firebase Firestore
  useEffect(() => {
    // TODO: Implement Firebase Firestore synchronization
    // This is where you would fetch data from Firebase Firestore and update the 'patients' state.
    // Example:
    // const unsubscribe = firestore.collection('patients').onSnapshot((snapshot) => {
    //   const patientData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //   setPatients(patientData);
    // });
    // return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Search functionality
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter functionality
  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  // Sort functionality
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Pagination functionality
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(1); // Reset to first page when changing rows per page
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  // Implement search, filter, and sort logic here
  const filteredPatients = patients
    .filter((patient) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchTermLower) ||
        patient.id.toLowerCase().includes(searchTermLower) ||
        patient.contactNumber.toLowerCase().includes(searchTermLower)
      );
    })
    .filter((patient) => {
      if (filter === '') return true;
      if (filter === 'childVaccination' && patient.healthStatus === 'Pending Vaccination') return true;
      if (filter === 'generalAppointments' && patient.healthStatus === 'Routine Checkup') return true;
      if (filter === 'highRisk' && patient.healthStatus === 'Critical') return true;
      return false;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
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
      if (sortBy === 'healthStatus') {
        const statusOrder = { Critical: 1, 'Pending Vaccination': 2, 'Routine Checkup': 3, Stable: 4 };
        return sortOrder === 'asc' ? statusOrder[a.healthStatus] - statusOrder[b.healthStatus] : statusOrder[b.healthStatus] - statusOrder[a.healthStatus];
      }
      return 0;
    });

  // Pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>

      {/* Summary Section */}
      <div className="mb-4">
        <p>Total Patients: {patients.length}</p>
        <p>High-Risk Patients: {patients.filter(patient => patient.healthStatus === 'Critical').length}</p>
        <p>Pending Vaccinations: {patients.filter(patient => patient.healthStatus === 'Pending Vaccination').length}</p>
        {/* TODO: Add Next Scheduled Appointments */}
      </div>

      {/* Search, Filter, and Export */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by Name, ID, Contact"
          className="border rounded p-2"
          onChange={handleSearch}
        />
        <div className="flex items-center">
          <select className="border rounded p-2 mr-2" onChange={handleFilter}>
            <option value="">All</option>
            <option value="childVaccination">Child Vaccination</option>
            <option value="generalAppointments">General Appointments</option>
            <option value="highRisk">High-Risk Patients</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-2">
                Patient ID
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                Name
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('age')}>
                Age
              </th>
              <th className="px-4 py-2">
                Gender
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('healthStatus')}>
                Health Status
              </th>
              <th className="px-4 py-2">
                Contact Number
              </th>
              <th className="px-4 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="border px-4 py-2">{patient.id}</td>
                <td className="border px-4 py-2">{patient.name}</td>
                <td className="border px-4 py-2">{patient.age}</td>
                <td className="border px-4 py-2">{patient.gender}</td>
                <td className={`border px-4 py-2 ${
                  patient.healthStatus === 'Stable' ? 'text-green-500' :
                    patient.healthStatus === 'Pending Vaccination' ? 'text-yellow-500' :
                      patient.healthStatus === 'Critical' ? 'text-red-500' : ''
                }`}>{patient.healthStatus}</td>
                <td className="border px-4 py-2">{patient.contactNumber}</td>
                <td className="border px-4 py-2">
                  <a href={`https://wa.me/91${patient.contactNumber}`} target="_blank" rel="noopener noreferrer">
                    <RiWhatsappFill className="inline-block mr-2 text-green-500" size={20} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
}