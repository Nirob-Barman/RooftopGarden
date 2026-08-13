import { useAppSelector } from '../../../app/hooks'
import { useGetWishlistQuery, useAddWishlistItemMutation, useRemoveWishlistItemMutation } from '../wishlistApi'

export function WishlistToggleButton({ productId }: { productId: number }) {
  const user = useAppSelector((state) => state.auth.user)
  const { data } = useGetWishlistQuery({ pageSize: 100 }, { skip: user?.role !== 'Customer' })
  const [addWishlistItem, { isLoading: isAdding }] = useAddWishlistItemMutation()
  const [removeWishlistItem, { isLoading: isRemoving }] = useRemoveWishlistItemMutation()

  if (user?.role !== 'Customer') return null

  const isWishlisted = data?.items.some((item) => item.productId === productId) ?? false

  return (
    <button
      type="button"
      disabled={isAdding || isRemoving}
      onClick={() =>
        isWishlisted ? removeWishlistItem(productId) : addWishlistItem({ productId })
      }
      className="text-sm text-gray-500 hover:text-red-600 disabled:opacity-40"
      aria-pressed={isWishlisted}
    >
      {isWishlisted ? '♥ In wishlist' : '♡ Add to wishlist'}
    </button>
  )
}
