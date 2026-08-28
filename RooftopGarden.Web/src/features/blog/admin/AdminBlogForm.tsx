import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateBlogMutation, useUpdateBlogMutation, useGetBlogByIdQuery } from '../blogApi'
import { usePageTitle } from '../../../hooks/usePageTitle'

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().max(500).optional().or(z.literal('')),
})

type BlogFormValues = z.infer<typeof blogSchema>

export function AdminBlogForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  usePageTitle(isEditing ? 'Edit Blog Post' : 'Create Blog Post')
  const navigate = useNavigate()

  const { data: existingPost } = useGetBlogByIdQuery(Number(id), { skip: !isEditing })
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({ resolver: zodResolver(blogSchema) })

  useEffect(() => {
    if (existingPost) {
      reset({
        title: existingPost.title,
        content: existingPost.content,
        imageUrl: existingPost.imageUrl ?? '',
      })
    }
  }, [existingPost, reset])

  const onSubmit = async (values: BlogFormValues) => {
    const body = { title: values.title, content: values.content, imageUrl: values.imageUrl || null }

    if (isEditing) {
      await updateBlog({ id: Number(id), ...body }).unwrap()
    } else {
      await createBlog(body).unwrap()
    }
    navigate('/blog')
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">{isEditing ? 'Edit article' : 'Write article'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="mt-1 w-full rounded border border-foreground/20 bg-transparent px-3 py-2"
            {...register('title')}
          />
          {errors.title && <p className="mt-1 text-sm text-error">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="imageUrl">
            Cover image URL
          </label>
          <input
            id="imageUrl"
            className="mt-1 w-full rounded border border-foreground/20 bg-transparent px-3 py-2"
            {...register('imageUrl')}
          />
          {errors.imageUrl && <p className="mt-1 text-sm text-error">{errors.imageUrl.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            rows={12}
            className="mt-1 w-full rounded border border-foreground/20 bg-transparent px-3 py-2"
            {...register('content')}
          />
          {errors.content && <p className="mt-1 text-sm text-error">{errors.content.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="w-full rounded-full bg-primary px-3 py-2 text-white disabled:opacity-50"
        >
          {isCreating || isUpdating ? 'Saving...' : 'Save article'}
        </button>
      </form>
    </div>
  )
}
