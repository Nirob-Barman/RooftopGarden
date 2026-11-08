import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "./productsApi";
import { AddToCartButton } from "../cart/components/AddToCartButton";
import { ReviewList } from "../reviews/components/ReviewList";
import { WishlistToggleButton } from "../wishlist/components/WishlistToggleButton";
import { usePageTitle } from "../../hooks/usePageTitle";

export function ProductDetailPage() {
  usePageTitle("Product Details");

  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-foreground/10" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-96 rounded-2xl bg-foreground/10" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded bg-foreground/10" />
              <div className="h-5 w-1/3 rounded bg-foreground/10" />
              <div className="h-12 w-1/2 rounded bg-foreground/10" />
              <div className="h-24 rounded bg-foreground/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl">🌿</div>
          <h2 className="mt-4 text-xl font-semibold">Product not found</h2>
          <p className="mt-2 text-sm text-foreground/50">
            This product may have been removed or is unavailable.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;

  const careDetails = [
    { label: "Plant Type", value: product.plantType, icon: "🌱" },
    { label: "Sunlight", value: product.sunlightRequirement, icon: "☀️" },
    { label: "Water Requirement", value: product.waterRequirement, icon: "💧" },
  ];

  return (
    <div className="min-h-full space-y-8 p-5 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/50">
        <Link to="/" className="transition hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="transition hover:text-primary">
          Products
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">{product.name}</span>
      </div>

      {/* Product Overview */}
      <section className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-sm">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-primary/5 text-8xl">
              🌿
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {product.categoryName}
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  inStock
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    inStock ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {inStock ? "In Stock" : "Out of Stock"}
              </span>

              <span className="text-sm text-foreground/50">
                {inStock
                  ? `${product.stockQuantity} available`
                  : "Currently unavailable"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="rounded-2xl border border-foreground/10 bg-surface p-5">
            <p className="text-sm text-foreground/50">Price</p>
            <p className="mt-1 text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-lg font-semibold">About this plant</h2>
              <p className="mt-2 text-sm leading-7 text-foreground/60">
                {product.description}
              </p>
            </div>
          )}

          {/* Plant Care Information */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">
              Plant Care Information
            </h2>

            <div className="grid gap-3 sm:grid-cols-3">
              {careDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-2xl border border-foreground/10 bg-surface p-4"
                >
                  <div className="text-2xl">{detail.icon}</div>
                  <p className="mt-3 text-xs text-foreground/50">
                    {detail.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {detail.value || "Not specified"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 border-t border-foreground/10 pt-6">
            <AddToCartButton productId={product.id} inStock={inStock} />

            <WishlistToggleButton productId={product.id} />
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <span>🌿</span>
            <span>Bring nature closer to your home.</span>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-foreground/10 pt-8">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Customer Feedback
          </p>
          <h2 className="mt-2 text-2xl font-bold">Reviews & Ratings</h2>
          <p className="mt-2 text-sm text-foreground/50">
            See what other gardening enthusiasts think about this product.
          </p>
        </div>

        <ReviewList productId={product.id} />
      </section>
    </div>
  );
}
