import { useEffect, useState } from 'react'
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
import { Container, Input, Select, Textarea, Button } from '../../../components/ui'
import { usePageTitle } from '../../../hooks/usePageTitle'

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
  categoryId: z.string().min(1, 'Select a category'),
  plantType: z.enum(PLANT_TYPES),
  sunlightRequirement: z.enum(SUNLIGHT_REQUIREMENTS),
  waterRequirement: z.enum(WATER_REQUIREMENTS),
})

type ProductFormValues = z.infer<typeof productSchema>

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  usePageTitle(isEditing ? "Edit Product" : "Add Product")
  const navigate = useNavigate()

  const [imageFile, setImageFile] = useState<File | null>(null)  
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
        categoryId: String(existingProduct.categoryId),
        plantType: existingProduct.plantType as ProductFormValues['plantType'],
        sunlightRequirement: existingProduct.sunlightRequirement as ProductFormValues['sunlightRequirement'],
        waterRequirement: existingProduct.waterRequirement as ProductFormValues['waterRequirement'],
      })
    }
  }, [existingProduct, reset])

  const onSubmit = async (values: ProductFormValues) => {    
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description || "");
    formData.append("price", values.price);
    formData.append("stockQuantity", values.stockQuantity);
    formData.append("categoryId", values.categoryId);
    formData.append("plantType", values.plantType);
    formData.append("sunlightRequirement", values.sunlightRequirement);
    formData.append("waterRequirement", values.waterRequirement);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (isEditing) {
      await updateProduct({
        id: Number(id),
        formData,
      }).unwrap();
    } else {
      await createProduct(formData).unwrap();
    }

    navigate("/admin/products");
  }

  return (
    <Container size="md">
      <h1 className="mb-4 text-2xl font-semibold">
        {isEditing ? "Edit product" : "Create product"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <Textarea
          label="Description"
          {...register("description")}
          error={errors.description?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register("price")}
            error={errors.price?.message}
          />
          <Input
            label="Stock quantity"
            type="number"
            {...register("stockQuantity")}
            error={errors.stockQuantity?.message}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Product image
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              setImageFile(e.target.files?.[0] ?? null);
            }}
            className="block w-full rounded-md border border-gray-300 p-2 text-sm"
          />

          {imageFile && (
            <p className="mt-1 text-sm text-gray-500">
              Selected: {imageFile.name}
            </p>
          )}
        </div>

        <Select
          label="Category"
          {...register("categoryId")}
          error={errors.categoryId?.message}
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-3 gap-4">
          <Select label="Plant type" {...register("plantType")}>
            {PLANT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <Select label="Sunlight" {...register("sunlightRequirement")}>
            {SUNLIGHT_REQUIREMENTS.map((req) => (
              <option key={req} value={req}>
                {req}
              </option>
            ))}
          </Select>
          <Select label="Water" {...register("waterRequirement")}>
            {WATER_REQUIREMENTS.map((req) => (
              <option key={req} value={req}>
                {req}
              </option>
            ))}
          </Select>
        </div>

        <Button type="submit" fullWidth isLoading={isCreating || isUpdating}>
          {isCreating || isUpdating ? "Saving..." : "Save product"}
        </Button>
      </form>
    </Container>
  );
}
