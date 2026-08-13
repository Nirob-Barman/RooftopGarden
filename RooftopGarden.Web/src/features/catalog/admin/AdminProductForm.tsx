import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetAdminProductByIdQuery,
} from '../productsApi'
import { useGetCategoriesQuery } from '../categoriesApi'
import { PLANT_TYPES, SUNLIGHT_REQUIREMENTS, WATER_REQUIREMENTS } from '../enums'

// Kept as strings (what the underlying <input>/<select> elements actually
// produce) and converted to numbers only when building the API request —
// avoids the z.coerce input/output type mismatch with the RHF resolver.
const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Price must be 0 or more'),
  stockQuantity: z
    .string()
    .min(1, 'Stock quantity is required')
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, 'Stock must be a whole number 0 or more'),
  imageUrl: z.string().max(500).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Select a category'),
  plantType: z.enum(PLANT_TYPES),
  sunlightRequirement: z.enum(SUNLIGHT_REQUIREMENTS),
  waterRequirement: z.enum(WATER_REQUIREMENTS),
})

type ProductFormValues = z.infer<typeof productSchema>

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const { data: categories } = useGetCategoriesQuery()
  const { data: existingProduct } = useGetAdminProductByIdQuery(Number(id), { skip: !isEditing })
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({ resolver: zodResolver(productSchema) })

  useEffect(() => {
    if (existingProduct) {
      reset({
        name: existingProduct.name,
        description: existingProduct.description ?? '',
        price: String(existingProduct.price),
        stockQuantity: String(existingProduct.stockQuantity),
        imageUrl: existingProduct.imageUrl ?? '',
        categoryId: String(existingProduct.categoryId),
        plantType: existingProduct.plantType as ProductFormValues['plantType'],
        sunlightRequirement: existingProduct.sunlightRequirement as ProductFormValues['sunlightRequirement'],
        waterRequirement: existingProduct.waterRequirement as ProductFormValues['waterRequirement'],
      })
    }
  }, [existingProduct, reset])

  const onSubmit = async (values: ProductFormValues) => {
    const body = {
      name: values.name,
      description: values.description || null,
      price: Number(values.price),
      stockQuantity: Number(values.stockQuantity),
      imageUrl: values.imageUrl || null,
      categoryId: Number(values.categoryId),
      plantType: values.plantType,
      sunlightRequirement: values.sunlightRequirement,
      waterRequirement: values.waterRequirement,
    }

    if (isEditing) {
      await updateProduct({ id: Number(id), ...body }).unwrap()
    } else {
      await createProduct(body).unwrap()
    }
    navigate('/admin/products')
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-semibold">{isEditing ? 'Edit product' : 'Create product'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('description')}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              {...register('price')}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="stockQuantity">
              Stock quantity
            </label>
            <input
              id="stockQuantity"
              type="number"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              {...register('stockQuantity')}
            />
            {errors.stockQuantity && <p className="mt-1 text-sm text-red-600">{errors.stockQuantity.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('imageUrl')}
          />
          {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="categoryId">
            Category
          </label>
          <select
            id="categoryId"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('categoryId')}
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="plantType">
              Plant type
            </label>
            <select
              id="plantType"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              {...register('plantType')}
            >
              {PLANT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="sunlightRequirement">
              Sunlight
            </label>
            <select
              id="sunlightRequirement"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              {...register('sunlightRequirement')}
            >
              {SUNLIGHT_REQUIREMENTS.map((req) => (
                <option key={req} value={req}>
                  {req}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="waterRequirement">
              Water
            </label>
            <select
              id="waterRequirement"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              {...register('waterRequirement')}
            >
              {WATER_REQUIREMENTS.map((req) => (
                <option key={req} value={req}>
                  {req}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="w-full rounded bg-green-700 px-3 py-2 text-white disabled:opacity-50"
        >
          {isCreating || isUpdating ? 'Saving...' : 'Save product'}
        </button>
      </form>
    </div>
  )
}
