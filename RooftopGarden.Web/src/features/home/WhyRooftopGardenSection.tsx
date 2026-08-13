const FEATURES = [
  { title: 'Quality Plants', text: 'Hand-selected, healthy plants sourced for rooftop conditions.' },
  { title: 'Expert Gardeners', text: 'Professional, experienced teams for every rooftop service.' },
  { title: 'Easy Online Booking', text: 'Book a gardening service in minutes, manage it anytime.' },
  { title: 'Sustainable Gardening', text: 'Eco-friendly products and practices, from soil to seed.' },
]

export function WhyRooftopGardenSection() {
  return (
    <section className="bg-surface p-6">
      <h2 className="mb-3 text-xl font-semibold">Why RooftopGarden</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-foreground/10 bg-background p-4">
            <h3 className="font-medium text-primary">{feature.title}</h3>
            <p className="mt-1 text-sm text-foreground/70">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
