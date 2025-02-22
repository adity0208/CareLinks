import React, { useState } from 'react';
import { Patient } from '../../types';
import { AlertCircle, Calendar, Clock, ChevronRight } from 'lucide-react';
import { generateRiskAssessment } from '../../services/mockAI';
import RiskAssessmentCard from '../AI/RiskAssessmentCard';

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const assessment = generateRiskAssessment(patient);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{patient.name}</h3>
          <p className="text-gray-600">Age: {patient.age}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${getRiskBadgeColor(patient.riskLevel)}`}>
          {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)} Risk
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          Last Visit: {patient.lastVisit}
        </div>
        {patient.nextAppointment && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Next Appointment: {patient.nextAppointment}
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <AlertCircle className="w-4 h-4 mr-2" />
          {patient.medicalHistory}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => setShowRiskAssessment(!showRiskAssessment)}
          className="flex items-center justify-between w-full text-sm text-blue-600 hover:text-blue-700"
        >
          <span>AI Risk Assessment</span>
          <ChevronRight className={`w-4 h-4 transform transition-transform ${showRiskAssessment ? 'rotate-90' : ''}`} />
        </button>
        
        {showRiskAssessment && (
          <div className="mt-4">
            <RiskAssessmentCard assessment={assessment} />
          </div>
        )}
      </div>
    </div>
  );
}