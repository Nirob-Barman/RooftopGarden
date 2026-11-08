import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#10291D] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🌿</span>
              <span className="text-xl font-bold tracking-tight">
                RooftopGarden
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-white/60">
              Bring nature closer to home. Discover beautiful plants, gardening
              essentials, and professional rooftop gardening services for modern
              urban living.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                { label: "Facebook", href: "https://facebook.com" },
                { label: "Instagram", href: "https://instagram.com" },
                { label: "YouTube", href: "https://youtube.com" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white/70 transition hover:border-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300"
                >
                  {social.label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white">Explore</h3>

            <div className="mt-5 space-y-3 text-sm text-white/60">
              <Link
                to="/products"
                className="block transition hover:text-emerald-300"
              >
                All Products
              </Link>
              <Link
                to="/categories"
                className="block transition hover:text-emerald-300"
              >
                Categories
              </Link>
              <Link
                to="/wishlist"
                className="block transition hover:text-emerald-300"
              >
                My Wishlist
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white">Services</h3>

            <div className="mt-5 space-y-3 text-sm text-white/60">
              <Link
                to="/services"
                className="block transition hover:text-emerald-300"
              >
                Gardening Services
              </Link>
              <Link
                to="/bookings"
                className="block transition hover:text-emerald-300"
              >
                My Bookings
              </Link>
              <Link
                to="/blog"
                className="block transition hover:text-emerald-300"
              >
                Gardening Blog
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white">Company</h3>

            <div className="mt-5 space-y-3 text-sm text-white/60">
              <Link to="/" className="block transition hover:text-emerald-300">
                About Us
              </Link>
              <Link
                to="/profile"
                className="block transition hover:text-emerald-300"
              >
                My Account
              </Link>
              <Link
                to="/contact"
                className="block transition hover:text-emerald-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Banner */}
        <div className="mt-14 flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="text-lg font-semibold">
              Grow something beautiful 🌱
            </h3>
            <p className="mt-2 text-sm text-white/50">
              Stay inspired with gardening tips and fresh ideas.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Explore Gardening Tips →
          </Link>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} RooftopGarden. All rights reserved.
          </p>

          <p>Made with 💚 for greener urban living.</p>
        </div>
      </div>
    </footer>
  );
}
