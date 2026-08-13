import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetAdminProductsQuery, useDeleteProductMutation } from '../productsApi'

const PAGE_SIZE = 20

export function AdminProductListPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading } = useGetAdminProductsQuery({ pageNumber, pageSize: PAGE_SIZE })
  const [deleteProduct] = useDeleteProductMutation()

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Deactivate "${name}"? It will no longer be visible to customers.`)) {
      deleteProduct(id)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage products</h1>
        <Link to="/admin/products/new" className="rounded bg-green-700 px-3 py-2 text-sm text-white">
          Create product
        </Link>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Active</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">{product.categoryName}</td>
                  <td className="py-2">${product.price.toFixed(2)}</td>
                  <td className="py-2">{product.stockQuantity}</td>
                  <td className="py-2">{product.isActive ? 'Yes' : 'No'}</td>
                  <td className="py-2 text-right">
                    <Link to={`/admin/products/${product.id}/edit`} className="mr-3 text-green-700 underline">
                      Edit
                    </Link>
                    {product.isActive && (
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => p - 1)}
                className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {pageNumber} of {totalPages}
              </span>
              <button
                type="button"
                disabled={pageNumber >= totalPages}
                onClick={() => setPageNumber((p) => p + 1)}
                className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
