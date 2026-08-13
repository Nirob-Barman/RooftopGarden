import { apiSlice } from '../../app/apiSlice'
import type { PagedResult } from '../catalog/productsApi'

export interface ReviewDto {
  id: number
  productId: number
  customerId: string
  rating: number
  comment: string | null
  createdAt: string
}

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<PagedResult<ReviewDto>, { productId?: number; pageNumber?: number; pageSize?: number }>({
      query: ({ productId, pageNumber = 1, pageSize = 20 }) => {
        const params = new URLSearchParams()
        if (productId) params.set('productId', String(productId))
        params.set('pageNumber', String(pageNumber))
        params.set('pageSize', String(pageSize))
        return `/api/reviews?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.items.map((r) => ({ type: 'Review' as const, id: r.id })), { type: 'Review' as const, id: 'LIST' }]
          : [{ type: 'Review' as const, id: 'LIST' }],
    }),
    createReview: builder.mutation<ReviewDto, { productId: number; rating: number; comment?: string | null }>({
      query: (body) => ({ url: '/api/reviews', method: 'POST', body }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
    updateReview: builder.mutation<ReviewDto, { id: number; rating: number; comment?: string | null }>({
      query: ({ id, ...body }) => ({ url: `/api/reviews/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' },
      ],
    }),
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' },
      ],
    }),
    adminDeleteReview: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/admin/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useAdminDeleteReviewMutation,
} = reviewsApi
