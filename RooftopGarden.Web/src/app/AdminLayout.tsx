import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../components/ui/cn'

interface AdminNavItem {
  to: string
  label: string
}

interface AdminNavGroup {
  title: string
  items: AdminNavItem[]
}

// Same destinations the old AdminNavDropdown linked to, plus /services and
// /services/new (already-existing, already-guarded routes the dropdown never
// linked to) — grouped and reorganized for the sidebar, not new functionality.
const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  { title: 'Overview', items: [{ to: '/admin/dashboard', label: 'Dashboard' }] },
  {
    title: 'Catalog',
    items: [
      { to: '/admin/products', label: 'Products' },
      { to: '/admin/categories', label: 'Categories' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { to: '/admin/orders', label: 'Orders' },
      { to: '/admin/payments', label: 'Payments' },
    ],
  },
  {
    title: 'Engagement',
    items: [
      { to: '/admin/reviews', label: 'Reviews' },
      { to: '/admin/bookings', label: 'Bookings' },
      { to: '/admin/customers', label: 'Customers' },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/services', label: 'Services' },
      { to: '/services/new', label: 'Add service' },
      { to: '/blog', label: 'Blog' },
      { to: '/blog/new', label: 'Write article' },
    ],
  },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-6">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-foreground/40">{group.title}</p>
          <div className="mt-1 space-y-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'block rounded-control px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="lg:flex">
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="m-4 inline-flex items-center gap-2 rounded-control border border-foreground/20 px-3 py-1.5 text-sm lg:hidden"
      >
        <span aria-hidden="true">☰</span> Menu
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          role="presentation"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-foreground/10 bg-surface p-4 transition-transform duration-200',
          'lg:static lg:z-auto lg:w-64 lg:shrink-0 lg:translate-x-0 lg:p-6',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <p className="px-3 py-2 text-sm font-semibold text-foreground/50">Admin</p>
        <SidebarNav onNavigate={() => setIsSidebarOpen(false)} />
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
