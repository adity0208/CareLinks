import React, { useState } from 'react';
import { FileSpreadsheet, Loader } from 'lucide-react';

interface DataCollectionProps {
  onPatientAdd: (newPatient: any) => void;
}

export default function DataCollection({ onPatientAdd }: DataCollectionProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    healthStatus: '',
    mobileNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a new patient object from the form data
      const newPatient = {
        id: Math.random().toString(36).substring(7), // Generate a random ID
        name: formData.patientName,
        age: parseInt(formData.age),
        gender: formData.gender,
        healthStatus: formData.healthStatus,
        contactNumber: formData.mobileNumber,
      };

      // Call the onPatientAdd callback to update the patient list in the Patients component
      if (typeof onPatientAdd === 'function') {
        onPatientAdd(newPatient);
      } else {
        console.error('onPatientAdd is not a function!');
      }

      setSubmitStatus('success');
      setFormData({
        patientName: '',
        age: '',
        gender: '',
        healthStatus: '',
        mobileNumber: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generic handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center space-x-2">
        <FileSpreadsheet className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Data Collection</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Health Status
          </label>
          <select
            name="healthStatus"
            value={formData.healthStatus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Health Status</option>
            <option value="stable">Stable</option>
            <option value="pendingVaccination">Pending Vaccination</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Save Record</span>
          )}
        </button>

        {submitStatus === 'success' && (
          <div className="p-3 bg-green-50 text-green-800 rounded-lg">
            Patient record added successfully!
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-3 bg-red-50 text-red-800 rounded-lg">
            Error submitting data. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}