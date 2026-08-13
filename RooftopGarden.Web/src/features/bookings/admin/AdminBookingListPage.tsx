import { useState } from 'react'
import { useGetAdminBookingsQuery, useApproveBookingMutation, useRejectBookingMutation } from '../bookingsApi'
import { BOOKING_STATUSES } from '../enums'

const PAGE_SIZE = 20

export function AdminBookingListPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const [status, setStatus] = useState('')
  const { data, isLoading } = useGetAdminBookingsQuery({ status: status || undefined, pageNumber, pageSize: PAGE_SIZE })
  const [approveBooking, { isLoading: isApproving }] = useApproveBookingMutation()
  const [rejectBooking, { isLoading: isRejecting }] = useRejectBookingMutation()

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Manage bookings</h1>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value)
          setPageNumber(1)
        }}
        className="mb-4 rounded border border-foreground/20 bg-transparent px-3 py-2"
      >
        <option value="">All statuses</option>
        {BOOKING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-foreground/60">No bookings match this filter.</p>
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
                {booking.notes && <p className="mt-1 text-sm text-foreground/60">Notes: {booking.notes}</p>}
                {booking.status === 'Pending' && (
                  <div className="mt-2 flex gap-3 text-sm">
                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={() => approveBooking(booking.id)}
                      className="text-primary disabled:opacity-40"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={isRejecting}
                      onClick={() => rejectBooking(booking.id)}
                      className="text-error disabled:opacity-40"
                    >
                      Reject
                    </button>
                  </div>
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
    </div>
  )
}
