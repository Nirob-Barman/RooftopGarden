import { apiSlice } from '../../app/apiSlice'

export interface DashboardStatsDto {
  totalCustomers: number
  totalProducts: number
  activeProducts: number
  totalOrders: number
  totalRevenue: number
  ordersByStatus: Record<string, number>
  totalBookings: number
  bookingsByStatus: Record<string, number>
  totalServices: number
  activeServices: number
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsDto, void>({
      query: () => '/api/admin/dashboard',
      providesTags: ['DashboardStats'],
    }),
  }),
})

export const { useGetDashboardStatsQuery } = dashboardApi
