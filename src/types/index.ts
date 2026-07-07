export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  time: string; // ISO string
  isBooked: boolean;
}

export interface Booking {
  id: string;
  patientId: string;
  slotId: string;
  doctorId: string;
  time: string;
  doctor?: Doctor;
}

export interface ApiErrorResponse {
  message: string;
}