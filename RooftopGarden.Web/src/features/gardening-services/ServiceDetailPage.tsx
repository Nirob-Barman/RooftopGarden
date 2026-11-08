import { useParams, Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useGetServiceByIdQuery } from "./gardeningServicesApi";
import { usePageTitle } from "../../hooks/usePageTitle";

export function ServiceDetailPage() {
  usePageTitle("Service Details");

  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.auth.user);

  const {
    data: service,
    isLoading,
    error,
  } = useGetServiceByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-24 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-6 dark:bg-gray-950">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl text-red-600 dark:bg-red-900/20 dark:text-red-400">
            !
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            Service Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The service you're looking for doesn't exist or is no longer
            available.
          </p>

          <Link
            to="/services"
            className="mt-6 inline-flex rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link
            to="/services"
            className="transition hover:text-green-700 dark:hover:text-green-400"
          >
            Services
          </Link>
          <span>/</span>
          <span className="font-medium text-green-700 dark:text-green-400">
            Service Details
          </span>
        </div>

        {/* Back Navigation */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-green-700 dark:text-gray-300 dark:hover:text-green-400"
        >
          <span>←</span>
          Back to Services
        </Link>

        {/* Main Content */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="grid lg:grid-cols-2">
            {/* Service Image */}
            <div className="relative min-h-[280px] bg-gray-100 dark:bg-gray-800 lg:min-h-[520px]">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-6xl text-green-700 dark:text-green-400">
                  ✿
                </div>
              )}

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-green-700 shadow-sm backdrop-blur dark:bg-gray-900/90 dark:text-green-400">
                  Rooftop Gardening Service
                </span>
              </div>
            </div>

            {/* Service Information */}
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 dark:text-green-400">
                  Service Overview
                </p>

                <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
                  {service.name}
                </h1>

                {/* Price */}
                <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5 dark:border-green-900/40 dark:bg-green-900/10">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Service Price
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-700 dark:text-green-400">
                      ${service.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      / service
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="mt-6 flex items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-xl text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    ◷
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Estimated Duration
                    </p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {service.duration}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {service.description && (
                  <div className="mt-7">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      About This Service
                    </h2>

                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Booking Action */}
              {user?.role === "Customer" && (
                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
                  <Link
                    to={`/bookings/new?serviceId=${service.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Book This Service
                    <span>→</span>
                  </Link>

                  <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                    Choose your preferred booking date and time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-2xl text-green-700 dark:text-green-400">✿</div>
            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
              Expert Gardening
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Professional rooftop gardening services.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-2xl text-green-700 dark:text-green-400">◷</div>
            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
              Scheduled Service
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Plan your service according to your schedule.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-2xl text-green-700 dark:text-green-400">✓</div>
            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
              Quality Care
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Give your rooftop garden the care it deserves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
