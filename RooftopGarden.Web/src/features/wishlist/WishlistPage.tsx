import { Link } from "react-router-dom";
import {
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} from "./wishlistApi";
import { usePageTitle } from "../../hooks/usePageTitle";

export function WishlistPage() {
  usePageTitle("Wishlist");

  const { data, isLoading, isError, refetch } = useGetWishlistQuery({
    pageSize: 100,
  });

  const [removeWishlistItem, { isLoading: isRemoving }] =
    useRemoveWishlistItemMutation();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-foreground/10" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-2xl border border-foreground/10 bg-surface"
            >
              <div className="aspect-[4/3] bg-foreground/10" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 rounded bg-foreground/10" />
                <div className="h-4 w-1/3 rounded bg-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl">🌱</div>

        <h2 className="mt-5 text-xl font-bold">Unable to load wishlist</h2>

        <p className="mt-2 text-sm text-foreground/50">
          Something went wrong while retrieving your saved products.
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

  if (!data || data.items.length === 0) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center px-5 py-16 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-6xl">
          💚
        </div>

        <p className="mt-7 text-sm font-semibold uppercase tracking-wider text-primary">
          YOUR FAVORITES
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Your wishlist is empty
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-foreground/55">
          Save the plants and gardening essentials you love. Your favorite
          products will be waiting here whenever you're ready.
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              GREEN LIVING COLLECTION
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              My Wishlist
            </h1>

            <p className="mt-2 text-sm text-foreground/55">
              Keep track of the plants and gardening essentials you love.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:underline"
          >
            Continue Shopping
            <span>→</span>
          </Link>
        </div>

        {/* Wishlist Summary */}
        <div className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm">
          <div>
            <h2 className="font-semibold">Saved Products</h2>

            <p className="mt-1 text-xs text-foreground/50">
              Your personally selected favorites.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
            ♥
          </div>
        </div>

        {/* Product Grid */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Your Favorites</h2>

              <p className="mt-1 text-xs text-foreground/50">
                {data.items.length}{" "}
                {data.items.length === 1 ? "product" : "products"} saved
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${item.productId}`}
                  className="relative block overflow-hidden bg-foreground/[0.03]"
                >
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center text-5xl">
                      🪴
                    </div>
                  )}

                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-lg text-red-500 shadow-sm">
                    ♥
                  </span>
                </Link>

                {/* Product Information */}
                <div className="p-4">
                  <Link
                    to={`/products/${item.productId}`}
                    className="line-clamp-2 min-h-10 font-semibold transition hover:text-primary"
                  >
                    {item.productName}
                  </Link>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-primary">
                      ${item.productPrice.toFixed(2)}
                    </span>

                    <Link
                      to={`/products/${item.productId}`}
                      className="text-xs font-semibold text-foreground/50 transition hover:text-primary"
                    >
                      View Details →
                    </Link>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    disabled={isRemoving}
                    onClick={() => removeWishlistItem(item.productId)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>♡</span>
                    Remove from Wishlist
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom Banner */}
        <div className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌿</span>

            <div>
              <h3 className="font-semibold">
                Ready to grow something beautiful?
              </h3>

              <p className="mt-1 text-xs text-foreground/55">
                Discover more products for your green space.
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Browse Products →
          </Link>
        </div>
      </div>
    </div>
  );
}
