// src/utils/calculateDueVaccines.ts

import { getVaccineSchedule, Vaccine } from './vaccineSchedule';

export const calculateDueVaccines = (
  dateOfBirth: Date,
  administeredVaccines: string[]
) => {
  const today = new Date();
  const schedule = getVaccineSchedule(dateOfBirth);

  return schedule.map((vaccine: Vaccine) => {
    const dueDate = vaccine.dueDate;

    let status: 'Upcoming' | 'Overdue' | 'Completed';
    if (administeredVaccines.includes(vaccine.name)) {
      status = 'Completed';
    } else if (dueDate < today) {
      status = 'Overdue';
    } else {
      status = 'Upcoming';
    }

    return {
      ...vaccine,
      status,
    };
  });
};
