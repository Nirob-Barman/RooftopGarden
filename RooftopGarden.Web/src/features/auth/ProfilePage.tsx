import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGetProfileQuery, useUpdateProfileMutation } from './authApi'

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  profileImageUrl: z.string().max(500).optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { data: profile, isLoading } = useGetProfileQuery()
  const [updateProfile, { isLoading: isSaving, isSuccess }] = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber ?? '',
        address: profile.address ?? '',
        profileImageUrl: profile.profileImageUrl ?? '',
      })
    }
  }, [profile, reset])

  if (isLoading) return <div className="p-6">Loading...</div>
  if (!profile) return null

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile({
      fullName: values.fullName,
      phoneNumber: values.phoneNumber || null,
      address: values.address || null,
      profileImageUrl: values.profileImageUrl || null,
    })
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-2xl font-semibold">Profile</h1>
      <p className="mb-4 text-sm text-gray-500">
        {profile.email} · {profile.role}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="phoneNumber">
            Phone number
          </label>
          <input
            id="phoneNumber"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('phoneNumber')}
          />
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('address')}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="profileImageUrl">
            Profile image URL
          </label>
          <input
            id="profileImageUrl"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('profileImageUrl')}
          />
          {errors.profileImageUrl && <p className="mt-1 text-sm text-red-600">{errors.profileImageUrl.message}</p>}
        </div>
        {isSuccess && <p className="text-sm text-green-700">Saved.</p>}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded bg-green-700 px-3 py-2 text-white disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
