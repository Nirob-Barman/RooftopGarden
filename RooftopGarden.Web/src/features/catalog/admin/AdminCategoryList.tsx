import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type CategoryDto,
} from '../categoriesApi'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function AdminCategoryList() {
  const { data: categories, isLoading } = useGetCategoriesQuery()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [editingId, setEditingId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) })

  const startEditing = (category: CategoryDto) => {
    setEditingId(category.id)
    reset({ name: category.name, description: category.description ?? '' })
  }

  const cancelEditing = () => {
    setEditingId(null)
    reset({ name: '', description: '' })
  }

  const onSubmit = async (values: CategoryFormValues) => {
    const body = { name: values.name, description: values.description || null }
    if (editingId) {
      await updateCategory({ id: editingId, ...body }).unwrap()
      setEditingId(null)
    } else {
      await createCategory(body).unwrap()
    }
    reset({ name: '', description: '' })
  }

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      deleteCategory(id)
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-semibold">Manage categories</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-3 rounded border border-gray-200 p-4 dark:border-gray-700">
        <h2 className="text-sm font-medium">{editingId ? 'Edit category' : 'New category'}</h2>
        <div>
          <input
            placeholder="Name"
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <input
            placeholder="Description (optional)"
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('description')}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={isCreating} className="rounded bg-green-700 px-3 py-2 text-sm text-white">
            {editingId ? 'Save changes' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEditing} className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
              Cancel
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {categories?.map((category) => (
            <li key={category.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{category.name}</p>
                {category.description && <p className="text-sm text-gray-500">{category.description}</p>}
              </div>
              <div className="flex gap-3 text-sm">
                <button type="button" onClick={() => startEditing(category)} className="text-green-700 underline">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(category.id, category.name)} className="text-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
