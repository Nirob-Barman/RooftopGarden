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
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <Link to="/" className="text-lg font-semibold">
          RooftopGarden
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/products">Products</Link>
          <Link to="/services">Services</Link>
          {user?.role === 'Customer' && (
            <>
              <Link to="/cart">Cart{cart && cart.items.length > 0 ? ` (${cart.items.length})` : ''}</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/payments">Payments</Link>
              <Link to="/wishlist">Wishlist</Link>
            </>
          )}
          {user?.role === 'Admin' && (
            <>
              <Link to="/admin/products">Admin: Products</Link>
              <Link to="/admin/categories">Admin: Categories</Link>
              <Link to="/admin/orders">Admin: Orders</Link>
              <Link to="/admin/payments">Admin: Payments</Link>
              <Link to="/admin/reviews">Admin: Reviews</Link>
            </>
          )}
          {user ? (
            <>
              <Link to="/profile">{user.fullName}</Link>
              <button type="button" onClick={() => revoke()} className="text-red-600">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
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
