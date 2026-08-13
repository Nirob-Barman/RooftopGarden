// Mirrors RooftopGarden.Domain.Enums.BookingStatus (serialized as strings).
export const BOOKING_STATUSES = ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'] as const

// Mirrors Booking.CanBeCancelled() in the domain entity.
export function canCancelBooking(status: string) {
  return status === 'Pending' || status === 'Approved'
}
