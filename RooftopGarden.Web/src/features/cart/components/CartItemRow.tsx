import type { CartItemDto } from '../cartApi'
import { useUpdateCartItemMutation, useRemoveCartItemMutation } from '../cartApi'

export function CartItemRow({ item }: { item: CartItemDto }) {
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation()
  const [removeCartItem, { isLoading: isRemoving }] = useRemoveCartItemMutation()

  const changeQuantity = (quantity: number) => {
    if (quantity < 1) return
    updateCartItem({ cartItemId: item.id, quantity })
  }

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4 dark:border-gray-800">
      {item.productImageUrl && (
        <img src={item.productImageUrl} alt={item.productName} className="h-16 w-16 rounded object-cover" />
      )}
      <div className="flex-1">
        <p className="font-medium">{item.productName}</p>
        <p className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isUpdating || item.quantity <= 1}
          onClick={() => changeQuantity(item.quantity - 1)}
          className="rounded border border-gray-300 px-2 disabled:opacity-40 dark:border-gray-600"
        >
          −
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => changeQuantity(item.quantity + 1)}
          className="rounded border border-gray-300 px-2 disabled:opacity-40 dark:border-gray-600"
        >
          +
        </button>
      </div>
      <p className="w-20 text-right font-medium">${item.subTotal.toFixed(2)}</p>
      <button
        type="button"
        disabled={isRemoving}
        onClick={() => removeCartItem(item.id)}
        className="text-sm text-red-600 disabled:opacity-40"
      >
        Remove
      </button>
    </div>
  )
}
