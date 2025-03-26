import React, { useState } from 'react';

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
    // Here, you would implement the logic to send the campData to your backend
    // For now, we'll just log it to the console.
    console.log('Camp Data:', campData);
    // You would use Cloud Functions or Cloud Run to interact with firestore.
    // you would also use cloud functions to send an email to your team.
    // Example: sendToFirestore(campData);
    // sendEmail(campData);
    alert('Camp information submitted!');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">NGO Collaboration</h1>
      <p className="mb-4">
        Welcome NGOs! Please provide details about your upcoming health camps to collaborate with our Community Health Workers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ngoName" className="block text-sm font-medium text-gray-700">NGO Name</label>
          <input type="text" name="ngoName" id="ngoName" value={campData.ngoName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>

        <div>
          <label htmlFor="campName" className="block text-sm font-medium text-gray-700">Camp Name</label>
          <input type="text" name="campName" id="campName" value={campData.campName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" id="location" value={campData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input type="date" name="date" id="date" value={campData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>

        <div>
          <label htmlFor="services" className="block text-sm font-medium text-gray-700">Services Offered</label>
          <textarea name="services" id="services" value={campData.services} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>

        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person</label>
          <input type="text" name="contactPerson" id="contactPerson" value={campData.contactPerson} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input type="email" name="contactEmail" id="contactEmail" value={campData.contactEmail} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input type="tel" name="contactPhone" id="contactPhone" value={campData.contactPhone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
        </div>

        <button type="submit" className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Submit</button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p>Email: ngo-collaboration@carelinks.com</p>
        <p>Phone: +91 [9956207382]</p>
      </div>
    </div>
  );
};

export default Collaboration;