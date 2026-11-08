import { Link } from "react-router-dom";

export function CtaBannerSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-green-700 px-5 py-20 sm:px-8 lg:py-28">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-10 -top-14 h-60 w-60 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute right-[12%] top-12 hidden text-7xl opacity-10 lg:block">
        🌿
      </div>

      <div className="pointer-events-none absolute bottom-10 left-[12%] hidden text-6xl opacity-10 lg:block">
        🪴
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Label */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-green-100 backdrop-blur-sm">
          <span>🌱</span>
          Start Your Green Journey
        </div>

        {/* Heading */}
        <h2 className="mt-7 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Start Your
          <span className="block text-green-300">Rooftop Garden?</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-green-50/80 sm:text-base">
          Transform your unused rooftop into a beautiful green paradise.
          Discover quality plants, professional gardening services, and
          everything you need to grow your own urban garden.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-green-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-green-50 hover:shadow-xl sm:w-auto"
          >
            Get Started
            <span>→</span>
          </Link>

          <Link
            to="/services"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/20 sm:w-auto"
          >
            Explore Services
          </Link>
        </div>

        {/* Bottom Message */}
        <p className="mt-8 text-xs font-medium tracking-wide text-green-100/60">
          🌍 Growing greener spaces, one rooftop at a time.
        </p>
      </div>
    </section>
  );
}
