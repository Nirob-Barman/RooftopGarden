import { Link } from "react-router-dom";
import { useGetCartQuery } from "./cartApi";
import { CartItemRow } from "./components/CartItemRow";
import { usePageTitle } from "../../hooks/usePageTitle";

export function CartPage() {
  usePageTitle("Shopping Cart");

  const { data: cart, isLoading, isError, refetch } = useGetCartQuery();

  if (isLoading) {
    return (
      <div className="mx-auto min-h-full max-w-6xl space-y-6 p-5 sm:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-foreground/10" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl border border-foreground/10 bg-surface"
              />
            ))}
          </div>

          <div className="h-64 animate-pulse rounded-2xl bg-foreground/10" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl">🌱</div>

        <h2 className="mt-5 text-xl font-bold">Unable to load your cart</h2>

        <p className="mt-2 text-sm text-foreground/50">
          Something went wrong while retrieving your shopping cart.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-5 py-16 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-6xl">
          🛒
        </div>

        <p className="mt-7 text-sm font-semibold uppercase tracking-wider text-primary">
          YOUR SHOPPING CART
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Your cart is empty
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-foreground/55">
          Looks like you haven't added anything to your garden yet. Explore our
          collection and find something beautiful for your green space.
        </p>

        <Link
          to="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          Explore Products
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Page Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            GREEN LIVING COLLECTION
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-foreground/55">
            Review your selected gardening essentials before checkout.
          </p>
        </div>

        {/* Cart Layout */}
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <section className="min-w-0 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Your Items</h2>

                <p className="mt-1 text-xs text-foreground/50">
                  {cart.items.length}{" "}
                  {cart.items.length === 1 ? "product" : "products"} in your
                  cart
                </p>
              </div>

              <Link
                to="/products"
                className="text-sm font-semibold text-primary transition hover:underline"
              >
                Continue Shopping →
              </Link>
            </div>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface p-4 shadow-sm transition hover:border-primary/20 sm:p-5"
                >
                  <CartItemRow item={item} />
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground/55 transition hover:text-primary"
            >
              <span>←</span>
              Continue exploring products
            </Link>
          </section>

          {/* Order Summary */}
          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm">
              <div className="border-b border-foreground/10 p-5">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                <p className="mt-1 text-xs text-foreground/50">
                  Review your cart total.
                </p>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/55">Items</span>

                  <span className="font-medium">{cart.items.length}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-foreground/55">Subtotal</span>

                  <span className="font-medium">
                    ${cart.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-foreground/10 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Total</span>

                    <span className="text-2xl font-bold text-primary">
                      ${cart.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-foreground/45">
                    Final charges and delivery details will be shown during
                    checkout.
                  </p>
                </div>

                <Link
                  to="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Proceed to Checkout
                  <span>→</span>
                </Link>

                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-foreground/45">
                  <span>🌿</span>
                  <span>Grow something beautiful</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/[0.04] p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🪴</span>

                <div>
                  <h3 className="text-sm font-semibold">
                    Create your green space
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-foreground/55">
                    Find everything you need to bring more greenery into your
                    everyday life.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
