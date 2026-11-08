import { useGetReviewsQuery } from "../reviews/reviewsApi";

function ReviewSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="h-5 w-28 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      <div className="mt-5 h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      <div className="mt-8 h-3 w-32 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

export function TestimonialsSection() {
  const { data: reviews, isLoading } = useGetReviewsQuery({
    pageSize: 6,
  });

  if (!isLoading && (!reviews || reviews.items.length === 0)) {
    return null;
  }

  return (
    <section className="bg-[#f7faf5] px-5 py-16 dark:bg-gray-950 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700 dark:text-green-400">
            Customer Experiences
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
            Discover what our gardening community thinks about their experience
            with RooftopGarden.
          </p>
        </div>

        {/* Review Cards */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ReviewSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews!.items.slice(0, 6).map((review) => (
              <article
                key={review.id}
                className="group relative flex flex-col rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-800"
              >
                {/* Quote Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-serif leading-none text-green-200 dark:text-green-900">
                    “
                  </span>

                  <span
                    aria-label={`${review.rating} out of 5 stars`}
                    className="text-lg tracking-wider text-amber-500"
                  >
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                {/* Comment */}
                <div className="mt-5 flex-1">
                  {review.comment ? (
                    <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {review.comment}
                    </p>
                  ) : (
                    <p className="text-sm italic text-gray-400">
                      Customer rating provided.
                    </p>
                  )}
                </div>

                {/* Customer Information */}
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl dark:bg-green-900/30">
                    🌿
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Verified Customer
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      RooftopGarden Community
                    </p>
                  </div>

                  <div className="ml-auto text-green-600 dark:text-green-400">
                    ✓
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🌱 Thank you for helping us grow a greener community.
          </p>
        </div>
      </div>
    </section>
  );
}
