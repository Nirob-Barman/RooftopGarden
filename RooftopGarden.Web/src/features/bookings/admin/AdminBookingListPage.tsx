import { useState } from "react";
import {
  useGetAdminBookingsQuery,
  useApproveBookingMutation,
  useRejectBookingMutation,
} from "../bookingsApi";
import { BOOKING_STATUSES } from "../enums";
import { usePageTitle } from "../../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (["approved", "confirmed", "completed"].includes(normalized)) {
    return "bg-emerald-500/10 text-emerald-600";
  }

  if (normalized === "pending") {
    return "bg-amber-500/10 text-amber-600";
  }

  if (["rejected", "cancelled", "canceled"].includes(normalized)) {
    return "bg-red-500/10 text-red-600";
  }

  return "bg-foreground/5 text-foreground/60";
}

function BookingStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(status)}`}
    >
      {status.replace(/[_-]/g, " ")}
    </span>
  );
}

function BookingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-foreground/10 bg-surface p-5"
        >
          <div className="flex justify-between">
            <div className="space-y-3">
              <div className="h-4 w-36 rounded bg-foreground/10" />
              <div className="h-3 w-28 rounded bg-foreground/10" />
            </div>
            <div className="h-6 w-20 rounded-full bg-foreground/10" />
          </div>
          <div className="mt-5 h-3 w-2/3 rounded bg-foreground/10" />
          <div className="mt-3 h-3 w-1/2 rounded bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

export function AdminBookingListPage() {
  usePageTitle("Manage Bookings");

  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, refetch } = useGetAdminBookingsQuery({
    status: status || undefined,
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const [approveBooking, { isLoading: isApproving }] =
    useApproveBookingMutation();

  const [rejectBooking, { isLoading: isRejecting }] =
    useRejectBookingMutation();

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  return (
    <div className="min-h-full space-y-6 p-5 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">SERVICE MANAGEMENT</p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Manage Bookings
        </h1>

        <p className="mt-2 text-sm text-foreground/60">
          Review service requests and manage customer appointments.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm">
        <p className="text-sm text-foreground/60">Total matching bookings</p>

        <p className="mt-2 text-3xl font-bold">{data?.totalCount ?? 0}</p>

        <p className="mt-1 text-xs text-foreground/50">
          {status ? `Filtered by ${status}` : "Across all booking statuses"}
        </p>
      </div>

      {/* Booking List */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Service Bookings</h2>

            <p className="mt-1 text-sm text-foreground/50">
              Manage incoming service requests.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label
              htmlFor="booking-status"
              className="text-sm font-medium text-foreground/60"
            >
              Filter by status
            </label>

            <select
              id="booking-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPageNumber(1);
              }}
              className="rounded-xl border border-foreground/15 bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">All statuses</option>

              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/[_-]/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <BookingSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border border-foreground/10 bg-surface px-5 py-16 text-center">
            <h3 className="font-semibold">Unable to load bookings</h3>

            <p className="mt-2 text-sm text-foreground/50">
              Something went wrong while retrieving bookings.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : !data?.items.length ? (
          <div className="rounded-2xl border border-foreground/10 bg-surface px-5 py-16 text-center">
            <div className="text-4xl">📅</div>

            <h3 className="mt-4 font-semibold">No bookings found</h3>

            <p className="mt-2 text-sm text-foreground/50">
              {status
                ? "Try selecting another booking status."
                : "Customer service bookings will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data.items.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                >
                  {/* Card Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold">
                          {booking.serviceName}
                        </h3>

                        <span className="rounded-md bg-foreground/5 px-2 py-1 text-xs text-foreground/50">
                          Booking #{booking.id}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/60">
                        <span className="flex items-center gap-2">
                          <span>📅</span>

                          {new Date(booking.bookingDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>

                        <span className="flex items-center gap-2">
                          <span>🕒</span>
                          {booking.preferredTime}
                        </span>
                      </div>
                    </div>

                    <BookingStatusBadge status={booking.status} />
                  </div>

                  {/* Booking Details */}
                  <div className="mt-5 grid gap-4 border-t border-foreground/10 pt-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                        Service Address
                      </p>

                      <p className="mt-2 text-sm leading-6 text-foreground/75">
                        {booking.address}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
                        Customer Notes
                      </p>

                      <p className="mt-2 text-sm leading-6 text-foreground/75">
                        {booking.notes || "No additional notes provided."}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === "Pending" && (
                    <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-foreground/10 pt-5">
                      <button
                        type="button"
                        disabled={isRejecting}
                        onClick={() => rejectBooking(booking.id)}
                        className="rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Reject Booking
                      </button>

                      <button
                        type="button"
                        disabled={isApproving}
                        onClick={() => approveBooking(booking.id)}
                        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Approve Booking
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground/50">
                  Page {pageNumber} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber((p) => p - 1)}
                    className="rounded-xl border border-foreground/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={pageNumber >= totalPages}
                    onClick={() => setPageNumber((p) => p + 1)}
                    className="rounded-xl border border-foreground/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
