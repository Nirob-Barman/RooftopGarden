import { Link } from 'react-router-dom'
import { useGetCartQuery } from './cartApi'
import { CartItemRow } from './components/CartItemRow'
import { usePageTitle } from '../../hooks/usePageTitle';

export function CartPage() {
  usePageTitle("Cart");
  const { data: cart, isLoading } = useGetCartQuery()

  if (isLoading) return <div className="p-6">Loading...</div>

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>
        <p className="text-gray-500">
          Your cart is empty.{' '}
          <Link to="/products" className="text-green-700 underline">
            Browse products
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>
      <div>
        {cart.items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-lg font-semibold">
        <span>Total</span>
        <span>${cart.totalAmount.toFixed(2)}</span>
      </div>
      <Link
        to="/checkout"
        className="mt-4 block w-full rounded bg-green-700 px-3 py-2 text-center text-white"
      >
        Proceed to checkout
      </Link>
    </div>
  )
}
