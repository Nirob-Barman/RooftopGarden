import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { useAddCartItemMutation } from '../cartApi'

export function AddToCartButton({ productId, inStock }: { productId: number; inStock: boolean }) {
  const user = useAppSelector((state) => state.auth.user)
  const [quantity, setQuantity] = useState(1)
  const [addCartItem, { isLoading, isSuccess }] = useAddCartItemMutation()

  if (!inStock) {
    return <p className="text-sm text-red-600">Out of stock</p>
  }

  if (!user) {
    return (
      <p className="text-sm">
        <Link to="/login" className="text-green-700 underline">
          Log in
        </Link>{' '}
        to add this to your cart.
      </p>
    )
  }

  if (user.role !== 'Customer') {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        className="w-16 rounded border border-gray-300 px-2 py-2 dark:border-gray-600 dark:bg-gray-800"
      />
      <button
        type="button"
        disabled={isLoading}
        onClick={() => addCartItem({ productId, quantity })}
        className="rounded bg-green-700 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isLoading ? 'Adding...' : 'Add to cart'}
      </button>
      {isSuccess && <span className="text-sm text-green-700">Added!</span>}
    </div>
  )
}
