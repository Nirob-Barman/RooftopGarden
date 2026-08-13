import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetPaymentsQuery } from './paymentsApi'

const PAGE_SIZE = 20

export function PaymentHistoryPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading } = useGetPaymentsQuery({ pageNumber, pageSize: PAGE_SIZE })

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Payment history</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">No payments yet.</p>
      ) : (
        <>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.items.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">
                    <Link to={`/orders/${payment.orderId}`} className="text-green-700 underline">
                      Order #{payment.orderId}
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500">
                    {payment.paymentMethod}
                    {payment.paidAt ? ` · ${new Date(payment.paidAt).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{payment.paymentStatus}</p>
                </div>
              </div>
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
