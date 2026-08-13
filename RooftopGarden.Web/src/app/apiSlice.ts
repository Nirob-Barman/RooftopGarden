import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'
import { setCredentials, logout } from '../features/auth/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

interface RefreshResponse {
  accessToken: string
  refreshToken: string
  user: { id: string; fullName: string; email: string; roles: string[] }
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: '/api/auth/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions,
      )

      if (refreshResult.data) {
        api.dispatch(setCredentials(refreshResult.data as RefreshResponse))
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        api.dispatch(logout())
      }
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Product',
    'Category',
    'Cart',
    'Order',
    'Payment',
    'Review',
    'Wishlist',
    'Service',
    'Booking',
    'Blog',
    'Profile',
    'DashboardStats',
  ],
  endpoints: () => ({}),
})
