import { Appointment } from '../../types';
import { Calendar } from 'lucide-react';

interface AppointmentListProps {
  appointments: Appointment[];
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-4">
        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
        <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
      </div>
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{appointment.patientName}</p>
              <p className="text-sm text-gray-600">{appointment.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{appointment.date}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}