import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';
import { Booking } from '../types';

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async () => {
  const response = await api.get('/bookings');
  return response.data as Booking[];
});

export const bookSlot = createAsyncThunk('bookings/bookSlot', async (slotId: string, { rejectWithValue }) => {
  try {
    const response = await api.post('/book', { slotId });
    return response.data as Booking;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Booking failed');
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancelBooking', async (bookingId: string) => {
  await api.delete(`/bookings/${bookingId}`);
  return bookingId;
});

interface BookingsState {
  list: Booking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookingsState = { list: [], status: 'idle', error: null };

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => { state.list = action.payload; })
      .addCase(bookSlot.fulfilled, (state, action: PayloadAction<Booking>) => { state.list.push(action.payload); })
      .addCase(bookSlot.rejected, (state, action) => { state.error = action.payload as string; })
      .addCase(cancelBooking.fulfilled, (state, action: PayloadAction<string>) => {
        state.list = state.list.filter(b => b.id !== action.payload);
      });
  }
});

export const { clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;