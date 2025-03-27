import { useState, useEffect } from 'react';
import { firestoreService, AppointmentData } from '../services/firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      setLoading(true);
      try {
        const data = await firestoreService.getAppointmentData();
        // Convert Timestamp to Date
        const convertedData = data.map((appointment) => ({
          ...appointment,
          appointmentDate: appointment.appointmentDate instanceof Timestamp 
            ? appointment.appointmentDate.toDate() 
            : appointment.appointmentDate,
        }));
        setAppointments(convertedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching appointment data:', err);
        setError('Failed to fetch appointment data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, []);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Patient Name</th>
              <th className="py-2 px-4 border-b">Appointment Date</th>
              {/* Add other relevant columns */}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.patientId} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{appointment.patientName}</td>
                <td className="py-2 px-4 border-b">
                  {appointment.appointmentDate.toLocaleDateString()}
                </td>
                {/* Add other relevant cells */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}