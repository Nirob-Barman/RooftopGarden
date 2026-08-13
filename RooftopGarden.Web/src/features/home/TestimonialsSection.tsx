import { useGetReviewsQuery } from '../reviews/reviewsApi'

export function TestimonialsSection() {
  const { data: reviews, isLoading } = useGetReviewsQuery({ pageSize: 6 })

  if (isLoading || !reviews || reviews.items.length === 0) return null

  return (
    <section className="p-6">
      <h2 className="mb-3 text-xl font-semibold">What Our Customers Say</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {reviews.items.slice(0, 6).map((review) => (
          <div key={review.id} className="rounded-xl border border-foreground/10 bg-surface p-4">
            <span aria-label={`${review.rating} out of 5 stars`}>
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </span>
            {review.comment && <p className="mt-2 text-sm">{review.comment}</p>}
            <p className="mt-2 text-xs text-foreground/50">Verified customer</p>
          </div>
        ))}
      </div>
    </section>
  )
}
