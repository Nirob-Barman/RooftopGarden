import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { toggleTheme } from '../features/theme/themeSlice'
import { useRevokeMutation } from '../features/auth/authApi'
import { useGetCartQuery } from '../features/cart/cartApi'
import { Footer } from '../features/home/Footer'
import { cn } from '../components/ui/cn'

function navLinkClass(isActive: boolean) {
  return cn('text-sm transition-colors', isActive ? 'font-semibold text-primary' : 'text-foreground/80 hover:text-primary')
}

interface NavLinksProps {
  user: { fullName: string; role: string } | null | undefined
  cartCount: number
  onRevoke: () => void
  onNavigate?: () => void
}

function NavLinks({ user, cartCount, onRevoke, onNavigate }: NavLinksProps) {
  return (
    <>
      <NavLink to="/products" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
        Products
      </NavLink>
      <NavLink to="/services" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
        Services
      </NavLink>
      <NavLink to="/blog" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
        Blog
      </NavLink>
      {user?.role === 'Customer' && (
        <>
          <NavLink to="/cart" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
            Cart
            {cartCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                {cartCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
            Orders
          </NavLink>
          <NavLink to="/payments" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
            Payments
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
            Wishlist
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
            Bookings
          </NavLink>
        </>
      )}
      {user?.role === 'Admin' && (
        <NavLink to="/admin/dashboard" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
          Admin
        </NavLink>
      )}
      {user ? (
        <>
          <NavLink to="/profile" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
            {user.fullName}
          </NavLink>
          <button
            type="button"
            onClick={() => {
              onRevoke()
              onNavigate?.()
            }}
            className="text-left text-sm text-error"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => navLinkClass(isActive)} onClick={onNavigate}>
            Log in
          </NavLink>
          <Link
            to="/register"
            onClick={onNavigate}
            className="w-fit rounded-full bg-primary px-3 py-1.5 text-sm text-white transition-colors hover:bg-primary-light"
          >
            Register
          </Link>
        </>
      )}
    </>
  )
}

export function RootLayout() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const [revoke] = useRevokeMutation()
  const { data: cart } = useGetCartQuery(undefined, { skip: user?.role !== 'Customer' })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isAdminSection = location.pathname.startsWith('/admin')

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-foreground/10 bg-surface/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-primary">
            🌿 RooftopGarden
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <NavLinks user={user} cartCount={cart?.items.length ?? 0} onRevoke={() => revoke()} />
            <button type="button" onClick={() => dispatch(toggleTheme())} aria-label="Toggle theme">
              🌓
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="rounded-control border border-foreground/20 px-3 py-1.5 text-sm md:hidden"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="flex flex-col gap-3 border-t border-foreground/10 px-6 py-4 md:hidden">
            <NavLinks
              user={user}
              cartCount={cart?.items.length ?? 0}
              onRevoke={() => revoke()}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="w-fit text-left text-sm"
              aria-label="Toggle theme"
            >
              🌓 Toggle theme
            </button>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {!isAdminSection && <Footer />}
    </div>
  )
}
