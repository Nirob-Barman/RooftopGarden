import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../catalog/categoriesApi";

const categoryIcons = ["🌿", "🪴", "🌸", "🌱", "🌳", "🌵", "🌻", "🍃"];

export function CategoriesSection() {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  if (!isLoading && (!categories || categories.length === 0)) {
    return null;
  }

  return (
    <section className="bg-white px-5 py-16 dark:bg-gray-950 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700 dark:text-green-400">
              Explore Our Collection
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
              Find everything you need to create and maintain your own beautiful
              green space.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:gap-3 dark:text-green-400"
          >
            Explore Products <span>→</span>
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-900"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {categories!.slice(0, 8).map((category, index) => (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className="group relative overflow-hidden rounded-2xl border border-green-100 bg-[#f4f8f1] p-5 transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl hover:shadow-green-900/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-800 sm:p-7"
              >
                {/* Decorative Circle */}
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-green-200/40 transition duration-500 group-hover:scale-150 dark:bg-green-900/20" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm transition duration-300 group-hover:scale-110 dark:bg-gray-800">
                    {categoryIcons[index % categoryIcons.length]}
                  </div>

                  <h3 className="mt-6 text-base font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400 sm:text-lg">
                    {category.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-700 dark:text-green-400">
                    Explore Category
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
