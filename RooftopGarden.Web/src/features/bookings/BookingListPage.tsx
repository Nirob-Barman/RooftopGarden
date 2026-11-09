import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetBookingsQuery, useCancelBookingMutation } from "./bookingsApi";
import { canCancelBooking } from "./enums";
import { useConfirmDialog } from "../../components/useConfirmDialog";
import { usePageTitle } from "../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (["completed", "confirmed", "approved"].includes(normalized)) {
    return "bg-emerald-500/10 text-emerald-600";
  }

  if (["pending", "processing"].includes(normalized)) {
    return "bg-amber-500/10 text-amber-600";
  }

  if (["cancelled", "canceled", "rejected"].includes(normalized)) {
    return "bg-red-500/10 text-red-600";
  }

  if (["inprogress", "in_progress"].includes(normalized)) {
    return "bg-blue-500/10 text-blue-600";
  }

  return "bg-foreground/5 text-foreground/60";
}

function StatusBadge({ status }: { status: string }) {
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
    <div className="space-y-4 p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-foreground/10 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="h-4 w-40 rounded bg-foreground/10" />
              <div className="h-3 w-32 rounded bg-foreground/10" />
            </div>
            <div className="h-6 w-20 rounded-full bg-foreground/10" />
          </div>
          <div className="mt-5 h-3 w-3/4 rounded bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

export function BookingListPage() {
  usePageTitle("Bookings");

  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading } = useGetBookingsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();

  const { confirm, dialog } = useConfirmDialog();

  const handleCancel = async (id: number, serviceName: string) => {
    if (
      await confirm({
        title: "Cancel booking",
        message: `Cancel your booking for "${serviceName}"?`,
        confirmLabel: "Cancel booking",
        destructive: true,
      })
    ) {
      cancelBooking(id);
    }
  };

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  return (
    <div className="min-h-full space-y-7 p-5 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            SERVICE MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Bookings
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/60">
            Manage your gardening service appointments, check booking details,
            and keep track of your scheduled services.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-foreground/50">
          <span className="text-xl">🌿</span>
          <span>Grow something beautiful</span>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            📅
          </div>

          <div>
            <p className="text-sm text-foreground/60">Total Bookings</p>

            <p className="mt-1 text-2xl font-bold text-foreground">
              {data?.totalCount ?? 0}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-foreground/45">
          Your gardening service booking history.
        </p>
      </div>

      {/* Booking List */}
      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col gap-2 border-b border-foreground/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">All Bookings</h2>

            <p className="mt-1 text-xs text-foreground/50">
              View and manage your gardening service appointments.
            </p>
          </div>

          {!isLoading && data && data.items.length > 0 && (
            <span className="text-xs font-medium text-foreground/50">
              Showing {data.items.length} of {data.totalCount} bookings
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <BookingSkeleton />
        ) : !data || data.items.length === 0 ? (
          /* Empty State */
          <div className="px-5 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              🪴
            </div>

            <h3 className="mt-5 text-lg font-semibold text-foreground">
              No bookings yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-foreground/50">
              You haven't booked any gardening services yet. Explore our
              services and schedule your first appointment.
            </p>

            <Link
              to="/services"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Explore Services
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Service
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Booking Date
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Preferred Time
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Address
                    </th>

                    <th className="px-5 py-4 text-right font-medium text-foreground/50">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.items.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-primary/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">
                          {booking.serviceName}
                        </p>
                        <p className="mt-1 text-xs text-foreground/45">
                          Booking #{booking.id}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-foreground/60">
                        {new Date(booking.bookingDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-foreground/60">
                        {booking.preferredTime}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={booking.status} />
                      </td>

                      <td className="max-w-[200px] px-5 py-4">
                        <p className="line-clamp-2 text-foreground/60">
                          {booking.address}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        {canCancelBooking(booking.status) && (
                          <button
                            type="button"
                            disabled={isCancelling}
                            onClick={() =>
                              handleCancel(booking.id, booking.serviceName)
                            }
                            className="rounded-lg px-3 py-2 text-xs font-semibold text-error transition-colors hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Booking Cards */}
            <div className="divide-y divide-foreground/5 md:hidden">
              {data.items.map((booking) => (
                <div key={booking.id} className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-foreground/50">
                        Booking #{booking.id}
                      </p>

                      <h3 className="mt-1 font-semibold text-foreground">
                        {booking.serviceName}
                      </h3>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-foreground/50">Booking Date</p>
                      <p className="mt-1 text-sm font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-foreground/50">
                        Preferred Time
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {booking.preferredTime}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-foreground/[0.03] p-3">
                    <p className="text-xs font-medium text-foreground/50">
                      Service Address
                    </p>
                    <p className="mt-1 text-sm leading-5 text-foreground/70">
                      {booking.address}
                    </p>
                  </div>

                  {canCancelBooking(booking.status) && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={isCancelling}
                        onClick={() =>
                          handleCancel(booking.id, booking.serviceName)
                        }
                        className="rounded-xl border border-error/20 px-4 py-2 text-xs font-semibold text-error transition-colors hover:bg-error/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isCancelling ? "Cancelling..." : "Cancel Booking"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-foreground/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground/50">
                  Page{" "}
                  <span className="font-semibold text-foreground">
                    {pageNumber}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber((p) => p - 1)}
                    className="rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <span className="rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary">
                    {pageNumber}
                  </span>

                  <button
                    type="button"
                    disabled={pageNumber >= totalPages}
                    onClick={() => setPageNumber((p) => p + 1)}
                    className="rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {dialog}
    </div>
  );
}
