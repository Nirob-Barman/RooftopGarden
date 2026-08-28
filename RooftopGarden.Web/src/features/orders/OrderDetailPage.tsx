import { useParams, Link } from 'react-router-dom'
import { useGetOrderByIdQuery, useCancelOrderMutation } from './ordersApi'
import { canCancelOrder } from './enums'
import { MakePaymentButton } from '../payments/components/MakePaymentButton'
import { useConfirmDialog } from '../../components/useConfirmDialog'
import { usePageTitle } from '../../hooks/usePageTitle'

export function OrderDetailPage() {
  usePageTitle("Order Details")
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading, error } = useGetOrderByIdQuery(Number(id))
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()
  const { confirm, dialog } = useConfirmDialog()

  const handleCancel = async () => {
    if (!order) return
    if (await confirm({
      title: 'Cancel order',
      message: `Cancel order #${order.id}? This cannot be undone.`,
      confirmLabel: 'Cancel order',
      destructive: true,
    })) {
      cancelOrder(order.id)
    }
  }

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error || !order) return <div className="p-6">Order not found.</div>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/orders" className="text-sm text-green-700 underline">
        &larr; Back to orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
        {canCancelOrder(order.orderStatus) && (
          <button
            type="button"
            disabled={isCancelling}
            onClick={handleCancel}
            className="rounded border border-red-600 px-3 py-1 text-sm text-red-600 disabled:opacity-40"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel order'}
          </button>
        )}
      </div>

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

      {order.paymentStatus === 'Pending' && order.orderStatus !== 'Cancelled' && (
        <MakePaymentButton orderId={order.id} />
      )}
      {dialog}
    </div>
  )
}
