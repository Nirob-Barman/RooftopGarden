import { useState } from 'react'
import { useGetReviewsQuery, useAdminDeleteReviewMutation } from '../reviewsApi'
import { useConfirmDialog } from '../../../components/useConfirmDialog'
import { usePageTitle } from '../../../hooks/usePageTitle'

const PAGE_SIZE = 20

export function AdminReviewListPage() {
  usePageTitle("Manage Reviews")
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading } = useGetReviewsQuery({ pageNumber, pageSize: PAGE_SIZE })
  const [adminDeleteReview] = useAdminDeleteReviewMutation()
  const { confirm, dialog } = useConfirmDialog()

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  const handleDelete = async (id: number) => {
    if (await confirm({ title: 'Delete review', message: 'Delete this review?', destructive: true })) {
      adminDeleteReview(id)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Moderate reviews</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.items.map((review) => (
              <div key={review.id} className="flex items-start justify-between py-3">
                <div>
                  <p>
                    <span aria-label={`${review.rating} out of 5 stars`}>
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>{' '}
                    <span className="text-sm text-gray-500">Product #{review.productId}</span>
                  </p>
                  {review.comment && <p className="mt-1 text-sm">{review.comment}</p>}
                  <p className="mt-1 text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <button type="button" onClick={() => handleDelete(review.id)} className="text-sm text-red-600">
                  Delete
                </button>
              </div>
            ))}
          </div>

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
        </>
      )}
      {dialog}
    </div>
  )
}
