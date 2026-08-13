import { Link, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks'
import { toggleTheme } from '../features/theme/themeSlice'
import { useRevokeMutation } from '../features/auth/authApi'
import { useGetCartQuery } from '../features/cart/cartApi'
import { AdminNavDropdown } from './AdminNavDropdown'

export function RootLayout() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const [revoke] = useRevokeMutation()
  const { data: cart } = useGetCartQuery(undefined, { skip: user?.role !== 'Customer' })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between bg-surface px-6 py-4 shadow-sm">
        <Link to="/" className="text-lg font-semibold text-primary">
          🌿 RooftopGarden
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <Link to="/services" className="hover:text-primary">
            Services
          </Link>
          <Link to="/blog" className="hover:text-primary">
            Blog
          </Link>
          {user?.role === 'Customer' && (
            <>
              <Link to="/cart" className="hover:text-primary">
                Cart{cart && cart.items.length > 0 ? ` (${cart.items.length})` : ''}
              </Link>
              <Link to="/orders" className="hover:text-primary">
                Orders
              </Link>
              <Link to="/payments" className="hover:text-primary">
                Payments
              </Link>
              <Link to="/wishlist" className="hover:text-primary">
                Wishlist
              </Link>
              <Link to="/bookings" className="hover:text-primary">
                Bookings
              </Link>
            </>
          )}
          {user?.role === 'Admin' && <AdminNavDropdown />}
          {user ? (
            <>
              <Link to="/profile" className="hover:text-primary">
                {user.fullName}
              </Link>
              <button type="button" onClick={() => revoke()} className="text-error">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary">
                Log in
              </Link>
              <Link to="/register" className="rounded-full bg-primary px-3 py-1.5 text-white">
                Register
              </Link>
            </>
          )}
          <button type="button" onClick={() => dispatch(toggleTheme())} aria-label="Toggle theme">
            🌓
          </button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
