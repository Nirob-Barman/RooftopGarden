import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetAdminOrderByIdQuery, useUpdateOrderStatusMutation } from '../ordersApi'
import { ORDER_STATUSES } from '../enums'
import { usePageTitle } from '../../../hooks/usePageTitle'

export function AdminOrderDetailPage() {
  usePageTitle("Order Details")
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, error } = useGetAdminOrderByIdQuery(Number(id))
  const [updateStatus, { isLoading: isUpdating, error: updateError }] = useUpdateOrderStatusMutation()
  const [newStatus, setNewStatus] = useState('')

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error || !order) return <div className="p-6">Order not found.</div>

  const handleUpdate = () => {
    if (newStatus) updateStatus({ id: order.id, newStatus })
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/admin/orders" className="text-sm text-green-700 underline">
        &larr; Back to orders
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">Order #{order.id}</h1>
      <p className="mt-1 text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-gray-500">Order status</dt>
          <dd>{order.orderStatus}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Payment status</dt>
          <dd>{order.paymentStatus}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-gray-500">Shipping address</dt>
          <dd>{order.shippingAddress}</dd>
        </div>
      </dl>

      <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 text-sm">
            <span>
              {item.productName} × {item.quantity} (${item.unitPrice.toFixed(2)} each)
            </span>
            <span>${item.subTotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between border-t border-gray-200 pt-2 text-lg font-semibold dark:border-gray-700">
        <span>Total</span>
        <span>${order.totalAmount.toFixed(2)}</span>
      </div>

      <div className="mt-6 flex items-end gap-3 rounded border border-gray-200 p-4 dark:border-gray-700">
        <div>
          <label className="block text-sm font-medium" htmlFor="newStatus">
            Update status
          </label>
          <select
            id="newStatus"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="mt-1 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">Select status</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          disabled={!newStatus || isUpdating}
          onClick={handleUpdate}
          className="rounded bg-green-700 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </div>
      {updateError && <p className="mt-2 text-sm text-red-600">Could not update the order status.</p>}
    </div>
  )
}
