import { configureStore } from '@reduxjs/toolkit'
import customerReducer from './slices/customerSlice'
import serviceReducer from './slices/serviceSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    service: serviceReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch