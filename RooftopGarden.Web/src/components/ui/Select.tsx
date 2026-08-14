import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { cn } from './cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, id, children, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full rounded-control border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1',
          error
            ? 'border-error focus:border-error focus:ring-error'
            : 'border-foreground/20 focus:border-primary focus:ring-primary',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="mt-1 text-sm text-error">{error}</p> : hint ? <p className="mt-1 text-sm text-foreground/50">{hint}</p> : null}
    </div>
  )
})
