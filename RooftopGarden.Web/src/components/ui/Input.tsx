import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from './cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full rounded-control border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1',
          error
            ? 'border-error focus:border-error focus:ring-error'
            : 'border-foreground/20 focus:border-primary focus:ring-primary',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-sm text-error">{error}</p> : hint ? <p className="mt-1 text-sm text-foreground/50">{hint}</p> : null}
    </div>
  )
})
