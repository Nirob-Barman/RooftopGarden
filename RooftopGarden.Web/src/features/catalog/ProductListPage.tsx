import { useSearchParams } from 'react-router-dom'
import { useGetProductsQuery, type ProductFilterParams } from './productsApi'
import { useGetCategoriesQuery } from './categoriesApi'
import { ProductCard } from './components/ProductCard'
import { usePageTitle } from '../../hooks/usePageTitle'

const PAGE_SIZE = 20

export function ProductListPage() {
  usePageTitle("Products");
  const [searchParams, setSearchParams] = useSearchParams()

  const filter: ProductFilterParams = {
    search: searchParams.get('search') || undefined,
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStockOnly: searchParams.get('inStockOnly') === 'true',
    pageNumber: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: PAGE_SIZE,
  }

  const { data, isLoading, isFetching } = useGetProductsQuery(filter)
  const { data: categories } = useGetCategoriesQuery()

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page') // any filter change resets pagination
    setSearchParams(next)
  }

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(page))
    setSearchParams(next)
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Products</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search products..."
          defaultValue={filter.search ?? ''}
          onChange={(e) => updateParam('search', e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        />
        <select
          value={filter.categoryId ?? ''}
          onChange={(e) => updateParam('categoryId', e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="">All categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min price"
          defaultValue={filter.minPrice ?? ''}
          onChange={(e) => updateParam('minPrice', e.target.value)}
          className="w-28 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        />
        <input
          type="number"
          placeholder="Max price"
          defaultValue={filter.maxPrice ?? ''}
          onChange={(e) => updateParam('maxPrice', e.target.value)}
          className="w-28 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filter.inStockOnly ?? false}
            onChange={(e) => updateParam('inStockOnly', e.target.checked ? 'true' : '')}
          />
          In stock only
        </label>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">No products match these filters.</p>
      ) : (
        <>
          <div className={`grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${isFetching ? 'opacity-60' : ''}`}>
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={(filter.pageNumber ?? 1) <= 1}
                onClick={() => goToPage((filter.pageNumber ?? 1) - 1)}
                className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {filter.pageNumber ?? 1} of {totalPages}
              </span>
              <button
                type="button"
                disabled={(filter.pageNumber ?? 1) >= totalPages}
                onClick={() => goToPage((filter.pageNumber ?? 1) + 1)}
                className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
