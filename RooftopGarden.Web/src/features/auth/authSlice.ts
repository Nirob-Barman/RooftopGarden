import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthUser {
  id: string
  fullName: string
  email: string
  roles: string[]
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: localStorage.getItem('refreshToken'),
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: AuthUser }>,
    ) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.user = action.payload.user
      localStorage.setItem('refreshToken', action.payload.refreshToken)
    },
    logout: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      localStorage.removeItem('refreshToken')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
