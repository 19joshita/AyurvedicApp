import { Doctor, Slot, Booking, ApiErrorResponse } from '../types';
import { HealthRecord } from '../types/records';

// --- IN-MEMBERY DATABASE ---
let doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Connor',
    specialty: 'Cardiologist',
    rating: 4.8,
    experience: '10 Years',
  },
  {
    id: '2',
    name: 'Dr. John Doe',
    specialty: 'Dermatologist',
    rating: 4.5,
    experience: '8 Years',
  },
  {
    id: '3',
    name: 'Dr. Jane Smith',
    specialty: 'Neurologist',
    rating: 4.9,
    experience: '12 Years',
  },
];

let slots: Slot[] = [
  {
    id: 's1',
    doctorId: '1',
    time: new Date(Date.now() - 3600000).toISOString(),
    isBooked: false,
  }, // EXPIRED
  {
    id: 's2',
    doctorId: '1',
    time: new Date(Date.now() + 3600000).toISOString(),
    isBooked: false,
  }, // AVAILABLE
  {
    id: 's3',
    doctorId: '1',
    time: new Date(Date.now() + 7200000).toISOString(),
    isBooked: true,
  }, // CONFLICT
  {
    id: 's4',
    doctorId: '2',
    time: new Date(Date.now() + 3600000).toISOString(),
    isBooked: false,
  },
  {
    id: 's5',
    doctorId: '2',
    time: new Date(Date.now() + 7200000).toISOString(),
    isBooked: false,
  },
  {
    id: 's6',
    doctorId: '3',
    time: new Date(Date.now() + 3600000).toISOString(),
    isBooked: false,
  },
];

let bookings: Booking[] = [];
const CURRENT_PATIENT_ID = 'patient_001';

// --- API SIMULATION FUNCTIONS ---

export const fetchDoctorsApi = async (): Promise<{ data: Doctor[] }> => {
  await delay();
  return { data: doctors };
};

export const fetchSlotsByDoctorApi = async (
  doctorId: string,
): Promise<{ data: Slot[] }> => {
  await delay();
  return { data: slots.filter(s => s.doctorId === doctorId) };
};

export const bookSlotApi = async (
  slotId: string,
): Promise<{ data: Booking }> => {
  await delay();

  // 1. HANDLE DOUBLE BOOKING
  const alreadyBooked = bookings.find(
    b => b.patientId === CURRENT_PATIENT_ID && b.slotId === slotId,
  );
  if (alreadyBooked) {
    throw {
      response: {
        data: {
          message: 'Double booking attempt: You already booked this slot.',
        },
      },
    };
  }

  const slotIndex = slots.findIndex(s => s.id === slotId);
  if (slotIndex === -1)
    throw { response: { data: { message: 'Slot not found.' } } };

  const slot = slots[slotIndex];

  // 2. HANDLE EXPIRED SLOT
  if (new Date(slot.time) < new Date()) {
    throw { response: { data: { message: 'This slot has expired.' } } };
  }

  // 3. HANDLE SLOT CONFLICT (Someone else booked it)
  if (slot.isBooked) {
    throw {
      response: {
        data: {
          message: 'Slot conflict: This slot was just booked by someone else.',
        },
      },
    };
  }

  // Proceed with booking
  slots[slotIndex].isBooked = true;
  const newBooking: Booking = {
    id: `book_${Date.now()}`,
    patientId: CURRENT_PATIENT_ID,
    slotId: slot.id,
    doctorId: slot.doctorId,
    time: slot.time,
  };
  bookings.push(newBooking);

  return { data: newBooking };
};

export const fetchBookingsApi = async (): Promise<{ data: Booking[] }> => {
  await delay();
  const patientBookings = bookings.filter(
    b => b.patientId === CURRENT_PATIENT_ID,
  );
  return {
    data: patientBookings.map(b => ({
      ...b,
      doctor: doctors.find(d => d.id === b.doctorId),
    })),
  };
};

export const cancelBookingApi = async (
  bookingId: string,
): Promise<{ data: { success: boolean } }> => {
  await delay();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) throw new Error('Booking not found');

  const booking = bookings[bookingIndex];

  // Free up the slot
  const slotIndex = slots.findIndex(s => s.id === booking.slotId);
  if (slotIndex !== -1) slots[slotIndex].isBooked = false;

  bookings.splice(bookingIndex, 1);
  return { data: { success: true } };
};

const delay = () => new Promise((resolve:any) => setTimeout(resolve, 800));
// --- HEALTH RECORDS MOCK DATA ---
// --- HEALTH RECORDS MOCK DATA ---
const healthRecordsMockData: HealthRecord[] = [
  {
    id: 'r1', type: 'lab_report', title: 'Complete Blood Count (CBC)', date: '2023-11-15T10:00:00Z',
    description: 'All parameters are within normal limits. Hemoglobin is 14.5 g/dL.', doctorName: 'Dr. Sarah Connor',
    tags: ['Routine', 'Fasting Required'], 
    // Real W3C dummy PDF and Unsplash dummy Image
    attachments: [
      { id: 'a1', type: 'pdf', uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }, 
      { id: 'a2', type: 'image', uri: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800' }
    ]
  },
  {
    id: 'r2', type: 'consultation', title: 'General Follow-up', date: '2023-11-15T11:30:00Z',
    description: 'Discussed blood work results. Patient is healthy. Advised to continue current diet.', doctorName: 'Dr. Sarah Connor',
    tags: ['Follow-up'], attachments: []
  },
  {
    id: 'r3', type: 'prescription', title: 'Vitamin D & Calcium Supplements', date: '2023-10-20T09:00:00Z',
    description: 'Take Vitamin D3 1000 IU and Calcium 500mg daily for 3 months.', doctorName: 'Dr. John Doe',
    tags: ['Chronic', 'Vitamins'], 
    attachments: [{ id: 'a3', type: 'image', uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800' }]
  },
  {
    id: 'r4', type: 'vaccination', title: 'Influenza Vaccine (Flu Shot)', date: '2023-10-05T14:00:00Z',
    description: 'Annual quadrivalent flu vaccine administered in the left deltoid.', doctorName: 'Nurse Practitioner Mike',
    tags: ['Seasonal', 'Annual'], 
    attachments: [{ id: 'a4', type: 'pdf', uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }]
  },
  {
    id: 'r5', type: 'allergy', title: 'Pollen & Dust Allergy Update', date: '2023-09-10T08:00:00Z',
    description: 'Mild reaction to oak pollen noted. Updated antihistamine dosage to 10mg daily during spring.', doctorName: 'Dr. Jane Smith',
    tags: ['Seasonal', 'Chronic'], attachments: []
  },
  {
    id: 'r6', type: 'lab_report', title: 'Thyroid Panel (TSH)', date: '2023-09-10T08:30:00Z',
    description: 'TSH levels slightly elevated at 5.5 mIU/L. Follow up required in 6 weeks.', doctorName: 'Dr. Jane Smith',
    tags: ['Routine', 'Endocrine'], 
    attachments: [{ id: 'a5', type: 'pdf', uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }]
  }
];

export const fetchHealthRecordsApi = async (): Promise<{ data: HealthRecord[] }> => {
  await delay(); // Reusing the delay function from your mockApi file
  return { data: healthRecordsMockData };
};