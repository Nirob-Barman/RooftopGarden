import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateServiceMutation, useUpdateServiceMutation, useGetServiceByIdQuery } from '../gardeningServicesApi'

// Duration kept as the raw "HH:MM:SS" string the API expects (TimeSpan serializes
// as a string) — validated with a regex rather than split into separate number inputs.
const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Price must be 0 or more'),
  duration: z
    .string()
    .regex(/^\d{1,2}:\d{2}:\d{2}$/, 'Use HH:MM:SS, e.g. 02:00:00'),
  imageUrl: z.string().max(500).optional().or(z.literal('')),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

export function AdminServiceForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const { data: existingService } = useGetServiceByIdQuery(Number(id), { skip: !isEditing })
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation()
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({ resolver: zodResolver(serviceSchema) })

  useEffect(() => {
    if (existingService) {
      reset({
        name: existingService.name,
        description: existingService.description ?? '',
        price: String(existingService.price),
        duration: existingService.duration,
        imageUrl: existingService.imageUrl ?? '',
      })
    }
  }, [existingService, reset])

  const onSubmit = async (values: ServiceFormValues) => {
    const body = {
      name: values.name,
      description: values.description || null,
      price: Number(values.price),
      duration: values.duration,
      imageUrl: values.imageUrl || null,
    }

    if (isEditing) {
      await updateService({ id: Number(id), ...body }).unwrap()
    } else {
      await createService(body).unwrap()
    }
    navigate('/services')
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-semibold">{isEditing ? 'Edit service' : 'Create service'}</h1>
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
            <label className="block text-sm font-medium" htmlFor="duration">
              Duration (HH:MM:SS)
            </label>
            <input
              id="duration"
              placeholder="02:00:00"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              {...register('duration')}
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
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

        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="w-full rounded bg-green-700 px-3 py-2 text-white disabled:opacity-50"
        >
          {isCreating || isUpdating ? 'Saving...' : 'Save service'}
        </button>
      </form>
    </div>
  )
}
