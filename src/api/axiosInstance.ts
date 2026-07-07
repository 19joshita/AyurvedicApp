import axios from 'axios';
import * as mockApi from './mockApi';

// Real Axios instance for Shop (Public API)
export const shopApi = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

// Mock instance for Consultations
const mockApiInstance = {
  get: async (url: string, params?: { doctorId?: string }): Promise<{ data: any }> => {
    if (url === '/doctors') return mockApi.fetchDoctorsApi();
    if (url === '/slots' && params?.doctorId) return mockApi.fetchSlotsByDoctorApi(params.doctorId);
    if (url === '/bookings') return mockApi.fetchBookingsApi();
    throw new Error('Route not found');
  },
  post: async (url: string, payload: { slotId: string }): Promise<{ data: any }> => {
    if (url === '/book') return mockApi.bookSlotApi(payload.slotId);
    throw new Error('Route not found');
  },
  delete: async (url: string): Promise<{ data: { success: boolean } }> => {
    if (url.startsWith('/bookings/')) {
      const bookingId = url.split('/').pop()!;
      return mockApi.cancelBookingApi(bookingId);
    }
    throw new Error('Route not found');
  }
};

export default mockApiInstance;