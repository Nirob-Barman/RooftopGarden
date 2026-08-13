import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthResponse {
  accessToken: string
  accessTokenExpiresAt: string
  email: string
  fullName: string
  role: string
}

interface AuthUser {
  email: string
  fullName: string
  role: string
}

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.accessToken = action.payload.accessToken
      state.user = {
        email: action.payload.email,
        fullName: action.payload.fullName,
        role: action.payload.role,
      }
    },
    logout: (state) => {
      state.accessToken = null
      state.user = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
