import { useParams, Link } from 'react-router-dom'
import { useGetProductByIdQuery } from './productsApi'
import { AddToCartButton } from '../cart/components/AddToCartButton'
import { ReviewList } from '../reviews/components/ReviewList'
import { WishlistToggleButton } from '../wishlist/components/WishlistToggleButton'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, error } = useGetProductByIdQuery(Number(id))

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error || !product) return <div className="p-6">Product not found.</div>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link to="/products" className="text-sm text-green-700 underline">
        &larr; Back to products
      </Link>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="w-full rounded object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.categoryName}</p>
          <p className="mt-2 text-xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="mt-1 text-sm">
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </p>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Plant type</dt>
              <dd>{product.plantType}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Sunlight</dt>
              <dd>{product.sunlightRequirement}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Water</dt>
              <dd>{product.waterRequirement}</dd>
            </div>
          </dl>
          {product.description && <p className="mt-4 text-sm">{product.description}</p>}
          <div className="mt-4 flex items-center gap-4">
            <AddToCartButton productId={product.id} inStock={product.stockQuantity > 0} />
            <WishlistToggleButton productId={product.id} />
          </div>
        </div>
      </div>

      <ReviewList productId={product.id} />
    </div>
  )
}
