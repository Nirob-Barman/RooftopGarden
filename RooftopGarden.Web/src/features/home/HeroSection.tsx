import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="bg-primary px-6 py-20 text-center text-white">
      <h1 className="mx-auto max-w-2xl text-4xl font-semibold">Turn Your Rooftop Into a Living Garden</h1>
      <p className="mx-auto mt-4 max-w-xl text-white/80">
        Discover plants, gardening essentials, and professional rooftop gardening services designed for modern urban
        living.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/products" className="rounded-full bg-white px-5 py-2 font-medium text-primary">
          Explore Products
        </Link>
        <Link to="/services" className="rounded-full border border-white px-5 py-2 font-medium">
          Book a Gardening Service
        </Link>
      </div>
    </section>
  )
}
