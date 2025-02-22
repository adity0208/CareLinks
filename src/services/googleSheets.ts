import { FormData } from '../types';

export async function submitFormData(data: FormData): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate data before submission
  validateFormData(data);

  // Simulate API call
  console.log('Submitting to Google Sheets:', data);

  // Simulate random network error for testing
  if (Math.random() < 0.1) {
    throw new Error('Network error: Failed to submit data');
  }
}

function validateFormData(data: FormData): void {
  const requiredFields = ['patientName', 'age', 'symptoms'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (isNaN(Number(data.age)) || Number(data.age) < 0) {
    throw new Error('Invalid age value');
  }
}