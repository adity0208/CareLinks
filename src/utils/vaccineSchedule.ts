// src/utils/vaccineSchedule.ts

export interface Vaccine {
    name: string;
    dueInDays: number;
    dueDate: Date;
  }
  
  export function getVaccineSchedule(dob: Date): Vaccine[] {
    const schedule = [
      { name: "BCG", dueInDays: 0 },
      { name: "Hepatitis B", dueInDays: 0 },
      { name: "DTP", dueInDays: 42 },
      { name: "Polio", dueInDays: 42 },
      { name: "MMR", dueInDays: 270 },
      { name: "Typhoid", dueInDays: 365 },
    ];
  
    return schedule.map(vaccine => ({
      ...vaccine,
      dueDate: new Date(dob.getTime() + vaccine.dueInDays * 24 * 60 * 60 * 1000),
    }));
  }
  