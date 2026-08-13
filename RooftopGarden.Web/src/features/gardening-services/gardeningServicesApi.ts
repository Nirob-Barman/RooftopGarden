import { apiSlice } from '../../app/apiSlice'
import type { PagedResult } from '../catalog/productsApi'

export interface ServiceDto {
  id: number
  name: string
  description: string | null
  price: number
  duration: string // "HH:MM:SS" — TimeSpan serializes/deserializes as a string, no conversion needed
  imageUrl: string | null
  isActive: boolean
}

export interface ServiceWriteRequest {
  name: string
  description?: string | null
  price: number
  duration: string
  imageUrl?: string | null
}

const SERVICE_LIST_TAG = { type: 'Service' as const, id: 'LIST' as const }

export const gardeningServicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Visibility (active-only vs. including inactive) is derived server-side from
    // the caller's role — no separate admin route/query needed, unlike Products.
    getServices: builder.query<PagedResult<ServiceDto>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 20 }) => `/api/services?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: (result) =>
        result
          ? [...result.items.map((s) => ({ type: 'Service' as const, id: s.id })), SERVICE_LIST_TAG]
          : [SERVICE_LIST_TAG],
    }),
    getServiceById: builder.query<ServiceDto, number>({
      query: (id) => `/api/services/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation<ServiceDto, ServiceWriteRequest>({
      query: (body) => ({ url: '/api/services', method: 'POST', body }),
      invalidatesTags: [SERVICE_LIST_TAG],
    }),
    updateService: builder.mutation<ServiceDto, { id: number } & ServiceWriteRequest>({
      query: ({ id, ...body }) => ({ url: `/api/services/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Service', id }, SERVICE_LIST_TAG],
    }),
    deleteService: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/services/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Service', id }, SERVICE_LIST_TAG],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = gardeningServicesApi
