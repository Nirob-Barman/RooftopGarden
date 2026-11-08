import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { toggleTheme } from "../features/theme/themeSlice";
import { useRevokeMutation } from "../features/auth/authApi";
import { useGetCartQuery } from "../features/cart/cartApi";
import { Footer } from "../features/home/Footer";
import { cn } from "../components/ui/cn";

function navLinkClass(isActive: boolean) {
  return cn(
    "relative whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-foreground/65 hover:bg-foreground/5 hover:text-primary",
  );
}

interface NavLinksProps {
  user: { fullName: string; role: string } | null | undefined;
  cartCount: number;
  onRevoke: () => void;
  onNavigate?: () => void;
}

function NavLinks({ user, cartCount, onRevoke, onNavigate }: NavLinksProps) {
  return (
    <>
      <NavLink
        to="/products"
        className={({ isActive }) => navLinkClass(isActive)}
        onClick={onNavigate}
      >
        Products
      </NavLink>

      <NavLink
        to="/services"
        className={({ isActive }) => navLinkClass(isActive)}
        onClick={onNavigate}
      >
        Services
      </NavLink>

      <NavLink
        to="/blog"
        className={({ isActive }) => navLinkClass(isActive)}
        onClick={onNavigate}
      >
        Blog
      </NavLink>

      {user?.role === "Customer" && (
        <>
          <NavLink
            to="/cart"
            className={({ isActive }) => navLinkClass(isActive)}
            onClick={onNavigate}
          >
            Cart
            {cartCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) => navLinkClass(isActive)}
            onClick={onNavigate}
          >
            Orders
          </NavLink>

          <NavLink
            to="/payments"
            className={({ isActive }) => navLinkClass(isActive)}
            onClick={onNavigate}
          >
            Payments
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) => navLinkClass(isActive)}
            onClick={onNavigate}
          >
            Wishlist
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) => navLinkClass(isActive)}
            onClick={onNavigate}
          >
            Bookings
          </NavLink>
        </>
      )}

      {user?.role === "Admin" && (
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => navLinkClass(isActive)}
          onClick={onNavigate}
        >
          Admin Dashboard
        </NavLink>
      )}

      {user ? (
        <>
          <NavLink
            to="/profile"
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-foreground/5",
              )
            }
          >
            <span className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
              {user.fullName}
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() => {
              onRevoke();
              onNavigate?.();
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-error transition-colors hover:bg-error/10"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) => navLinkClass(isActive)}
            onClick={onNavigate}
          >
            Log in
          </NavLink>

          <Link
            to="/register"
            onClick={onNavigate}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-light hover:shadow-md"
          >
            Get Started
          </Link>
        </>
      )}
    </>
  );
}

export function RootLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [revoke] = useRevokeMutation();

  const { data: cart } = useGetCartQuery(undefined, {
    skip: user?.role !== "Customer",
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const isAdminSection = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-surface/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="group flex shrink-0 items-center gap-2"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl transition-transform group-hover:scale-105">
              🌿
            </span>

            <div>
              <span className="block text-lg font-bold tracking-tight text-primary">
                RooftopGarden
              </span>
              <span className="hidden text-[10px] font-medium tracking-widest text-foreground/40 sm:block">
                GROW YOUR GREEN SPACE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 xl:flex">
            <NavLinks
              user={user}
              cartCount={cart?.items.length ?? 0}
              onRevoke={() => revoke()}
            />
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 text-lg transition-colors hover:bg-foreground/5"
              aria-label="Toggle theme"
            >
              🌓
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 text-xl transition-colors hover:bg-foreground/5 xl:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="border-t border-foreground/10 bg-surface px-5 py-5 shadow-lg xl:hidden sm:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              <NavLinks
                user={user}
                cartCount={cart?.items.length ?? 0}
                onRevoke={() => revoke()}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </nav>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      {!isAdminSection && <Footer />}
    </div>
  );
}
