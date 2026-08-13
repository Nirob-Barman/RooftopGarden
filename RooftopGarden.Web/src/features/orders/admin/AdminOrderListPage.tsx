import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetAdminOrdersQuery } from '../ordersApi'
import { ORDER_STATUSES } from '../enums'

const PAGE_SIZE = 20

export function AdminOrderListPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading } = useGetAdminOrdersQuery({
    status: status || undefined,
    pageNumber,
    pageSize: PAGE_SIZE,
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Manage orders</h1>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value)
          setPageNumber(1)
        }}
        className="mb-4 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
      >
        <option value="">All statuses</option>
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2">Order</th>
                <th className="py-2">Date</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
                <th className="py-2">Payment</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2">#{order.id}</td>
                  <td className="py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-2">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-2">{order.orderStatus}</td>
                  <td className="py-2">{order.paymentStatus}</td>
                  <td className="py-2 text-right">
                    <Link to={`/admin/orders/${order.id}`} className="text-green-700 underline">
                      View
                    </Link>
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
                className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
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
                className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
