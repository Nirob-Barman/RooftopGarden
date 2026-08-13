import { apiSlice } from '../../app/apiSlice'
import type { PagedResult } from '../catalog/productsApi'

export interface BookingDto {
  id: number
  serviceId: number
  serviceName: string
  bookingDate: string
  preferredTime: string // "HH:MM:SS" — TimeSpan serializes as a string
  address: string
  notes: string | null
  status: string
  createdAt: string
}

export interface CreateBookingRequest {
  serviceId: number
  bookingDate: string
  preferredTime: string
  address: string
  notes?: string | null
}

export interface AdminBookingFilterParams {
  customerId?: string
  serviceId?: number
  status?: string
  pageNumber?: number
  pageSize?: number
}

const BOOKING_LIST_TAG = { type: 'Booking' as const, id: 'LIST' as const }

export const bookingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<BookingDto, CreateBookingRequest>({
      query: (body) => ({ url: '/api/bookings', method: 'POST', body }),
      invalidatesTags: [BOOKING_LIST_TAG],
    }),
    getBookings: builder.query<PagedResult<BookingDto>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 20 }) => `/api/bookings?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: (result) =>
        result
          ? [...result.items.map((b) => ({ type: 'Booking' as const, id: b.id })), BOOKING_LIST_TAG]
          : [BOOKING_LIST_TAG],
    }),
    getBookingById: builder.query<BookingDto, number>({
      query: (id) => `/api/bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),
    cancelBooking: builder.mutation<BookingDto, number>({
      query: (id) => ({ url: `/api/bookings/${id}/cancel`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Booking', id }, BOOKING_LIST_TAG],
    }),
    getAdminBookings: builder.query<PagedResult<BookingDto>, AdminBookingFilterParams>({
      query: (filter) => {
        const params = new URLSearchParams()
        if (filter.customerId) params.set('customerId', filter.customerId)
        if (filter.serviceId) params.set('serviceId', String(filter.serviceId))
        if (filter.status) params.set('status', filter.status)
        params.set('pageNumber', String(filter.pageNumber ?? 1))
        params.set('pageSize', String(filter.pageSize ?? 20))
        return `/api/admin/bookings?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.items.map((b) => ({ type: 'Booking' as const, id: b.id })), BOOKING_LIST_TAG]
          : [BOOKING_LIST_TAG],
    }),
    getAdminBookingById: builder.query<BookingDto, number>({
      query: (id) => `/api/admin/bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),
    approveBooking: builder.mutation<BookingDto, number>({
      query: (id) => ({ url: `/api/admin/bookings/${id}/approve`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Booking', id }, BOOKING_LIST_TAG],
    }),
    rejectBooking: builder.mutation<BookingDto, number>({
      query: (id) => ({ url: `/api/admin/bookings/${id}/reject`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Booking', id }, BOOKING_LIST_TAG],
    }),
  }),
})

export const {
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,
  useGetAdminBookingsQuery,
  useGetAdminBookingByIdQuery,
  useApproveBookingMutation,
  useRejectBookingMutation,
} = bookingsApi
