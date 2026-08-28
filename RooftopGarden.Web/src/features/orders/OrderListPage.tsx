import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetOrdersQuery } from './ordersApi'
import { usePageTitle } from '../../hooks/usePageTitle'

const PAGE_SIZE = 20

export function OrderListPage() {
  usePageTitle("Orders")
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading } = useGetOrdersQuery({ pageNumber, pageSize: PAGE_SIZE })

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Your orders</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">
          You haven't placed any orders yet.{' '}
          <Link to="/products" className="text-green-700 underline">
            Browse products
          </Link>
        </p>
      ) : (
        <>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.items.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between py-3 hover:text-green-700"
              >
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()} · {order.itemCount} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.orderStatus}</p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
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
        </>
      )}
    </div>
  )
}
