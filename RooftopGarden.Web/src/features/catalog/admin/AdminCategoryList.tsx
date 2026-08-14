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
import { useConfirmDialog } from '../../../components/useConfirmDialog'
import { Container, Card, Input, Button, Spinner } from '../../../components/ui'

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
  const { confirm, dialog } = useConfirmDialog()

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

  const handleDelete = async (id: number, name: string) => {
    if (await confirm({ title: 'Delete category', message: `Delete category "${name}"?`, destructive: true })) {
      deleteCategory(id)
    }
  }

  return (
    <Container size="md">
      <h1 className="mb-4 text-2xl font-semibold">Manage categories</h1>

      <Card className="mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <h2 className="text-sm font-medium text-foreground/70">{editingId ? 'Edit category' : 'New category'}</h2>
          <Input placeholder="Name" {...register('name')} error={errors.name?.message} />
          <Input placeholder="Description (optional)" {...register('description')} error={errors.description?.message} />
          <div className="flex gap-2">
            <Button type="submit" size="sm" isLoading={isCreating}>
              {editingId ? 'Save changes' : 'Create'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-3">
          {categories?.map((category) => (
            <Card key={category.id} padding="sm" className="flex items-center justify-between">
              <div>
                <p className="font-medium">{category.name}</p>
                {category.description && <p className="text-sm text-foreground/60">{category.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => startEditing(category)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(category.id, category.name)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {dialog}
    </Container>
  )
}
