import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from './authApi'
import { usePageTitle } from '../../hooks/usePageTitle'

const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  usePageTitle("Register");
  const [registerUser, { isLoading, error }] = useRegisterMutation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({ ...values, phoneNumber: values.phoneNumber || undefined }).unwrap()
      navigate('/')
    } catch {
      // surfaced via `error` below
    }
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create an account</h1>
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
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('password')}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="phoneNumber">
            Phone number (optional)
          </label>
          <input
            id="phoneNumber"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('phoneNumber')}
          />
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
        </div>
        {error && (
          <p className="text-sm text-red-600">Could not create the account. The email may already be in use.</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-green-700 px-3 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link className="text-green-700 underline" to="/login">
          Log in
        </Link>
      </p>
    </div>
  )
}
