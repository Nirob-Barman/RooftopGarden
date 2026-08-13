import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthResponse {
  accessToken: string
  accessTokenExpiresAt: string
  email: string
  fullName: string
  role: string
}

interface AuthUser {
  id: string
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

// No DTO returns the customer's own id (ProfileDto/AuthResponseDto both omit it) — it's
// only present as the `sub` claim inside the JWT. Decoded here purely for UI purposes
// (e.g. "is this my review?"); ownership is still enforced server-side regardless.
function decodeUserIdFromToken(accessToken: string): string {
  const payload = accessToken.split('.')[1]
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
  return (JSON.parse(json).sub as string) ?? ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.accessToken = action.payload.accessToken
      state.user = {
        id: decodeUserIdFromToken(action.payload.accessToken),
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
