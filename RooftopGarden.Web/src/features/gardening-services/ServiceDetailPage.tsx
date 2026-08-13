import { useParams, Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { useGetServiceByIdQuery } from './gardeningServicesApi'

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAppSelector((state) => state.auth.user)
  const { data: service, isLoading, error } = useGetServiceByIdQuery(Number(id))

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error || !service) return <div className="p-6">Service not found.</div>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/services" className="text-sm text-primary underline">
        &larr; Back to services
      </Link>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {service.imageUrl && (
          <img src={service.imageUrl} alt={service.name} className="w-full rounded-xl object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{service.name}</h1>
          <p className="mt-2 text-xl font-semibold">${service.price.toFixed(2)}</p>
          <p className="mt-1 text-sm text-foreground/60">Duration: {service.duration}</p>
          {service.description && <p className="mt-4 text-sm">{service.description}</p>}
          {user?.role === 'Customer' && (
            <Link
              to={`/bookings/new?serviceId=${service.id}`}
              className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-sm text-white"
            >
              Book this service
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
