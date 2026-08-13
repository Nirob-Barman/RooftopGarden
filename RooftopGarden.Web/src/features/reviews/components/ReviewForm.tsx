import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateReviewMutation, useUpdateReviewMutation, type ReviewDto } from '../reviewsApi'

// rating kept as a string (what the <select> actually produces) to avoid the
// z.coerce input/output type mismatch with the RHF resolver (see AdminProductForm).
const reviewSchema = z.object({
  rating: z.enum(['1', '2', '3', '4', '5']),
  comment: z.string().max(2000).optional().or(z.literal('')),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

export function ReviewForm({ productId, existingReview }: { productId: number; existingReview?: ReviewDto }) {
  const [createReview, { isLoading: isCreating, error: createError }] = useCreateReviewMutation()
  const [updateReview, { isLoading: isUpdating, error: updateError }] = useUpdateReviewMutation()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: (existingReview ? String(existingReview.rating) : '5') as ReviewFormValues['rating'],
      comment: existingReview?.comment ?? '',
    },
  })

  const onSubmit = async (values: ReviewFormValues) => {
    const body = { rating: Number(values.rating), comment: values.comment || null }
    try {
      if (existingReview) {
        await updateReview({ id: existingReview.id, ...body }).unwrap()
      } else {
        await createReview({ productId, ...body }).unwrap()
      }
      setSubmitted(true)
    } catch {
      // surfaced via `createError`/`updateError` below
    }
  }

  const error = createError ?? updateError

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded border border-gray-200 p-4 dark:border-gray-700">
      <h3 className="text-sm font-medium">{existingReview ? 'Edit your review' : 'Write a review'}</h3>
      <div>
        <label className="block text-sm font-medium" htmlFor="rating">
          Rating
        </label>
        <select
          id="rating"
          className="mt-1 rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          {...register('rating')}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n !== 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="comment">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          {...register('comment')}
        />
        {errors.comment && <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>}
      </div>
      {error && (
        <p className="text-sm text-red-600">
          Could not save your review. You can only review products you've purchased, and only once per product.
        </p>
      )}
      {submitted && !error && <p className="text-sm text-green-700">Thanks for your review!</p>}
      <button
        type="submit"
        disabled={isCreating || isUpdating}
        className="rounded bg-green-700 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        {isCreating || isUpdating ? 'Saving...' : 'Save review'}
      </button>
    </form>
  )
}
