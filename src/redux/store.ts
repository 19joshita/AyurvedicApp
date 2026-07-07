import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import doctorsReducer from './doctorsSlice';
import bookingsReducer from './bookingsSlice';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import recordsReducer from './recordsSlice'; // <-- ADD THIS

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart', 'wishlist'] 
};

const rootReducer = combineReducers({
  doctors: doctorsReducer,
  bookings: bookingsReducer,
  products: productsReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  records: recordsReducer, // <-- ADD THIS
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;