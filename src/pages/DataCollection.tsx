import React, { useState } from 'react';
import { FileSpreadsheet, Loader } from 'lucide-react';
import { submitFormData } from '../services/googleSheets';
import { analyzePatientData } from '../services/ai/mockDataAnalysis';

export default function DataCollection() {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    symptoms: '',
    vitalSigns: '',
    medications: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to mock Google Sheets
      await submitFormData(formData);
      
      // Get mock AI analysis
      const analysis = await analyzePatientData(formData);
      console.log('AI Analysis:', analysis);
      
      setSubmitStatus('success');
      setFormData({
        patientName: '',
        age: '',
        symptoms: '',
        vitalSigns: '',
        medications: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
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
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symptoms
          </label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vital Signs
          </label>
          <input
            type="text"
            value={formData.vitalSigns}
            onChange={(e) => setFormData(prev => ({ ...prev, vitalSigns: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="BP, temperature, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Medications
          </label>
          <textarea
            value={formData.medications}
            onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Data</span>
          )}
        </button>

        {submitStatus === 'success' && (
          <div className="p-3 bg-green-50 text-green-800 rounded-lg">
            Data submitted successfully!
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