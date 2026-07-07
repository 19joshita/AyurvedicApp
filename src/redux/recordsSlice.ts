import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchHealthRecordsApi } from '../api/mockApi';
import { HealthRecord, RecordType } from '../types/records';

interface RecordsState {
  items: HealthRecord[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  searchQuery: string;
  activeFilters: RecordType[];
}

const initialState: RecordsState = {
  items: [],
  status: 'idle',
  searchQuery: '',
  activeFilters: [], // Empty array means "All" are selected
};

export const fetchRecords = createAsyncThunk('records/fetchRecords', async () => {
  const response = await fetchHealthRecordsApi();
  return response.data;
});

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleFilter: (state, action: PayloadAction<RecordType>) => {
      const index = state.activeFilters.indexOf(action.payload);
      if (index === -1) {
        state.activeFilters.push(action.payload);
      } else {
        state.activeFilters.splice(index, 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRecords.fulfilled, (state, action: PayloadAction<HealthRecord[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      });
  }
});

export const { setSearch, toggleFilter } = recordsSlice.actions;
export default recordsSlice.reducer;