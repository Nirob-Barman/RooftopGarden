import { apiSlice } from '../../app/apiSlice'
import type { PagedResult } from '../catalog/productsApi'

export interface CustomerDto {
  id: string
  email: string
  fullName: string
  phoneNumber: string | null
  address: string | null
  isLockedOut: boolean
}

const CUSTOMER_LIST_TAG = { type: 'Customer' as const, id: 'LIST' as const }

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<PagedResult<CustomerDto>, { search?: string; pageNumber?: number; pageSize?: number }>(
      {
        query: ({ search, pageNumber = 1, pageSize = 20 }) => {
          const params = new URLSearchParams()
          if (search) params.set('search', search)
          params.set('pageNumber', String(pageNumber))
          params.set('pageSize', String(pageSize))
          return `/api/admin/customers?${params.toString()}`
        },
        providesTags: (result) =>
          result
            ? [...result.items.map((c) => ({ type: 'Customer' as const, id: c.id })), CUSTOMER_LIST_TAG]
            : [CUSTOMER_LIST_TAG],
      },
    ),
    lockCustomer: builder.mutation<CustomerDto, string>({
      query: (id) => ({ url: `/api/admin/customers/${id}/lock`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Customer', id }, CUSTOMER_LIST_TAG],
    }),
    unlockCustomer: builder.mutation<CustomerDto, string>({
      query: (id) => ({ url: `/api/admin/customers/${id}/unlock`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Customer', id }, CUSTOMER_LIST_TAG],
    }),
  }),
})

export const { useGetCustomersQuery, useLockCustomerMutation, useUnlockCustomerMutation } = customersApi
