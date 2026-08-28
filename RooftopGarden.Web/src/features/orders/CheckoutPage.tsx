import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useGetCartQuery } from '../cart/cartApi'
import { usePlaceOrderMutation } from './ordersApi'
import { usePageTitle } from '../../hooks/usePageTitle'

const checkoutSchema = z.object({
  shippingAddress: z.string().min(1, 'Shipping address is required').max(500),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export function CheckoutPage() {
  usePageTitle("Checkout");
  const { data: cart, isLoading } = useGetCartQuery()
  const [placeOrder, { isLoading: isPlacing, error }] = usePlaceOrderMutation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) })

  if (isLoading) return <div className="p-6">Loading...</div>

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-6">
        <p>
          Your cart is empty.{' '}
          <Link to="/products" className="text-green-700 underline">
            Browse products
          </Link>
        </p>
      </div>
    )
  }

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      const order = await placeOrder(values).unwrap()
      navigate(`/orders/${order.id}`)
    } catch {
      // surfaced via `error` below
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>

      <div className="mb-6 rounded border border-gray-200 p-4 dark:border-gray-700">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between py-1 text-sm">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>${item.subTotal.toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-semibold dark:border-gray-700">
          <span>Total</span>
          <span>${cart.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="shippingAddress">
            Shipping address
          </label>
          <textarea
            id="shippingAddress"
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            {...register('shippingAddress')}
          />
          {errors.shippingAddress && <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.message}</p>}
        </div>
        {error && <p className="text-sm text-red-600">Could not place the order. Please try again.</p>}
        <button
          type="submit"
          disabled={isPlacing}
          className="w-full rounded bg-green-700 px-3 py-2 text-white disabled:opacity-50"
        >
          {isPlacing ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  )
}
