import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { sheetsService, PatientData } from '../../services/google/sheets';
import { aiService } from '../../services/ai/analysis';

export default function PatientDataForm() {
  const { translate } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PatientData>>({
    name: '',
    age: 0,
    gender: '',
    symptoms: [],
    vitalSigns: {
      bloodPressure: '',
      temperature: 98.6,
      heartRate: 72
    },
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to Google Sheets
      await sheetsService.savePatientData(formData as PatientData);
      
      // Get AI Analysis
      const analysis = await aiService.analyzePatientData(formData as PatientData);
      
      // TODO: Display analysis results
      console.log('Analysis:', analysis);
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVitalSignsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [name]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{translate('Patient Data Collection')}</h2>

        {/* Basic Information */}
        <div className="space-y-2">
          <label className="block">
            <span>{translate('Name')}</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span>{translate('Age')}</span>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span>{translate('Gender')}</span>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange as any}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="">{translate('Select Gender')}</option>
              <option value="male">{translate('Male')}</option>
              <option value="female">{translate('Female')}</option>
              <option value="other">{translate('Other')}</option>
            </select>
          </label>
        </div>

        {/* Vital Signs */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{translate('Vital Signs')}</h3>
          
          <label className="block">
            <span>{translate('Blood Pressure')}</span>
            <input
              type="text"
              name="bloodPressure"
              value={formData.vitalSigns?.bloodPressure}
              onChange={handleVitalSignsChange}
              placeholder="120/80"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span>{translate('Temperature (°F)')}</span>
            <input
              type="number"
              name="temperature"
              value={formData.vitalSigns?.temperature}
              onChange={handleVitalSignsChange}
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span>{translate('Heart Rate (BPM)')}</span>
            <input
              type="number"
              name="heartRate"
              value={formData.vitalSigns?.heartRate}
              onChange={handleVitalSignsChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block">
            <span>{translate('Notes')}</span>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? translate('Saving...') : translate('Save Patient Data')}
      </button>
    </form>
  );
}
