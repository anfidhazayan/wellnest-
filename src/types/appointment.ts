
export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  doctor: string;
  location: string;
  notes?: string;
  reminder?: boolean;
  reminderTime?: number; // minutes before appointment
}
