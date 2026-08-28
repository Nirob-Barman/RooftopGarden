import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetBookingsQuery, useCancelBookingMutation } from './bookingsApi'
import { canCancelBooking } from './enums'
import { useConfirmDialog } from '../../components/useConfirmDialog'
import { usePageTitle } from '../../hooks/usePageTitle'

const PAGE_SIZE = 20

export function BookingListPage() {
  usePageTitle("Bookings")
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading } = useGetBookingsQuery({ pageNumber, pageSize: PAGE_SIZE })
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation()
  const { confirm, dialog } = useConfirmDialog()

  const handleCancel = async (id: number, serviceName: string) => {
    if (await confirm({
      title: 'Cancel booking',
      message: `Cancel your booking for "${serviceName}"?`,
      confirmLabel: 'Cancel booking',
      destructive: true,
    })) {
      cancelBooking(id)
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Your bookings</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-foreground/60">
          No bookings yet.{' '}
          <Link to="/services" className="text-primary underline">
            Browse services
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {data.items.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-foreground/10 bg-surface p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{booking.serviceName}</p>
                    <p className="text-sm text-foreground/60">
                      {new Date(booking.bookingDate).toLocaleDateString()} · {booking.preferredTime}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{booking.status}</span>
                </div>
                <p className="mt-2 text-sm text-foreground/70">{booking.address}</p>
                {canCancelBooking(booking.status) && (
                  <button
                    type="button"
                    disabled={isCancelling}
                    onClick={() => handleCancel(booking.id, booking.serviceName)}
                    className="mt-2 text-sm text-error disabled:opacity-40"
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => p - 1)}
                className="rounded border border-foreground/20 px-3 py-1 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {pageNumber} of {totalPages}
              </span>
              <button
                type="button"
                disabled={pageNumber >= totalPages}
                onClick={() => setPageNumber((p) => p + 1)}
                className="rounded border border-foreground/20 px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {dialog}
    </div>
  )
}
