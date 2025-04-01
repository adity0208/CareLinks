import React, { useState } from 'react';
import { CalendarDays, Phone, Mail, Building2 } from 'lucide-react'; // Import icons

const Collaboration: React.FC = () => {
  const [campData, setCampData] = useState({
    ngoName: '',
    campName: '',
    location: '',
    date: '',
    services: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampData({ ...campData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Camp Data:', campData);
    alert('Camp information submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center">
          <Building2 className="mr-2" /> NGO Collaboration
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome NGOs! Please provide details about your upcoming health camps to collaborate with our Community Health Workers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ngoName" className="block text-sm font-semibold text-gray-700">
              NGO Name
            </label>
            <input
              type="text"
              name="ngoName"
              id="ngoName"
              value={campData.ngoName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              required
            />
          </div>

          <div>
            <label htmlFor="campName" className="block text-sm font-semibold text-gray-700">
              Camp Name
            </label>
            <input
              type="text"
              name="campName"
              id="campName"
              value={campData.campName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={campData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CalendarDays className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                id="date"
                value={campData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 p-3"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="services" className="block text-sm font-semibold text-gray-700">
              Services Offered
            </label>
            <textarea
              name="services"
              id="services"
              value={campData.services}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="contactPerson" className="block text-sm font-semibold text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              id="contactPerson"
              value={campData.contactPerson}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
              required
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700">
              Contact Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="contactEmail"
                id="contactEmail"
                value={campData.contactEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 p-3"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700">
              Contact Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="contactPhone"
                id="contactPhone"
                value={campData.contactPhone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 p-3"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-3 px-6 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold"
          >
            Submit
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Mail className="mr-2" /> Contact Us
          </h2>
          <p className="text-gray-600 flex items-center mb-2">
            <Mail className="mr-2" /> Email: ngo-collaboration@carelinks.com
          </p>
          <p className="text-gray-600 flex items-center">
            <Phone className="mr-2" /> Phone: +91 [9956207382]
          </p>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;