import type { HTMLAttributes } from 'react'
import { cn } from './cn'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-control bg-foreground/10', className)} {...props} />
}
