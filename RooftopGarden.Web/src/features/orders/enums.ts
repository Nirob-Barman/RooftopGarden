// Mirrors RooftopGarden.Domain.Enums.OrderStatus (serialized as strings via JsonStringEnumConverter).
export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const

// Mirrors Order.CanBeCancelled() in the domain entity.
export function canCancelOrder(status: string) {
  return status === 'Pending' || status === 'Processing'
}
