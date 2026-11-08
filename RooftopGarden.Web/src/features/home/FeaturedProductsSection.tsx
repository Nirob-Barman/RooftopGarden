import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../catalog/productsApi";
import { ProductCard } from "../catalog/components/ProductCard";

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-48 animate-pulse bg-gray-100 dark:bg-gray-800" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function FeaturedProductsSection() {
  const { data: products, isLoading } = useGetProductsQuery({
    pageSize: 4,
  });

  return (
    <section className="bg-[#f7faf5] px-5 py-16 dark:bg-gray-950 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700 dark:text-green-400">
              Handpicked For You
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
              Discover quality plants, gardening essentials, and everything you
              need to create your own green paradise.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-green-700 px-5 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-700 hover:text-white dark:border-green-500 dark:text-green-400 dark:hover:bg-green-700 dark:hover:text-white"
          >
            View All Products
            <span>→</span>
          </Link>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : products?.items.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {products.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="text-4xl">🪴</div>

            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              No Featured Products Yet
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              New gardening products will appear here soon.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Bottom Link */}
        {!isLoading && products?.items.length ? (
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="text-sm font-semibold text-green-700 hover:text-green-900 dark:text-green-400"
            >
              Explore our complete collection →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
