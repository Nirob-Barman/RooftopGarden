import { Link } from "react-router-dom";
import { useGetServicesQuery } from "../gardening-services/gardeningServicesApi";

function ServiceSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-52 animate-pulse bg-gray-100 dark:bg-gray-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function ServicesSection() {
  const { data: services, isLoading } = useGetServicesQuery({
    pageSize: 3,
  });

  return (
    <section className="bg-white px-5 py-16 dark:bg-gray-950 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700 dark:text-green-400">
              Professional Gardening Care
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Gardening Services
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
              Let our gardening experts help you design, build, and maintain
              your dream rooftop garden.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-green-700 px-5 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-700 hover:text-white dark:border-green-500 dark:text-green-400 dark:hover:bg-green-700 dark:hover:text-white"
          >
            Explore All Services
            <span>→</span>
          </Link>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <ServiceSkeleton key={index} />
            ))}
          </div>
        ) : services?.items.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.items.slice(0, 3).map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-800"
              >
                {/* Service Image */}
                <div className="relative h-56 overflow-hidden bg-green-50 dark:bg-gray-800">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-6xl">🌿</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />

                  <div className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-semibold text-green-800 backdrop-blur-sm">
                    Professional Service
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                    {service.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>◷</span>
                    <span>{service.duration}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-400">
                        ${service.price.toFixed(2)}
                      </p>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-lg text-green-700 transition group-hover:bg-green-700 group-hover:text-white dark:bg-green-900/30 dark:text-green-400">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="text-4xl">🪴</div>

            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              No Services Available
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Our gardening services will be available here soon.
            </p>

            <Link
              to="/services"
              className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Explore Services
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoading && services?.items.length ? (
          <div className="mt-10 rounded-2xl bg-[#f3f8f1] p-6 text-center dark:bg-gray-900 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Ready to Build Your Dream Garden?
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
              Discover our complete range of gardening services and bring your
              rooftop garden to life.
            </p>

            <Link
              to="/services"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Discover Our Services →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
