export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-light',
  secondary: 'bg-secondary text-white hover:opacity-90',
  outline: 'border border-foreground/20 text-foreground hover:border-primary hover:text-primary',
  ghost: 'text-foreground hover:bg-foreground/5',
  danger: 'bg-error text-white hover:opacity-90',
}

export const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export const buttonBaseClasses =
  'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors duration-150'
