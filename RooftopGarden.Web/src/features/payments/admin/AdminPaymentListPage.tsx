import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetAdminPaymentsQuery,
  useRefundPaymentMutation,
} from "../paymentsApi";
import { PAYMENT_STATUSES } from "../enums";
import { useConfirmDialog } from "../../../components/useConfirmDialog";
import { usePageTitle } from "../../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (["paid", "completed", "success", "succeeded"].includes(normalized)) {
    return "bg-emerald-500/10 text-emerald-600";
  }

  if (["pending", "processing"].includes(normalized)) {
    return "bg-amber-500/10 text-amber-600";
  }

  if (["failed", "cancelled", "canceled"].includes(normalized)) {
    return "bg-red-500/10 text-red-600";
  }

  if (["refunded", "partially_refunded"].includes(normalized)) {
    return "bg-blue-500/10 text-blue-600";
  }

  return "bg-foreground/5 text-foreground/60";
}

function PaymentStatusBadge({ status }: { status: string }) {
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
    <div className="space-y-4 p-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center justify-between gap-4"
        >
          <div className="h-4 w-20 rounded bg-foreground/10" />
          <div className="h-4 w-24 rounded bg-foreground/10" />
          <div className="h-4 w-20 rounded bg-foreground/10" />
          <div className="h-6 w-20 rounded bg-foreground/10" />
          <div className="h-6 w-16 rounded bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

export function AdminPaymentListPage() {
  usePageTitle("Manage Payments");

  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, refetch } = useGetAdminPaymentsQuery({
    status: status || undefined,
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const [refundPayment, { isLoading: isRefunding }] =
    useRefundPaymentMutation();

  const { confirm, dialog } = useConfirmDialog();

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  const handleRefund = async (id: number, amount: number) => {
    if (
      await confirm({
        title: "Refund payment",
        message: `Refund $${amount.toFixed(2)}? This cannot be undone.`,
        confirmLabel: "Refund",
        destructive: true,
      })
    ) {
      refundPayment(id);
    }
  };

  return (
    <div className="min-h-full space-y-6 p-5 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary">FINANCIAL MANAGEMENT</p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Manage Payments
        </h1>

        <p className="mt-2 text-sm text-foreground/60">
          Monitor transactions, track payment statuses and manage refunds.
        </p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            $
          </div>

          <div>
            <p className="text-sm text-foreground/60">
              Total matching payments
            </p>

            <p className="mt-1 text-2xl font-bold">{data?.totalCount ?? 0}</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-foreground/50">
          {status ? `Filtered by ${status}` : "Across all payment statuses"}
        </p>
      </div>

      {/* Payment Transactions */}
      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-foreground/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Payment Transactions</h2>

            <p className="mt-1 text-xs text-foreground/50">
              Review and manage customer payments.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label
              htmlFor="payment-status"
              className="text-sm font-medium text-foreground/60"
            >
              Payment Status
            </label>

            <select
              id="payment-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPageNumber(1);
              }}
              className="rounded-xl border border-foreground/15 bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">All statuses</option>

              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/[_-]/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <PaymentSkeleton />
        ) : isError ? (
          <div className="px-5 py-16 text-center">
            <h3 className="font-semibold">Unable to load payments</h3>

            <p className="mt-2 text-sm text-foreground/50">
              Something went wrong while retrieving transactions.
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
          <div className="px-5 py-16 text-center">
            <div className="text-4xl">💳</div>

            <h3 className="mt-4 font-semibold">No payments found</h3>

            <p className="mt-2 text-sm text-foreground/50">
              {status
                ? "Try selecting another payment status."
                : "Customer transactions will appear here."}
            </p>
          </div>
        ) : (
          <>
            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Order
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Payment Method
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Paid At
                    </th>

                    <th className="px-5 py-4 text-right font-medium text-foreground/50">
                      Actions
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
                          to={`/admin/orders/${payment.orderId}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          #{payment.orderId}
                        </Link>

                        <p className="mt-1 text-xs text-foreground/40">
                          Payment #{payment.id}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="font-bold">
                          ${payment.amount.toFixed(2)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-medium text-foreground/70">
                          {payment.paymentMethod}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <PaymentStatusBadge status={payment.paymentStatus} />
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
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {payment.paymentStatus === "Paid" ? (
                          <button
                            type="button"
                            disabled={isRefunding}
                            onClick={() =>
                              handleRefund(payment.id, payment.amount)
                            }
                            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Refund
                          </button>
                        ) : (
                          <span className="text-xs text-foreground/30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-foreground/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground/50">
                Page {pageNumber} of {totalPages}
              </p>

              {totalPages > 1 && (
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
              )}
            </div>
          </>
        )}
      </section>

      {dialog}
    </div>
  );
}
