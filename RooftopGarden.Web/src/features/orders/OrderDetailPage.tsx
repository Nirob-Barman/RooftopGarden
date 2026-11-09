import { useParams, Link } from "react-router-dom";
import { useGetOrderByIdQuery, useCancelOrderMutation } from "./ordersApi";
import { canCancelOrder } from "./enums";
import { MakePaymentButton } from "../payments/components/MakePaymentButton";
import { useConfirmDialog } from "../../components/useConfirmDialog";
import { usePageTitle } from "../../hooks/usePageTitle";

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
    <div className="mx-auto max-w-6xl animate-pulse space-y-6 p-5 sm:p-6 lg:p-8">
      <div className="h-5 w-32 rounded bg-foreground/10" />
      <div className="h-10 w-64 rounded bg-foreground/10" />

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

      <h3 className="mt-3 text-2xl font-bold capitalize tracking-tight">
        {value}
      </h3>

      <p className="mt-1 text-xs text-foreground/45">{description}</p>
    </div>
  );
}

export function OrderDetailPage() {
  usePageTitle("Order Details");

  const { id } = useParams<{ id: string }>();

  const orderId = Number(id);
  const validId = Number.isInteger(orderId) && orderId > 0;

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId, {
    skip: !validId,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const { confirm, dialog } = useConfirmDialog();

  const handleCancel = async () => {
    if (!order || isCancelling) return;

    const confirmed = await confirm({
      title: "Cancel order",
      message: `Are you sure you want to cancel order #${order.id}? This cannot be undone.`,
      confirmLabel: "Cancel order",
      destructive: true,
    });

    if (confirmed) {
      await cancelOrder(order.id);
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
          We couldn't find the requested order. Please check the order
          information and try again.
        </p>

        <Link
          to="/orders"
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

  const isCancelled = order.orderStatus.toLowerCase() === "cancelled";

  const canMakePayment = order.paymentStatus === "Pending" && !isCancelled;

  return (
    <div className="min-h-full p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Page Header */}
        <div>
          <Link
            to="/orders"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-foreground/50 transition hover:text-primary"
          >
            <span>←</span>
            Back to My Orders
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                YOUR PURCHASES
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

            {canCancelOrder(order.orderStatus) && (
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancel}
                className="rounded-xl border border-red-500/20 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Order Total"
            value={`$${order.totalAmount.toFixed(2)}`}
            description="Total order amount"
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
            description="Current order progress"
            icon="🚚"
          />

          <SummaryCard
            label="Payment Status"
            value={order.paymentStatus.replace(/[_-]/g, " ")}
            description="Current payment progress"
            icon="💳"
          />
        </div>

        {/* Main Layout */}
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Items */}
            <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
              <div className="border-b border-foreground/10 p-5 sm:p-6">
                <h2 className="text-lg font-semibold">Order Items</h2>

                <p className="mt-1 text-sm text-foreground/50">
                  Products included in your order.
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

              {/* Order Total */}
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

            {/* Shipping Address */}
            <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                  📍
                </div>

                <div>
                  <h2 className="font-semibold">Shipping Information</h2>

                  <p className="mt-1 text-xs text-foreground/50">
                    Your delivery destination.
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
          <aside className="space-y-6 lg:sticky lg:top-6">
            {/* Order Status */}
            <section className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                  🚚
                </div>

                <div>
                  <h2 className="font-semibold">Order Status</h2>

                  <p className="mt-1 text-xs text-foreground/50">
                    Current fulfillment status.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                  Order Progress
                </p>

                <StatusBadge status={order.orderStatus} />
              </div>

              {isCancelled && (
                <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-xs leading-5 text-red-600">
                  This order has been cancelled.
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
                    Your payment overview.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground/50">Payment Status</span>

                  <StatusBadge status={order.paymentStatus} />
                </div>

                <div className="flex justify-between border-t border-foreground/10 pt-4 text-sm">
                  <span className="text-foreground/50">Total Amount</span>

                  <span className="font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {canMakePayment && (
                <div className="mt-5 border-t border-foreground/10 pt-5">
                  <p className="mb-3 text-xs leading-5 text-foreground/50">
                    Your payment is still pending. Complete your payment to
                    proceed with your order.
                  </p>

                  <MakePaymentButton orderId={order.id} />
                </div>
              )}
            </section>

            {/* Support Information */}
            <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌿</span>

                <div>
                  <h3 className="text-sm font-semibold">
                    Thank you for choosing us!
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-foreground/55">
                    We appreciate your support. We hope your new additions make
                    your green space beautiful.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Existing Confirmation Dialog */}
      {dialog}
    </div>
  );
}
