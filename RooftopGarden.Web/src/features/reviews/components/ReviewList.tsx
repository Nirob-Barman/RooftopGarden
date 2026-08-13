import { useAppSelector } from '../../../app/hooks'
import { useGetReviewsQuery, useDeleteReviewMutation } from '../reviewsApi'
import { ReviewForm } from './ReviewForm'

export function ReviewList({ productId }: { productId: number }) {
  const user = useAppSelector((state) => state.auth.user)
  const { data, isLoading } = useGetReviewsQuery({ productId, pageSize: 50 })
  const [deleteReview] = useDeleteReviewMutation()

  if (isLoading) return <p className="text-sm text-gray-500">Loading reviews...</p>

  const myReview = data?.items.find((r) => r.customerId === user?.id)
  const otherReviews = data?.items.filter((r) => r.customerId !== user?.id) ?? []

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-semibold">Reviews</h2>

      {user?.role === 'Customer' && (
        <div className="mb-4">
          <ReviewForm productId={productId} existingReview={myReview} />
          {myReview && (
            <button
              type="button"
              onClick={() => deleteReview(myReview.id)}
              className="mt-2 text-sm text-red-600"
            >
              Delete my review
            </button>
          )}
        </div>
      )}

      {!data || data.items.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {myReview && (
            <ReviewRow key={myReview.id} rating={myReview.rating} comment={myReview.comment} createdAt={myReview.createdAt} mine />
          )}
          {otherReviews.map((review) => (
            <ReviewRow key={review.id} rating={review.rating} comment={review.comment} createdAt={review.createdAt} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewRow({
  rating,
  comment,
  createdAt,
  mine,
}: {
  rating: number
  comment: string | null
  createdAt: string
  mine?: boolean
}) {
  return (
    <div className="py-3">
      <div className="flex items-center gap-2">
        <span aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
        <span className="text-sm text-gray-500">
          {mine ? 'You' : 'Verified customer'} · {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
      {comment && <p className="mt-1 text-sm">{comment}</p>}
    </div>
  )
}
