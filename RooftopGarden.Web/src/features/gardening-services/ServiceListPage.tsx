import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { useGetServicesQuery, useDeleteServiceMutation } from './gardeningServicesApi'
import { useConfirmDialog } from '../../components/useConfirmDialog'
import { usePageTitle } from '../../hooks/usePageTitle';

export function ServiceListPage() {
  usePageTitle("Services");
  const user = useAppSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'Admin'
  const { data, isLoading } = useGetServicesQuery({ pageSize: 50 })
  const [deleteService] = useDeleteServiceMutation()
  const { confirm, dialog } = useConfirmDialog()

  const handleDeactivate = async (id: number, name: string) => {
    if (await confirm({
      title: 'Deactivate service',
      message: `Deactivate "${name}"? It will no longer be visible to customers.`,
      confirmLabel: 'Deactivate',
      destructive: true,
    })) {
      deleteService(id)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rooftop gardening services</h1>
        {isAdmin && (
          <Link to="/services/new" className="rounded bg-green-700 px-3 py-2 text-sm text-white">
            Create service
          </Link>
        )}
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">No services available right now.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.items.map((service) => (
            <div key={service.id} className="rounded border border-gray-200 p-4 dark:border-gray-700">
              {service.imageUrl && (
                <img src={service.imageUrl} alt={service.name} className="mb-2 h-32 w-full rounded object-cover" />
              )}
              <Link to={`/services/${service.id}`} className="font-medium text-green-700 underline">
                {service.name}
              </Link>
              <p className="text-sm text-gray-500">{service.duration}</p>
              <p className="mt-1 font-semibold">${service.price.toFixed(2)}</p>
              {isAdmin && (
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-gray-500">{service.isActive ? 'Active' : 'Inactive'}</span>
                  <Link to={`/services/${service.id}/edit`} className="text-green-700 underline">
                    Edit
                  </Link>
                  {service.isActive && (
                    <button
                      type="button"
                      onClick={() => handleDeactivate(service.id, service.name)}
                      className="text-red-600"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {dialog}
    </div>
  )
}
