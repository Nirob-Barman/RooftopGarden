import { apiSlice } from '../../app/apiSlice'

export interface CategoryDto {
  id: number
  name: string
  description: string | null
}

export interface CategoryWriteRequest {
  name: string
  description?: string | null
}

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryDto[], void>({
      query: () => '/api/categories',
      providesTags: (result) =>
        result
          ? [...result.map((c) => ({ type: 'Category' as const, id: c.id })), { type: 'Category' as const, id: 'LIST' }]
          : [{ type: 'Category' as const, id: 'LIST' }],
    }),
    getCategoryById: builder.query<CategoryDto, number>({
      query: (id) => `/api/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),
    createCategory: builder.mutation<CategoryDto, CategoryWriteRequest>({
      query: (body) => ({ url: '/api/categories', method: 'POST', body }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<CategoryDto, { id: number } & CategoryWriteRequest>({
      query: ({ id, ...body }) => ({ url: `/api/categories/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi
