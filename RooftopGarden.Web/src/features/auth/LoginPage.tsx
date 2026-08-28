import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginMutation } from './authApi'
import { usePageTitle } from '../../hooks/usePageTitle'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  usePageTitle("Login");
  const [login, { isLoading, error }] = useLoginMutation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap()
      navigate('/')
    } catch {
      // surfaced via `error` below
    }
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-2xl font-semibold">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        {error && <p className="text-sm text-red-600">Invalid email or password.</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-green-700 px-3 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account?{' '}
        <Link className="text-green-700 underline" to="/register">
          Register
        </Link>
      </p>
    </div>
  )
}
