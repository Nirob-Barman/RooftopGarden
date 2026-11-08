import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdminOrdersQuery } from "../ordersApi";
import { ORDER_STATUSES } from "../enums";
import { usePageTitle } from "../../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (["completed", "delivered", "paid", "success"].includes(normalized)) {
    return "bg-emerald-500/10 text-emerald-600";
  }

  if (["pending", "processing", "confirmed"].includes(normalized)) {
    return "bg-amber-500/10 text-amber-600";
  }

  if (["cancelled", "canceled", "failed", "refunded"].includes(normalized)) {
    return "bg-red-500/10 text-red-600";
  }

  if (["shipped", "dispatched"].includes(normalized)) {
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

function OrderSkeleton() {
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
          <div className="h-6 w-20 rounded bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

export function AdminOrderListPage() {
  usePageTitle("Manage Orders");

  const [pageNumber, setPageNumber] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, refetch } = useGetAdminOrdersQuery({
    status: status || undefined,
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  return (
    <div className="min-h-full space-y-6 p-5 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">SALES MANAGEMENT</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Manage Orders
          </h1>

          <p className="mt-2 text-sm text-foreground/60">
            Track customer orders, payment status and order details.
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm">
        <p className="text-sm text-foreground/60">Total matching orders</p>

        <p className="mt-2 text-3xl font-bold">{data?.totalCount ?? 0}</p>

        <p className="mt-1 text-xs text-foreground/50">
          {status ? `Filtered by ${status}` : "Across all order statuses"}
        </p>
      </div>

      {/* Orders Section */}
      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
        {/* Table Header and Filter */}
        <div className="flex flex-col gap-4 border-b border-foreground/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">All Orders</h2>
            <p className="mt-1 text-xs text-foreground/50">
              Review and manage customer orders.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label
              htmlFor="order-status"
              className="text-sm font-medium text-foreground/60"
            >
              Filter by status
            </label>

            <select
              id="order-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPageNumber(1);
              }}
              className="rounded-xl border border-foreground/15 bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">All statuses</option>

              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/[_-]/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <OrderSkeleton />
        ) : isError ? (
          <div className="px-5 py-16 text-center">
            <h3 className="font-semibold">Unable to load orders</h3>

            <p className="mt-2 text-sm text-foreground/50">
              Something went wrong while retrieving orders.
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
            <div className="text-4xl">📦</div>

            <h3 className="mt-4 font-semibold">No orders found</h3>

            <p className="mt-2 text-sm text-foreground/50">
              {status
                ? "Try selecting another order status."
                : "Customer orders will appear here."}
            </p>
          </div>
        ) : (
          <>
            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Order
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Order Date
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Total Amount
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Order Status
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Payment Status
                    </th>

                    <th className="px-5 py-4 text-right font-medium text-foreground/50">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.items.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-primary/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <span className="font-semibold">#{order.id}</span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-foreground/60">
                        {new Date(order.orderDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.paymentStatus} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center rounded-lg px-3 py-2 font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          View Details →
                        </Link>
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
    </div>
  );
}
