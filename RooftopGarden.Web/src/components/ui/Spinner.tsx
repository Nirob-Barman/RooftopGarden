import { cn } from './cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-block h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-primary', className)}
    />
  )
}
