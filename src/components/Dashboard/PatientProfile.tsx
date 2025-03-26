import React from 'react';
import { Patient } from '../../types';
import { 
  User, Calendar, Clock, AlertCircle, 
  Heart, Activity, Phone, Mail 
} from 'lucide-react';

interface PatientProfileProps {
  patient: Patient;
  onClose: () => void;
}

export default function PatientProfile({ patient, onClose }: PatientProfileProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-gray-600">Age: {patient.age}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Medical Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Heart className="w-5 h-5" />
                  <span>Risk Level: {patient.riskLevel}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Activity className="w-5 h-5" />
                  <span>Medical History: {patient.medicalHistory}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Appointments</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>Last Visit: {patient.lastVisit}</span>
                </div>
                {patient.nextAppointment && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Next Appointment: {patient.nextAppointment}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}