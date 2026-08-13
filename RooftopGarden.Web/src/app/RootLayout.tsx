import { Link, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks'
import { toggleTheme } from '../features/theme/themeSlice'
import { useRevokeMutation } from '../features/auth/authApi'
import { useGetCartQuery } from '../features/cart/cartApi'

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
          {user?.role === 'Admin' && (
            <>
              <Link to="/admin/products" className="hover:text-primary">
                Admin: Products
              </Link>
              <Link to="/admin/categories" className="hover:text-primary">
                Admin: Categories
              </Link>
              <Link to="/admin/orders" className="hover:text-primary">
                Admin: Orders
              </Link>
              <Link to="/admin/payments" className="hover:text-primary">
                Admin: Payments
              </Link>
              <Link to="/admin/reviews" className="hover:text-primary">
                Admin: Reviews
              </Link>
              <Link to="/admin/bookings" className="hover:text-primary">
                Admin: Bookings
              </Link>
            </>
          )}
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
