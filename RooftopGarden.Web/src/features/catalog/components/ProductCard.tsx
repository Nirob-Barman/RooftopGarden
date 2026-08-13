import { Link } from 'react-router-dom'
import type { ProductDto } from '../productsApi'

export function ProductCard({ product }: { product: ProductDto }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block rounded border border-gray-200 p-4 hover:border-green-600 dark:border-gray-700"
    >
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="mb-2 h-40 w-full rounded object-cover" />
      )}
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.categoryName}</p>
      <p className="mt-1 font-semibold">${product.price.toFixed(2)}</p>
      {product.stockQuantity === 0 && <p className="text-sm text-red-600">Out of stock</p>}
    </Link>
  )
}
