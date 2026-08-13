import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'
import { setCredentials, logout, type AuthResponse } from '../features/auth/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include', // send/receive the httpOnly refreshToken cookie cross-origin
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

const REFRESH_URL = '/api/auth/refresh'

const isRefreshRequest = (args: string | FetchArgs) =>
  (typeof args === 'string' ? args : args.url) === REFRESH_URL

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  // Only attempt a recovery refresh for a 401 on some OTHER request — if the
  // refresh call itself 401s (no/invalid cookie), retrying it would just 401 again.
  if (result.error?.status === 401 && !isRefreshRequest(args)) {
    // No token to check client-side — the refresh token lives only in the httpOnly
    // cookie, which the browser attaches automatically. Just ask the server.
    const refreshResult = await rawBaseQuery({ url: REFRESH_URL, method: 'POST' }, api, extraOptions)

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data as AuthResponse))
      result = await rawBaseQuery(args, api, extraOptions)
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
