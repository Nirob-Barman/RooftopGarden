import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetAdminPaymentsQuery, useRefundPaymentMutation } from '../paymentsApi'
import { PAYMENT_STATUSES } from '../enums'
import { useConfirmDialog } from '../../../components/useConfirmDialog'

const PAGE_SIZE = 20

export function AdminPaymentListPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading } = useGetAdminPaymentsQuery({
    status: status || undefined,
    pageNumber,
    pageSize: PAGE_SIZE,
  })
  const [refundPayment, { isLoading: isRefunding }] = useRefundPaymentMutation()
  const { confirm, dialog } = useConfirmDialog()

  const handleRefund = async (id: number, amount: number) => {
    if (await confirm({
      title: 'Refund payment',
      message: `Refund $${amount.toFixed(2)}? This cannot be undone.`,
      confirmLabel: 'Refund',
      destructive: true,
    })) {
      refundPayment(id)
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Manage payments</h1>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value)
          setPageNumber(1)
        }}
        className="mb-4 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
      >
        <option value="">All statuses</option>
        {PAYMENT_STATUSES.map((s) => (
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
                <th className="py-2">Amount</th>
                <th className="py-2">Method</th>
                <th className="py-2">Status</th>
                <th className="py-2">Paid at</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2">
                    <Link to={`/admin/orders/${payment.orderId}`} className="text-green-700 underline">
                      #{payment.orderId}
                    </Link>
                  </td>
                  <td className="py-2">${payment.amount.toFixed(2)}</td>
                  <td className="py-2">{payment.paymentMethod}</td>
                  <td className="py-2">{payment.paymentStatus}</td>
                  <td className="py-2">{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : '—'}</td>
                  <td className="py-2 text-right">
                    {payment.paymentStatus === 'Paid' && (
                      <button
                        type="button"
                        disabled={isRefunding}
                        onClick={() => handleRefund(payment.id, payment.amount)}
                        className="text-red-600 disabled:opacity-40"
                      >
                        Refund
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
      {dialog}
    </div>
  )
}
