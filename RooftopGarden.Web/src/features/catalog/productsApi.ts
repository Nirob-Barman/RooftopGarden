import { apiSlice } from '../../app/apiSlice'

export interface ProductDto {
  id: number
  name: string
  description: string | null
  price: number
  stockQuantity: number
  imageUrl: string | null
  categoryId: number
  categoryName: string
  plantType: string
  sunlightRequirement: string
  waterRequirement: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

export interface ProductFilterParams {
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface ProductWriteRequest {
  name: string
  description?: string | null
  price: number
  stockQuantity: number
  imageUrl?: string | null
  categoryId: number
  plantType: string
  sunlightRequirement: string
  waterRequirement: string
}

function toQueryString(filter: ProductFilterParams): string {
  const params = new URLSearchParams()
  if (filter.search) params.set('search', filter.search)
  if (filter.categoryId) params.set('categoryId', String(filter.categoryId))
  if (filter.minPrice != null) params.set('minPrice', String(filter.minPrice))
  if (filter.maxPrice != null) params.set('maxPrice', String(filter.maxPrice))
  if (filter.inStockOnly) params.set('inStockOnly', 'true')
  params.set('pageNumber', String(filter.pageNumber ?? 1))
  params.set('pageSize', String(filter.pageSize ?? 20))
  return params.toString()
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PagedResult<ProductDto>, ProductFilterParams>({
      query: (filter) => `/api/products?${toQueryString(filter)}`,
      providesTags: (result) =>
        result
          ? [...result.items.map((p) => ({ type: 'Product' as const, id: p.id })), { type: 'Product' as const, id: 'LIST' }]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),
    getProductById: builder.query<ProductDto, number>({
      query: (id) => `/api/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    getAdminProducts: builder.query<PagedResult<ProductDto>, ProductFilterParams>({
      query: (filter) => `/api/admin/products?${toQueryString(filter)}`,
      providesTags: (result) =>
        result
          ? [...result.items.map((p) => ({ type: 'Product' as const, id: p.id })), { type: 'Product' as const, id: 'LIST' }]
          : [{ type: 'Product' as const, id: 'LIST' }],
    }),
    getAdminProductById: builder.query<ProductDto, number>({
      query: (id) => `/api/admin/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<ProductDto, ProductWriteRequest>({
      query: (body) => ({ url: '/api/admin/products', method: 'POST', body }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation<ProductDto, { id: number } & ProductWriteRequest>({
      query: ({ id, ...body }) => ({ url: `/api/admin/products/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/admin/products/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
