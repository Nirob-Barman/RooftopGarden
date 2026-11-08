import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  useGetServicesQuery,
  useDeleteServiceMutation,
} from "./gardeningServicesApi";
import { useConfirmDialog } from "../../components/useConfirmDialog";
import { usePageTitle } from "../../hooks/usePageTitle";

export function ServiceListPage() {
  usePageTitle("Services");

  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "Admin";

  const { data, isLoading } = useGetServicesQuery({ pageSize: 50 });
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const { confirm, dialog } = useConfirmDialog();

  const handleDeactivate = async (id: number, name: string) => {
    if (
      await confirm({
        title: "Deactivate service",
        message: `Deactivate "${name}"? It will no longer be visible to customers.`,
        confirmLabel: "Deactivate",
        destructive: true,
      })
    ) {
      await deleteService(id);
    }
  };

  const services = data?.items ?? [];
  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.length - activeCount;

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-green-700 dark:text-green-400">
                Services
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Gardening Services
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your rooftop gardening services and offerings.
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/services/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span className="text-lg">+</span>
              Create Service
            </Link>
          )}
        </div>

        {/* Statistics */}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Services
              </p>
              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {services.length}
                </h2>
                <div className="rounded-xl bg-green-100 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <span className="text-xl">✿</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Services
              </p>
              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {activeCount}
                </h2>
                <div className="rounded-xl bg-green-100 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <span className="text-xl">✓</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Inactive Services
              </p>
              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                  {inactiveCount}
                </h2>
                <div className="rounded-xl bg-gray-100 p-3 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  <span className="text-xl">◷</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Content */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col justify-between gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                All Services
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Explore and manage available gardening services.
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {services.length} services
            </span>
          </div>

          <div className="p-5">
            {/* Loading */}
            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                  >
                    <div className="h-40 bg-gray-200 dark:bg-gray-800" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ✿
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  No services available
                </h3>
                <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                  There are currently no gardening services available. Create
                  your first service to get started.
                </p>

                {isAdmin && (
                  <Link
                    to="/services/new"
                    className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                  >
                    Create Your First Service
                  </Link>
                )}
              </div>
            ) : (
              /* Service Cards */
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-800"
                  >
                    {/* Image */}
                    <Link
                      to={`/services/${service.id}`}
                      className="relative block overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-44 items-center justify-center text-4xl text-green-700 dark:text-green-400">
                          ✿
                        </div>
                      )}

                      {isAdmin && (
                        <span
                          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                            service.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-900/80 dark:text-green-300"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-4">
                      <Link
                        to={`/services/${service.id}`}
                        className="line-clamp-1 text-base font-bold text-gray-900 transition hover:text-green-700 dark:text-white dark:hover:text-green-400"
                      >
                        {service.name}
                      </Link>

                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-1">◷</span>
                        {service.duration}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Service Price
                          </p>
                          <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-400">
                            ${service.price.toFixed(2)}
                          </p>
                        </div>

                        <Link
                          to={`/services/${service.id}`}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700 dark:border-gray-700 dark:text-gray-300 dark:hover:text-green-400"
                        >
                          View Details
                        </Link>
                      </div>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                          <Link
                            to={`/services/${service.id}/edit`}
                            className="flex-1 rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-semibold text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                          >
                            Edit
                          </Link>

                          {service.isActive && (
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() =>
                                handleDeactivate(service.id, service.name)
                              }
                              className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {dialog}
    </div>
  );
}
