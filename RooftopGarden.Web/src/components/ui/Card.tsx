import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from './cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = 'md', interactive, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-card border border-foreground/10 bg-surface shadow-card',
        paddingClasses[padding],
        interactive && 'transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
