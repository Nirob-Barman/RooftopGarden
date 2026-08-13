import { Link } from 'react-router-dom'
import { useGetServicesQuery } from '../gardening-services/gardeningServicesApi'

export function ServicesSection() {
  const { data: services, isLoading } = useGetServicesQuery({ pageSize: 3 })

  return (
    <section className="p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Professional Rooftop Gardening Services</h2>
        <Link to="/services" className="text-sm text-primary underline">
          View all
        </Link>
      </div>
      {isLoading ? (
        <p className="text-sm text-foreground/60">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {services?.items.map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className="block rounded-xl border border-foreground/10 bg-surface p-4"
            >
              {service.imageUrl && (
                <img src={service.imageUrl} alt={service.name} className="mb-2 h-32 w-full rounded-lg object-cover" />
              )}
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-sm text-foreground/60">{service.duration}</p>
              <p className="mt-1 font-semibold">From ${service.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
