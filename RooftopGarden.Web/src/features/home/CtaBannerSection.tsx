import { Link } from 'react-router-dom'

export function CtaBannerSection() {
  return (
    <section className="bg-primary px-6 py-12 text-center text-white">
      <h2 className="text-2xl font-semibold">Ready to start your rooftop garden?</h2>
      <p className="mt-2 text-white/80">Join RooftopGarden today and bring your rooftop to life.</p>
      <Link to="/register" className="mt-4 inline-block rounded-full bg-white px-5 py-2 font-medium text-primary">
        Get Started
      </Link>
    </section>
  )
}
