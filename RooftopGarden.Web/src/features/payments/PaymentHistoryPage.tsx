import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetPaymentsQuery } from "./paymentsApi";
import { usePageTitle } from "../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (["completed", "paid", "success", "successful"].includes(normalized)) {
    return "bg-emerald-500/10 text-emerald-600";
  }

  if (["pending", "processing"].includes(normalized)) {
    return "bg-amber-500/10 text-amber-600";
  }

  if (["failed", "cancelled", "canceled", "refunded"].includes(normalized)) {
    return "bg-red-500/10 text-red-600";
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

function PaymentSkeleton() {
  return (
    <div className="divide-y divide-foreground/5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center justify-between gap-4 p-5"
        >
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-foreground/10" />
            <div className="h-3 w-36 rounded bg-foreground/10" />
          </div>
          <div className="space-y-2 text-right">
            <div className="ml-auto h-4 w-20 rounded bg-foreground/10" />
            <div className="ml-auto h-5 w-20 rounded bg-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PaymentHistoryPage() {
  usePageTitle("Payment History");

  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading } = useGetPaymentsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  return (
    <div className="min-h-full space-y-7 p-5 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            ACCOUNT MANAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Payment History
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/60">
            View your transactions, payment methods, and payment history. Keep
            track of all your gardening purchases in one place.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-foreground/50">
          <span className="text-xl">🌿</span>
          <span>Your purchases, all in one place</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            <span>💳</span>
          </div>

          <div>
            <p className="text-sm text-foreground/60">Total Transactions</p>

            <p className="mt-1 text-2xl font-bold text-foreground">
              {data?.totalCount ?? 0}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-foreground/45">
          Total payment records associated with your account.
        </p>
      </div>

      {/* Payment History */}
      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col gap-2 border-b border-foreground/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">All Transactions</h2>

            <p className="mt-1 text-xs text-foreground/50">
              Review your payment records and order information.
            </p>
          </div>

          {!isLoading && data && data.items.length > 0 && (
            <span className="text-xs font-medium text-foreground/50">
              Showing {data.items.length} of {data.totalCount} payments
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <PaymentSkeleton />
        ) : !data || data.items.length === 0 ? (
          /* Empty State */
          <div className="px-5 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              💳
            </div>

            <h3 className="mt-5 text-lg font-semibold text-foreground">
              No payments yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-foreground/50">
              Your payment history is currently empty. Once you make a purchase,
              your transactions will appear here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Order
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Payment Method
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Payment Date
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right font-medium text-foreground/50">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.items.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-primary/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/orders/${payment.orderId}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          #{payment.orderId}
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-foreground/70">
                        {payment.paymentMethod}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-foreground/60">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Not paid"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold">
                        ${payment.amount.toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={payment.paymentStatus} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/orders/${payment.orderId}`}
                          className="inline-flex items-center rounded-lg px-3 py-2 font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          View Order →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Payment Cards */}
            <div className="divide-y divide-foreground/5 md:hidden">
              {data.items.map((payment) => (
                <div key={payment.id} className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-foreground/50">
                        Order Reference
                      </p>

                      <Link
                        to={`/orders/${payment.orderId}`}
                        className="mt-1 inline-block font-semibold text-primary hover:underline"
                      >
                        Order #{payment.orderId}
                      </Link>
                    </div>

                    <StatusBadge status={payment.paymentStatus} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-foreground/50">
                        Payment Method
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {payment.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-foreground/50">Payment Date</p>
                      <p className="mt-1 text-sm font-medium">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString()
                          : "Not paid"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-foreground/10 pt-3">
                    <div>
                      <p className="text-xs text-foreground/50">Amount</p>
                      <p className="mt-1 text-lg font-bold">
                        ${payment.amount.toFixed(2)}
                      </p>
                    </div>

                    <Link
                      to={`/orders/${payment.orderId}`}
                      className="rounded-xl border border-foreground/15 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
                    >
                      View Order →
                    </Link>
                  </div>
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
    </div>
  );
}
