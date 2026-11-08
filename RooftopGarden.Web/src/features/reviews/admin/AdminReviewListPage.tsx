import { useState } from "react";
import {
  useGetReviewsQuery,
  useAdminDeleteReviewMutation,
} from "../reviewsApi";
import { useConfirmDialog } from "../../../components/useConfirmDialog";
import { Container, Button } from "../../../components/ui";
import { usePageTitle } from "../../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-foreground/10 bg-surface p-5"
        >
          <div className="flex justify-between">
            <div className="space-y-3">
              <div className="h-4 w-28 rounded bg-foreground/10" />
              <div className="h-3 w-36 rounded bg-foreground/10" />
            </div>
            <div className="h-8 w-16 rounded bg-foreground/10" />
          </div>
          <div className="mt-5 h-4 w-full rounded bg-foreground/10" />
          <div className="mt-2 h-4 w-2/3 rounded bg-foreground/10" />
        </div>
      ))}
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const safeRating = Math.min(5, Math.max(0, Math.floor(rating)));

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={
            index < safeRating ? "text-amber-500" : "text-foreground/20"
          }
        >
          ★
        </span>
      ))}
      <span className="ml-2 text-sm font-semibold text-foreground">
        {safeRating}.0
      </span>
    </div>
  );
}

export function AdminReviewListPage() {
  usePageTitle("Manage Reviews");

  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError, refetch } = useGetReviewsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const [adminDeleteReview] = useAdminDeleteReviewMutation();

  const { confirm, dialog } = useConfirmDialog();

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  const handleDelete = async (id: number) => {
    if (
      await confirm({
        title: "Delete review",
        message: "Are you sure you want to permanently delete this review?",
        destructive: true,
      })
    ) {
      adminDeleteReview(id);
    }
  };

  return (
    <Container size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-primary">
            CUSTOMER ENGAGEMENT
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Review Moderation
          </h1>

          <p className="mt-2 text-sm text-foreground/60">
            Monitor customer feedback and manage product reviews.
          </p>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm">
          <p className="text-sm text-foreground/60">Total customer reviews</p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {data?.totalCount ?? 0}
          </p>

          <p className="mt-1 text-xs text-foreground/50">
            Reviews across your product catalog
          </p>
        </div>

        {/* Reviews */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Customer Reviews</h2>

              <p className="mt-1 text-sm text-foreground/50">
                Page {pageNumber} of {totalPages}
              </p>
            </div>
          </div>

          {isLoading ? (
            <ReviewSkeleton />
          ) : isError ? (
            <div className="rounded-2xl border border-foreground/10 bg-surface p-10 text-center">
              <h3 className="font-semibold">Unable to load reviews</h3>

              <p className="mt-2 text-sm text-foreground/50">
                Please try again.
              </p>

              <Button size="sm" className="mt-4" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="rounded-2xl border border-foreground/10 bg-surface px-5 py-16 text-center">
              <div className="text-4xl">⭐</div>

              <h3 className="mt-4 font-semibold">No reviews yet</h3>

              <p className="mt-2 text-sm text-foreground/50">
                Customer reviews will appear here when they are submitted.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {data.items.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      {/* Review Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <RatingStars rating={review.rating} />

                          <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            Product #{review.productId}
                          </span>
                        </div>

                        {review.comment ? (
                          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/80">
                            {review.comment}
                          </p>
                        ) : (
                          <p className="mt-4 text-sm italic text-foreground/40">
                            No written comment provided.
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-foreground/50">
                          <span>Review #{review.id}</span>

                          <span aria-hidden="true">•</span>

                          <time dateTime={review.createdAt}>
                            {new Date(review.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </time>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center sm:justify-end">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                        >
                          Delete Review
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-foreground/10 bg-surface p-4">
                  <p className="text-sm text-foreground/60">
                    Page {pageNumber} of {totalPages}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pageNumber <= 1}
                      onClick={() => setPageNumber((page) => page - 1)}
                    >
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pageNumber >= totalPages}
                      onClick={() => setPageNumber((page) => page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {dialog}
    </Container>
  );
}
