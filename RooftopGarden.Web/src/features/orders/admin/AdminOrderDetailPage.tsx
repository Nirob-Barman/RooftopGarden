import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../ordersApi";
import { ORDER_STATUSES } from "../enums";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { ConfirmDialog } from "../../../components/ConfirmDialog";

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

function SummaryCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/55">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>

      <h3 className="mt-3 text-2xl font-bold tracking-tight capitalize">
        {value}
      </h3>

      <p className="mt-1 text-xs text-foreground/45">{description}</p>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="min-h-full animate-pulse space-y-6 p-5 sm:p-6 lg:p-8">
      <div className="h-8 w-64 rounded-lg bg-foreground/10" />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-foreground/10" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-2xl bg-foreground/10 lg:col-span-2" />
        <div className="h-80 rounded-2xl bg-foreground/10" />
      </div>
    </div>
  );
}

export function AdminOrderDetailPage() {
  usePageTitle("Order Details");

  const { id } = useParams<{ id: string }>();

  const orderId = Number(id);
  const validId = Number.isInteger(orderId) && orderId > 0;

  const {
    data: order,
    isLoading,
    error,
  } = useGetAdminOrderByIdQuery(orderId, {
    skip: !validId,
  });

  const [updateStatus, { isLoading: isUpdating, error: updateError }] =
    useUpdateOrderStatusMutation();

  const [newStatus, setNewStatus] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdate = async () => {
    if (!newStatus || !order || isUpdating) return;

    try {
      await updateStatus({
        id: order.id,
        newStatus,
      }).unwrap();

      setNewStatus("");
      setShowConfirmModal(false);
      setSuccessMessage("Order status updated successfully.");
    } catch {
      // RTK Query exposes the error through updateError.
    }
  };

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (!validId || error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl">📦</div>

        <h2 className="mt-5 text-xl font-bold">Order not found</h2>

        <p className="mt-2 max-w-sm text-sm text-foreground/50">
          We couldn't find the requested order. It may have been removed or the
          order ID is invalid.
        </p>

        <Link
          to="/admin/orders"
          className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="min-h-full space-y-7 p-5 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <Link
          to="/admin/orders"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-foreground/50 transition hover:text-primary"
        >
          <span>←</span>
          Back to Orders
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              SALES MANAGEMENT
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Order #{order.id}
            </h1>

            <p className="mt-2 text-sm text-foreground/55">
              Placed on{" "}
              {new Date(order.orderDate).toLocaleString(undefined, {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.orderStatus} />
            <StatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Order Total"
          value={`$${order.totalAmount.toFixed(2)}`}
          description="Total order value"
          icon="💰"
        />

        <SummaryCard
          label="Total Items"
          value={String(itemCount)}
          description={`${order.items.length} different products`}
          icon="📦"
        />

        <SummaryCard
          label="Order Status"
          value={order.orderStatus.replace(/[_-]/g, " ")}
          description="Current fulfillment status"
          icon="🚚"
        />

        <SummaryCard
          label="Payment Status"
          value={order.paymentStatus.replace(/[_-]/g, " ")}
          description="Current payment status"
          icon="💳"
        />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600"
        >
          <span>✓</span>
          {successMessage}
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="ml-auto text-lg"
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
            <div className="border-b border-foreground/10 p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Order Items</h2>

              <p className="mt-1 text-sm text-foreground/50">
                Products included in this order.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Product
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Unit Price
                    </th>

                    <th className="px-5 py-4 font-medium text-foreground/50">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-right font-medium text-foreground/50">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-foreground/5 transition-colors last:border-0 hover:bg-primary/[0.02]"
                    >
                      <td className="px-5 py-5">
                        <p className="font-semibold">{item.productName}</p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-foreground/60">
                        ${item.unitPrice.toFixed(2)}
                      </td>

                      <td className="px-5 py-5">
                        <span className="rounded-lg bg-foreground/5 px-3 py-1.5 text-xs font-semibold">
                          × {item.quantity}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-right font-semibold">
                        ${item.subTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="border-t border-foreground/10 bg-foreground/[0.02] p-5 sm:p-6">
              <div className="ml-auto max-w-xs space-y-3">
                <div className="flex justify-between text-sm text-foreground/55">
                  <span>Total products</span>
                  <span>{itemCount} items</span>
                </div>

                <div className="flex justify-between border-t border-foreground/10 pt-3">
                  <span className="font-semibold">Grand Total</span>

                  <span className="text-xl font-bold text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Information */}
          <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                📍
              </div>

              <div>
                <h2 className="font-semibold">Shipping Information</h2>

                <p className="mt-1 text-xs text-foreground/50">
                  Delivery destination for this order.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-foreground/[0.03] p-4">
              <p className="whitespace-pre-line text-sm leading-7 text-foreground/70">
                {order.shippingAddress || "No shipping address provided."}
              </p>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="space-y-6">
          {/* Manage Order */}
          <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                🔄
              </div>

              <div>
                <h2 className="font-semibold">Manage Order</h2>

                <p className="mt-1 text-xs text-foreground/50">
                  Update fulfillment status.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Current Status
              </p>

              <StatusBadge status={order.orderStatus} />
            </div>

            <div className="mt-6">
              <label
                htmlFor="newStatus"
                className="mb-2 block text-sm font-semibold"
              >
                New Order Status
              </label>

              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => {
                  setNewStatus(e.target.value);
                  setSuccessMessage("");
                }}
                className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Select new status</option>

                {ORDER_STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                    disabled={status === order.orderStatus}
                  >
                    {status.replace(/[_-]/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!newStatus || isUpdating}
              onClick={() => setShowConfirmModal(true)}
              className="mt-4 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Update Order Status
            </button>

            {updateError && (
              <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600">
                Could not update the order status. Please try again.
              </p>
            )}
          </section>

          {/* Payment Information */}
          <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">
                💳
              </div>

              <div>
                <h2 className="font-semibold">Payment Information</h2>

                <p className="mt-1 text-xs text-foreground/50">
                  Payment overview.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground/50">Payment Status</span>

                <StatusBadge status={order.paymentStatus} />
              </div>

              <div className="flex justify-between gap-3 border-t border-foreground/10 pt-4 text-sm">
                <span className="text-foreground/50">Order Amount</span>

                <span className="font-semibold">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Reusable Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirmModal}
        title="Update Order Status?"
        message={`Are you sure you want to change order #${order.id} to ${newStatus.replace(/[_-]/g, " ")}?`}
        confirmLabel="Update Status"
        cancelLabel="Cancel"
        onConfirm={handleUpdate}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
