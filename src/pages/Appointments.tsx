import { useState, useEffect } from 'react';
import { firestoreService, AppointmentData } from '../services/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { CalendarDays, UserRound, Clock4 } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      setLoading(true);
      try {
        const data = await firestoreService.getAppointmentData();
        const convertedData = data.map((appointment) => ({
          ...appointment,
          appointmentDate:
            appointment.appointmentDate instanceof Timestamp
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <CalendarDays className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Appointments</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center space-x-1">
                  <UserRound className="w-4 h-4" />
                  <span>Patient Name</span>
                </div>
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center space-x-1">
                  <Clock4 className="w-4 h-4" />
                  <span>Appointment Date</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-100 transition-colors duration-200">
                <td className="py-3 px-4 border-b text-sm text-gray-800">
                  {appointment.patientName}
                </td>
                <td className="py-3 px-4 border-b text-sm text-gray-800">
                  {appointment.appointmentDate.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}