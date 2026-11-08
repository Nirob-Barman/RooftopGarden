import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f3f8f1] dark:bg-gray-950">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl dark:bg-green-900/20" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Left Content */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-green-800 dark:border-green-900 dark:bg-gray-900 dark:text-green-400">
            <span>🌱</span>
            Grow Green. Live Better.
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Turn Your Rooftop Into a{" "}
            <span className="text-green-700 dark:text-green-400">
              Living Garden
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 dark:text-gray-400 sm:text-lg">
            Discover beautiful plants, gardening essentials, and professional
            rooftop gardening services designed to bring nature closer to your
            everyday life.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-700/20 transition hover:-translate-y-1 hover:bg-green-800"
            >
              Explore Products
              <span>→</span>
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-xl border border-green-700 bg-white px-7 py-3.5 text-sm font-semibold text-green-800 transition hover:-translate-y-1 hover:bg-green-50 dark:border-green-600 dark:bg-gray-900 dark:text-green-400 dark:hover:bg-gray-800"
            >
              Book a Gardening Service
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-green-200 pt-6 dark:border-gray-800">
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                🌿
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Fresh Plants
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                🪴
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Quality Products
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                🌳
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Expert Services
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border-2 border-green-200 dark:border-green-900" />

          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-green-900/15">
            <img
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85"
              alt="Beautiful green garden with plants"
              className="h-[340px] w-full object-cover sm:h-[430px] lg:h-[500px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-lg backdrop-blur-md dark:bg-gray-900/90">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Bring Nature Home 🌱
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Make every rooftop a greener place to live.
              </p>
            </div>
          </div>

          {/* Floating Decoration */}
          <div className="absolute -left-5 top-12 hidden rounded-2xl border border-green-100 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:block">
            <span className="text-2xl">🌿</span>
            <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-white">
              Grow Naturally
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
