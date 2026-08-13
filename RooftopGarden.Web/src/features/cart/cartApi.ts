import { apiSlice } from '../../app/apiSlice'

export interface CartItemDto {
  id: number
  productId: number
  productName: string
  productImageUrl: string | null
  unitPrice: number
  quantity: number
  subTotal: number
}

export interface CartDto {
  id: number
  items: CartItemDto[]
  totalAmount: number
}

const CART_TAG = { type: 'Cart' as const, id: 'CURRENT' as const }

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartDto, void>({
      query: () => '/api/cart',
      providesTags: [CART_TAG],
    }),
    addCartItem: builder.mutation<CartDto, { productId: number; quantity: number }>({
      query: (body) => ({ url: '/api/cart/items', method: 'POST', body }),
      invalidatesTags: [CART_TAG],
    }),
    updateCartItem: builder.mutation<CartDto, { cartItemId: number; quantity: number }>({
      query: ({ cartItemId, quantity }) => ({
        url: `/api/cart/items/${cartItemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: [CART_TAG],
    }),
    removeCartItem: builder.mutation<CartDto, number>({
      query: (cartItemId) => ({ url: `/api/cart/items/${cartItemId}`, method: 'DELETE' }),
      invalidatesTags: [CART_TAG],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi
