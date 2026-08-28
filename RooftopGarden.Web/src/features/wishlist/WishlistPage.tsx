import { Link } from 'react-router-dom'
import { useGetWishlistQuery, useRemoveWishlistItemMutation } from './wishlistApi'
import { usePageTitle } from '../../hooks/usePageTitle'

export function WishlistPage() {
  usePageTitle("Wishlist")
  const { data, isLoading } = useGetWishlistQuery({ pageSize: 100 })
  const [removeWishlistItem] = useRemoveWishlistItemMutation()

  if (isLoading) return <div className="p-6">Loading...</div>

  if (!data || data.items.length === 0) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-semibold">Your wishlist</h1>
        <p className="text-gray-500">
          Your wishlist is empty.{' '}
          <Link to="/products" className="text-green-700 underline">
            Browse products
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Your wishlist</h1>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {data.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-3">
            {item.productImageUrl && (
              <img src={item.productImageUrl} alt={item.productName} className="h-16 w-16 rounded object-cover" />
            )}
            <div className="flex-1">
              <Link to={`/products/${item.productId}`} className="font-medium text-green-700 underline">
                {item.productName}
              </Link>
              <p className="text-sm text-gray-500">${item.productPrice.toFixed(2)}</p>
            </div>
            <button type="button" onClick={() => removeWishlistItem(item.productId)} className="text-sm text-red-600">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
