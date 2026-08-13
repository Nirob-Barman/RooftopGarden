import { apiSlice } from '../../app/apiSlice'
import type { PagedResult } from '../catalog/productsApi'

export interface WishlistItemDto {
  id: number
  productId: number
  productName: string
  productImageUrl: string | null
  productPrice: number
  createdAt: string
}

const WISHLIST_LIST_TAG = { type: 'Wishlist' as const, id: 'LIST' as const }

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<PagedResult<WishlistItemDto>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 20 }) => `/api/wishlist?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: [WISHLIST_LIST_TAG],
    }),
    addWishlistItem: builder.mutation<WishlistItemDto, { productId: number }>({
      query: (body) => ({ url: '/api/wishlist', method: 'POST', body }),
      invalidatesTags: [WISHLIST_LIST_TAG],
    }),
    removeWishlistItem: builder.mutation<void, number>({
      query: (productId) => ({ url: `/api/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: [WISHLIST_LIST_TAG],
    }),
  }),
})

export const { useGetWishlistQuery, useAddWishlistItemMutation, useRemoveWishlistItemMutation } = wishlistApi
