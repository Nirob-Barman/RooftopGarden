import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery, type ProductFilterParams } from "./productsApi";
import { useGetCategoriesQuery } from "./categoriesApi";
import { ProductCard } from "./components/ProductCard";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useDebounce } from "../../hooks/useDebounce";

const PAGE_SIZE = 20;

export function ProductListPage() {
  usePageTitle("Products");

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") ?? "",
  );

  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    const nextSearch = debouncedSearch.trim();

    if (nextSearch === currentSearch) return;

    const next = new URLSearchParams(searchParams);

    if (nextSearch) {
      next.set("search", nextSearch);
    } else {
      next.delete("search");
    }

    next.delete("page");
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Keep search input synchronized with browser navigation.
  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  const filter: ProductFilterParams = {
    search: searchParams.get("search") || undefined,
    categoryId: searchParams.get("categoryId")
      ? Number(searchParams.get("categoryId"))
      : undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    inStockOnly: searchParams.get("inStockOnly") === "true",
    pageNumber: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading, isFetching, isError, refetch } =
    useGetProductsQuery(filter);

  const { data: categories } = useGetCategoriesQuery();

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  const currentPage = filter.pageNumber ?? 1;

  const hasActiveFilters = Boolean(
    filter.search ||
    filter.categoryId ||
    filter.minPrice !== undefined ||
    filter.maxPrice !== undefined ||
    filter.inStockOnly,
  );

  return (
    <div className="min-h-full space-y-7 p-5 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            GREEN LIVING COLLECTION
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Discover Our Products
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/60">
            Explore plants, gardening essentials, and everything you need to
            create your own beautiful green space.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-foreground/50">
          <span className="text-xl">🌿</span>
          <span>Grow something beautiful</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="search"
          placeholder="Search plants, pots, gardening tools..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-2xl border border-foreground/10 bg-surface py-4 pl-12 pr-4 text-sm shadow-sm outline-none transition focus:border-primary"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <p className="text-sm font-medium">
          {data?.totalCount ?? 0} products found
        </p>

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl border border-foreground/15 px-4 py-2 text-sm font-medium transition hover:bg-primary/5"
        >
          <span>☷</span>
          Filters
          <span>{showFilters ? "−" : "+"}</span>
        </button>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Filters Sidebar */}
        <aside
          className={`${showFilters ? "block" : "hidden"} rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm lg:sticky lg:top-6 lg:block`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Filters</h2>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold">Categories</h3>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground/70">
                <input
                  type="radio"
                  name="category"
                  checked={!filter.categoryId}
                  onChange={() => updateParam("categoryId", "")}
                  className="accent-primary"
                />
                All Categories
              </label>

              {categories?.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3 text-sm text-foreground/70"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={filter.categoryId === category.id}
                    onChange={() =>
                      updateParam("categoryId", String(category.id))
                    }
                    className="accent-primary"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <div className="my-6 border-t border-foreground/10" />

          {/* Price Range */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Price Range</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-foreground/50">
                  Minimum
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={filter.minPrice ?? ""}
                  onChange={(e) => updateParam("minPrice", e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-foreground/50">
                  Maximum
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={filter.maxPrice ?? ""}
                  onChange={(e) => updateParam("maxPrice", e.target.value)}
                  className="w-full rounded-xl border border-foreground/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="my-6 border-t border-foreground/10" />

          {/* Stock Filter */}
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">In Stock Only</p>
              <p className="mt-1 text-xs text-foreground/50">
                Show available products
              </p>
            </div>

            <input
              type="checkbox"
              checked={filter.inStockOnly}
              onChange={(e) =>
                updateParam("inStockOnly", e.target.checked ? "true" : "")
              }
              className="h-4 w-4 accent-primary"
            />
          </label>
        </aside>

        {/* Product Results */}
        <section className="min-w-0">
          {/* Results Header */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">All Products</h2>

              <p className="mt-1 text-xs text-foreground/50">
                {data?.totalCount ?? 0} products available
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-foreground/15 px-3 py-2 text-xs font-medium transition hover:bg-primary/5"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-foreground/10 bg-surface"
                >
                  <div className="aspect-[4/3] bg-foreground/10" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 rounded bg-foreground/10" />
                    <div className="h-3 w-1/2 rounded bg-foreground/10" />
                    <div className="h-5 w-1/3 rounded bg-foreground/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-foreground/10 bg-surface px-5 py-16 text-center">
              <div className="text-4xl">🌱</div>

              <h3 className="mt-4 font-semibold">Unable to load products</h3>

              <p className="mt-2 text-sm text-foreground/50">
                Something went wrong while retrieving products.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="rounded-2xl border border-foreground/10 bg-surface px-5 py-20 text-center">
              <div className="text-5xl">🪴</div>

              <h3 className="mt-4 text-lg font-semibold">No products found</h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-foreground/50">
                We couldn't find products matching your filters. Try changing
                your search or exploring other categories.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div
                className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${
                  isFetching ? "opacity-60" : ""
                }`}
              >
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-foreground/50">
                    Page{" "}
                    <span className="font-semibold text-foreground">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {totalPages}
                    </span>
                  </p>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1 || isFetching}
                      onClick={() => goToPage(currentPage - 1)}
                      className="rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-medium transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    <span className="rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary">
                      {currentPage}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages || isFetching}
                      onClick={() => goToPage(currentPage + 1)}
                      className="rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-medium transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
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
    </div>
  );
}
