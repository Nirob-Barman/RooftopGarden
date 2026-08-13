import { apiSlice } from '../../app/apiSlice'
import type { PagedResult } from '../catalog/productsApi'

export interface BlogDto {
  id: number
  title: string
  content: string
  imageUrl: string | null
  authorId: string
  createdAt: string
  updatedAt: string | null
}

export interface BlogWriteRequest {
  title: string
  content: string
  imageUrl?: string | null
}

const BLOG_LIST_TAG = { type: 'Blog' as const, id: 'LIST' as const }

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<PagedResult<BlogDto>, { pageNumber?: number; pageSize?: number }>({
      query: ({ pageNumber = 1, pageSize = 20 }) => `/api/blogs?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      providesTags: (result) =>
        result
          ? [...result.items.map((b) => ({ type: 'Blog' as const, id: b.id })), BLOG_LIST_TAG]
          : [BLOG_LIST_TAG],
    }),
    getBlogById: builder.query<BlogDto, number>({
      query: (id) => `/api/blogs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Blog', id }],
    }),
    createBlog: builder.mutation<BlogDto, BlogWriteRequest>({
      query: (body) => ({ url: '/api/blogs', method: 'POST', body }),
      invalidatesTags: [BLOG_LIST_TAG],
    }),
    updateBlog: builder.mutation<BlogDto, { id: number } & BlogWriteRequest>({
      query: ({ id, ...body }) => ({ url: `/api/blogs/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Blog', id }, BLOG_LIST_TAG],
    }),
    deleteBlog: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/blogs/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Blog', id }, BLOG_LIST_TAG],
    }),
  }),
})

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi
