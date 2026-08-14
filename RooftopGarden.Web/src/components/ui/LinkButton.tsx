import { forwardRef } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from './cn'
import { buttonBaseClasses, buttonSizeClasses, buttonVariantClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

export interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  { variant = 'primary', size = 'md', fullWidth, className, children, ...props },
  ref,
) {
  return (
    <Link
      ref={ref}
      className={cn(buttonBaseClasses, buttonVariantClasses[variant], buttonSizeClasses[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </Link>
  )
})
