import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 px-6 py-8 text-sm text-foreground/60">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-lg font-semibold text-primary">🌿 RooftopGarden</p>
          <p className="mt-1 max-w-xs">
            Plants, gardening essentials, and professional rooftop gardening services for modern urban living.
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="font-medium text-foreground">Shop</p>
            <Link to="/products" className="mt-1 block hover:text-primary">
              Products
            </Link>
            <Link to="/wishlist" className="mt-1 block hover:text-primary">
              Wishlist
            </Link>
          </div>
          <div>
            <p className="font-medium text-foreground">Services</p>
            <Link to="/services" className="mt-1 block hover:text-primary">
              Gardening Services
            </Link>
            <Link to="/bookings" className="mt-1 block hover:text-primary">
              My Bookings
            </Link>
          </div>
          <div>
            <p className="font-medium text-foreground">Company</p>
            <Link to="/blog" className="mt-1 block hover:text-primary">
              Blog
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-6 text-xs">© {new Date().getFullYear()} RooftopGarden. All rights reserved.</p>
    </footer>
  )
}
