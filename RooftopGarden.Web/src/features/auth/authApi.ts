import { apiSlice } from '../../app/apiSlice'
import { setCredentials, logout, type AuthResponse } from './authSlice'

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ProfileDto {
  email: string
  fullName: string
  phoneNumber: string | null
  address: string | null
  profileImageUrl: string | null
  role: string
}

export interface UpdateProfileRequest {
  fullName: string
  phoneNumber?: string | null
  address?: string | null
  profileImageUrl?: string | null
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/api/auth/register', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(setCredentials(data))
      },
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/api/auth/login', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(setCredentials(data))
      },
    }),
    // Used both by the AuthBootstrap silent-login-on-load and by apiSlice's own
    // 401 retry wrapper (which calls the raw endpoint directly, bypassing this hook).
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({ url: '/api/auth/refresh', method: 'POST' }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch {
          dispatch(logout())
        }
      },
    }),
    revoke: builder.mutation<void, void>({
      query: () => ({ url: '/api/auth/revoke', method: 'POST' }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled.catch(() => undefined)
        dispatch(logout())
      },
    }),
    getProfile: builder.query<ProfileDto, void>({
      query: () => '/api/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<ProfileDto, UpdateProfileRequest>({
      query: (body) => ({ url: '/api/profile', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useRevokeMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi
