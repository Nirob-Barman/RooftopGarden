import { apiSlice } from '../../app/apiSlice'
import type { PagedResult } from '../catalog/productsApi'

export interface PaymentDto {
  id: number
  orderId: number
  amount: number
  paymentMethod: string
  transactionId: string | null
  paymentStatus: string
  paidAt: string | null
}

export interface AdminPaymentFilterParams {
  customerId?: string
  status?: string
  pageNumber?: number
  pageSize?: number
}

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    makePayment: builder.mutation<PaymentDto, { orderId: number; paymentMethod: string }>({
      query: (body) => ({ url: '/api/payments', method: 'POST', body }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Payment', id: 'LIST' },
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
      ],
    }),
    getPayments: builder.query<PagedResult<PaymentDto>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 20 }) => `/api/payments?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: (result) =>
        result
          ? [...result.items.map((p) => ({ type: 'Payment' as const, id: p.id })), { type: 'Payment' as const, id: 'LIST' }]
          : [{ type: 'Payment' as const, id: 'LIST' }],
    }),
    getPaymentById: builder.query<PaymentDto, number>({
      query: (id) => `/api/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Payment', id }],
    }),
    getAdminPayments: builder.query<PagedResult<PaymentDto>, AdminPaymentFilterParams>({
      query: (filter) => {
        const params = new URLSearchParams()
        if (filter.customerId) params.set('customerId', filter.customerId)
        if (filter.status) params.set('status', filter.status)
        params.set('pageNumber', String(filter.pageNumber ?? 1))
        params.set('pageSize', String(filter.pageSize ?? 20))
        return `/api/admin/payments?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.items.map((p) => ({ type: 'Payment' as const, id: p.id })), { type: 'Payment' as const, id: 'LIST' }]
          : [{ type: 'Payment' as const, id: 'LIST' }],
    }),
    getAdminPaymentById: builder.query<PaymentDto, number>({
      query: (id) => `/api/admin/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Payment', id }],
    }),
    refundPayment: builder.mutation<PaymentDto, number>({
      query: (id) => ({ url: `/api/admin/payments/${id}/refund`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Payment', id },
        { type: 'Payment', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useMakePaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetAdminPaymentsQuery,
  useGetAdminPaymentByIdQuery,
  useRefundPaymentMutation,
} = paymentsApi
