import { useParams, Link } from 'react-router-dom'
import { useGetServiceByIdQuery } from './gardeningServicesApi'

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: service, isLoading, error } = useGetServiceByIdQuery(Number(id))

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error || !service) return <div className="p-6">Service not found.</div>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/services" className="text-sm text-green-700 underline">
        &larr; Back to services
      </Link>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {service.imageUrl && (
          <img src={service.imageUrl} alt={service.name} className="w-full rounded object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{service.name}</h1>
          <p className="mt-2 text-xl font-semibold">${service.price.toFixed(2)}</p>
          <p className="mt-1 text-sm text-gray-500">Duration: {service.duration}</p>
          {service.description && <p className="mt-4 text-sm">{service.description}</p>}
        </div>
      </div>
    </div>
  )
}
