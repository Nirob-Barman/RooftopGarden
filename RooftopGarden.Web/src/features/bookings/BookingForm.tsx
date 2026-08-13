import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useGetServiceByIdQuery } from '../gardening-services/gardeningServicesApi'
import { useCreateBookingMutation } from './bookingsApi'

const todayIso = () => new Date().toISOString().slice(0, 10)

const bookingSchema = z.object({
  bookingDate: z
    .string()
    .min(1, 'Booking date is required')
    .refine((v) => v >= todayIso(), 'Booking date cannot be in the past'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  address: z.string().min(1, 'Address is required').max(500),
  notes: z.string().max(1000).optional().or(z.literal('')),
})

type BookingFormValues = z.infer<typeof bookingSchema>

export function BookingForm() {
  const [searchParams] = useSearchParams()
  const serviceId = Number(searchParams.get('serviceId'))
  const navigate = useNavigate()

  const { data: service, isLoading: isLoadingService } = useGetServiceByIdQuery(serviceId, { skip: !serviceId })
  const [createBooking, { isLoading: isCreating, error }] = useCreateBookingMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({ resolver: zodResolver(bookingSchema) })

  if (!serviceId) {
    return (
      <div className="p-6">
        <p>
          Choose a service to book from the{' '}
          <Link to="/services" className="text-primary underline">
            services page
          </Link>
          .
        </p>
      </div>
    )
  }

  if (isLoadingService) return <div className="p-6">Loading...</div>
  if (!service) return <div className="p-6">Service not found.</div>

  const onSubmit = async (values: BookingFormValues) => {
    try {
      const booking = await createBooking({
        serviceId,
        bookingDate: values.bookingDate,
        preferredTime: `${values.preferredTime}:00`,
        address: values.address,
        notes: values.notes || null,
      }).unwrap()
      navigate(`/bookings/${booking.id}`)
    } catch {
      // surfaced via `error` below
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-1 text-2xl font-semibold">Book a service</h1>
      <p className="mb-4 text-sm text-foreground/70">
        {service.name} · ${service.price.toFixed(2)} · {service.duration}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-foreground/10 bg-surface p-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="bookingDate">
            Preferred date
          </label>
          <input
            id="bookingDate"
            type="date"
            min={todayIso()}
            className="mt-1 w-full rounded border border-foreground/20 bg-transparent px-3 py-2"
            {...register('bookingDate')}
          />
          {errors.bookingDate && <p className="mt-1 text-sm text-error">{errors.bookingDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="preferredTime">
            Preferred time
          </label>
          <input
            id="preferredTime"
            type="time"
            className="mt-1 w-full rounded border border-foreground/20 bg-transparent px-3 py-2"
            {...register('preferredTime')}
          />
          {errors.preferredTime && <p className="mt-1 text-sm text-error">{errors.preferredTime.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="address">
            Rooftop / property address
          </label>
          <textarea
            id="address"
            className="mt-1 w-full rounded border border-foreground/20 bg-transparent px-3 py-2"
            {...register('address')}
          />
          {errors.address && <p className="mt-1 text-sm text-error">{errors.address.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="notes">
            Additional notes (optional)
          </label>
          <textarea
            id="notes"
            className="mt-1 w-full rounded border border-foreground/20 bg-transparent px-3 py-2"
            {...register('notes')}
          />
          {errors.notes && <p className="mt-1 text-sm text-error">{errors.notes.message}</p>}
        </div>
        {error && <p className="text-sm text-error">Could not create the booking. Please try again.</p>}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full rounded-full bg-primary px-3 py-2 text-white disabled:opacity-50"
        >
          {isCreating ? 'Booking...' : 'Confirm booking'}
        </button>
      </form>
    </div>
  )
}
