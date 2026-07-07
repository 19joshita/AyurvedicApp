import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';
import { Doctor, Slot } from '../types';

export const fetchDoctors = createAsyncThunk('doctors/fetchDoctors', async () => {
  const response = await api.get('/doctors');
  return response.data as Doctor[];
});

export const fetchSlots = createAsyncThunk('doctors/fetchSlots', async (doctorId: string) => {
  const response = await api.get('/slots', { doctorId });
  return response.data as Slot[];
});

interface DoctorsState {
  list: Doctor[];
  slots: Slot[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DoctorsState = { list: [], slots: [], status: 'idle', error: null };

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    clearSlots: (state) => { state.slots = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchDoctors.fulfilled, (state, action: PayloadAction<Doctor[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message || null; })
      .addCase(fetchSlots.fulfilled, (state, action: PayloadAction<Slot[]>) => { state.slots = action.payload; });
  }
});

export const { clearSlots } = doctorsSlice.actions;
export default doctorsSlice.reducer;