import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '../catalog/productsApi'
import { ProductCard } from '../catalog/components/ProductCard'

export function FeaturedProductsSection() {
  const { data: products, isLoading } = useGetProductsQuery({ pageSize: 4 })

  return (
    <section className="bg-surface p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Featured Products</h2>
        <Link to="/products" className="text-sm text-primary underline">
          View all
        </Link>
      </div>
      {isLoading ? (
        <p className="text-sm text-foreground/60">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {products?.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
