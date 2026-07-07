import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { shopApi } from '../api/axiosInstance';
import { Product } from '../types/shop';

interface ProductsState {
  allProducts: Product[];      // Master list (NEVER gets mutated by filters)
  filteredProducts: Product[]; // List after applying search/filter/sort
  displayedItems: Product[];   // Paginated chunk shown on screen
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  hasMore: boolean;
  searchQuery: string;
  activeCategory: string;
  sortOrder: 'asc' | 'desc';
}

const initialState: ProductsState = {
  allProducts: [],
  filteredProducts: [],
  displayedItems: [],
  categories: [],
  status: 'idle',
  error: null,
  page: 1,
  hasMore: true,
  searchQuery: '',
  activeCategory: 'all',
  sortOrder: 'desc',
};

// --- HELPER FUNCTIONS (Keeps Redux logic clean) ---
const processFilters = (products: Product[], search: string, category: string, sort: 'asc' | 'desc'): Product[] => {
  let result = [...products];
  if (category !== 'all') result = result.filter(p => p.category === category);
  if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  result.sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);
  return result;
};

const paginateItems = (items: Product[], page: number): { displayed: Product[], hasMore: boolean } => {
  const limit = 6; // Show 6 items per page (3 rows of 2 columns)
  const displayed = items.slice(0, page * limit);
  return { displayed, hasMore: displayed.length < items.length };
};

// --- THUNKS ---
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await shopApi.get('/products');
  return response.data as Product[];
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await shopApi.get('/products/categories');
  return response.data as string[];
});

// --- SLICE ---
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    applyFilters: (state) => {
      // 1. Filter the MASTER list
      state.filteredProducts = processFilters(state.allProducts, state.searchQuery, state.activeCategory, state.sortOrder);
      // 2. Reset pagination
      state.page = 1;
      const { displayed, hasMore } = paginateItems(state.filteredProducts, 1);
      state.displayedItems = displayed;
      state.hasMore = hasMore;
    },
    loadMore: (state) => {
      // 1. Increment page
      state.page += 1;
      // 2. Get next chunk from the FILTERED list
      const { displayed, hasMore } = paginateItems(state.filteredProducts, state.page);
      state.displayedItems = displayed;
      state.hasMore = hasMore;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.allProducts = action.payload; // Save master list
        // Apply default filters on first load
        state.filteredProducts = processFilters(action.payload, state.searchQuery, state.activeCategory, state.sortOrder);
        const { displayed, hasMore } = paginateItems(state.filteredProducts, 1);
        state.displayedItems = displayed;
        state.hasMore = hasMore;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.categories = ['all', ...action.payload];
      });
  }
});

export const { loadMore, setSearch, setCategory, setSortOrder, applyFilters } = productsSlice.actions;
export default productsSlice.reducer;