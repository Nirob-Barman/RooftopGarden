import { useState } from 'react'
import { useGetCustomersQuery, useLockCustomerMutation, useUnlockCustomerMutation } from './customersApi'
import { useConfirmDialog } from '../../components/useConfirmDialog'
import { usePageTitle } from '../../hooks/usePageTitle'

const PAGE_SIZE = 20

export function AdminCustomerListPage() {
  usePageTitle('Manage Customers')
  const [search, setSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading } = useGetCustomersQuery({ search: search || undefined, pageNumber, pageSize: PAGE_SIZE })
  const [lockCustomer, { isLoading: isLocking }] = useLockCustomerMutation()
  const [unlockCustomer, { isLoading: isUnlocking }] = useUnlockCustomerMutation()
  const { confirm, dialog } = useConfirmDialog()

  const handleLock = async (id: string, name: string) => {
    if (await confirm({
      title: 'Lock customer',
      message: `Lock "${name}"'s account? They won't be able to log in until unlocked.`,
      confirmLabel: 'Lock',
      destructive: true,
    })) {
      lockCustomer(id)
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Manage customers</h1>

      <input
        type="search"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPageNumber(1)
        }}
        className="mb-4 w-full max-w-sm rounded border border-foreground/20 bg-transparent px-3 py-2"
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-foreground/60">No customers match this search.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-foreground/10">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((customer) => (
                <tr key={customer.id} className="border-b border-foreground/5">
                  <td className="py-2">{customer.fullName}</td>
                  <td className="py-2">{customer.email}</td>
                  <td className="py-2">{customer.phoneNumber ?? '—'}</td>
                  <td className="py-2">
                    <span className={customer.isLockedOut ? 'text-error' : 'text-primary'}>
                      {customer.isLockedOut ? 'Locked' : 'Active'}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    {customer.isLockedOut ? (
                      <button
                        type="button"
                        disabled={isUnlocking}
                        onClick={() => unlockCustomer(customer.id)}
                        className="text-primary disabled:opacity-40"
                      >
                        Unlock
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isLocking}
                        onClick={() => handleLock(customer.id, customer.fullName)}
                        className="text-error disabled:opacity-40"
                      >
                        Lock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => p - 1)}
                className="rounded border border-foreground/20 px-3 py-1 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {pageNumber} of {totalPages}
              </span>
              <button
                type="button"
                disabled={pageNumber >= totalPages}
                onClick={() => setPageNumber((p) => p + 1)}
                className="rounded border border-foreground/20 px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      {dialog}
    </div>
  )
}
