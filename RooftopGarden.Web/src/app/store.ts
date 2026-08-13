import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import authReducer from '../features/auth/authSlice'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
