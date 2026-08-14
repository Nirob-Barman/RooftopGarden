import type { HTMLAttributes } from 'react'
import { cn } from './cn'

export type ContainerSize = 'sm' | 'md' | 'detail' | 'lg' | 'full'

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'mx-auto max-w-sm p-6',
  md: 'mx-auto max-w-lg p-6',
  detail: 'mx-auto max-w-2xl p-6',
  lg: 'mx-auto max-w-5xl p-6',
  full: 'p-6',
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
}

export function Container({ size = 'lg', className, children, ...props }: ContainerProps) {
  return (
    <div className={cn(sizeClasses[size], className)} {...props}>
      {children}
    </div>
  )
}
