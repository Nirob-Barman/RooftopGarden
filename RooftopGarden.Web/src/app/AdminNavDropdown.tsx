import { Link } from 'react-router-dom'

const ADMIN_LINKS = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/blog/new', label: 'Write article' },
]

export function AdminNavDropdown() {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none hover:text-primary">Admin ▾</summary>
      <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-foreground/10 bg-surface py-1 shadow-md">
        {ADMIN_LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="block px-3 py-2 text-sm hover:bg-primary/10 hover:text-primary">
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  )
}
