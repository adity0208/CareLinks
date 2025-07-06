// src/components/modals/RescheduleAppointmentModal.tsx
import React, { useState } from 'react';
import { AppointmentData } from '../../services/firebase/firestore'; // Adjust path if needed

interface RescheduleAppointmentModalProps {
    appointment: AppointmentData;
    onClose: () => void;
    onSave: (updatedAppointment: AppointmentData) => void;
}

// THIS IS THE LINE THAT WAS MISSING OR MISTYPED IN THE PREVIOUS EXAMPLE
export default function RescheduleAppointmentModal({ // <--- HERE IT IS!
    appointment,
    onClose,
    onSave,
}: RescheduleAppointmentModalProps) {
    const [newDate, setNewDate] = useState<Date>(appointment.appointmentDate);
    const [newTime, setNewTime] = useState<string>(
        appointment.appointmentDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const [hours, minutes] = newTime.split(':').map(Number);
        const updatedDateTime = new Date(newDate);
        updatedDateTime.setHours(hours, minutes, 0, 0);

        onSave({ ...appointment, appointmentDate: updatedDateTime });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4">Reschedule Appointment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Patient:
                        </label>
                        <p className="text-gray-800">{appointment.patientName}</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newDate" className="block text-gray-700 text-sm font-bold mb-2">
                            New Date:
                        </label>
                        <input
                            type="date"
                            id="newDate"
                            value={newDate.toISOString().split('T')[0]} // Format date for input
                            onChange={(e) => setNewDate(new Date(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newTime" className="block text-gray-700 text-sm font-bold mb-2">
                            New Time:
                        </label>
                        <input
                            type="time"
                            id="newTime"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}