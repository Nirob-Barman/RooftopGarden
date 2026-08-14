import { cn } from './cn'
import { statusTone, type StatusTone } from './statusTone'

const toneClasses: Record<StatusTone, string> = {
  neutral: 'bg-foreground/10 text-foreground/70',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  primary: 'bg-primary/10 text-primary',
}

export interface StatusPillProps {
  status: string
  tone?: StatusTone
  className?: string
}

export function StatusPill({ status, tone, className }: StatusPillProps) {
  const resolvedTone = tone ?? statusTone(status)
  return (
    <span className={cn('inline-block rounded-full px-3 py-1 text-sm font-medium', toneClasses[resolvedTone], className)}>
      {status}
    </span>
  )
}
