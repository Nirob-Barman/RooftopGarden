import { apiSlice } from '../../app/apiSlice'
import type { PagedResult } from '../catalog/productsApi'

export interface OrderItemDto {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subTotal: number
}

export interface OrderDto {
  id: number
  orderDate: string
  totalAmount: number
  shippingAddress: string
  paymentStatus: string
  orderStatus: string
  items: OrderItemDto[]
}

export interface OrderSummaryDto {
  id: number
  orderDate: string
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  itemCount: number
}

export interface AdminOrderFilterParams {
  customerId?: string
  status?: string
  pageNumber?: number
  pageSize?: number
}

const CART_TAG = { type: 'Cart' as const, id: 'CURRENT' as const }

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation<OrderDto, { shippingAddress: string }>({
      query: (body) => ({ url: '/api/orders', method: 'POST', body }),
      // Checkout clears the cart server-side, so the cart cache is stale too.
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, CART_TAG],
    }),
    getOrders: builder.query<PagedResult<OrderSummaryDto>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 20 }) => `/api/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: (result) =>
        result
          ? [...result.items.map((o) => ({ type: 'Order' as const, id: o.id })), { type: 'Order' as const, id: 'LIST' }]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),
    getOrderById: builder.query<OrderDto, number>({
      query: (id) => `/api/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation<OrderDto, number>({
      query: (id) => ({ url: `/api/orders/${id}/cancel`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
    getAdminOrders: builder.query<PagedResult<OrderSummaryDto>, AdminOrderFilterParams>({
      query: (filter) => {
        const params = new URLSearchParams()
        if (filter.customerId) params.set('customerId', filter.customerId)
        if (filter.status) params.set('status', filter.status)
        params.set('pageNumber', String(filter.pageNumber ?? 1))
        params.set('pageSize', String(filter.pageSize ?? 20))
        return `/api/admin/orders?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.items.map((o) => ({ type: 'Order' as const, id: o.id })), { type: 'Order' as const, id: 'LIST' }]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),
    getAdminOrderById: builder.query<OrderDto, number>({
      query: (id) => `/api/admin/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation<OrderDto, { id: number; newStatus: string }>({
      query: ({ id, newStatus }) => ({
        url: `/api/admin/orders/${id}/status`,
        method: 'PUT',
        body: { newStatus },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi
