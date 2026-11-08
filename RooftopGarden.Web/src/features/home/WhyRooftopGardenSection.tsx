const FEATURES = [
  {
    icon: "🌿",
    title: "Quality Plants",
    text: "Hand-selected, healthy plants sourced for rooftop conditions.",
    number: "01",
  },
  {
    icon: "👨‍🌾",
    title: "Expert Gardeners",
    text: "Professional, experienced teams for every rooftop service.",
    number: "02",
  },
  {
    icon: "📅",
    title: "Easy Online Booking",
    text: "Book a gardening service in minutes and manage it anytime.",
    number: "03",
  },
  {
    icon: "🌍",
    title: "Sustainable Gardening",
    text: "Eco-friendly products and practices, from soil to seed.",
    number: "04",
  },
];

export function WhyRooftopGardenSection() {
  return (
    <section className="relative overflow-hidden bg-[#f3f8f1] px-5 py-16 dark:bg-gray-950 sm:px-8 lg:py-24">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-green-200/40 blur-3xl dark:bg-green-900/20" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-green-800 dark:border-green-900 dark:bg-gray-900 dark:text-green-400">
            <span>🌱</span>
            The RooftopGarden Difference
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Why Choose{" "}
            <span className="text-green-700 dark:text-green-400">
              RooftopGarden?
            </span>
          </h2>

          <p className="mt-5 text-sm leading-8 text-gray-600 dark:text-gray-400 sm:text-base">
            We make rooftop gardening simple, enjoyable, and sustainable.
            Everything you need to create your own beautiful green space is
            right here.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl hover:shadow-green-900/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-800"
            >
              {/* Feature Number */}
              <span className="absolute right-5 top-5 text-sm font-bold text-green-100 transition-colors group-hover:text-green-200 dark:text-gray-800 dark:group-hover:text-green-900">
                {feature.number}
              </span>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl transition duration-300 group-hover:scale-110 group-hover:bg-green-100 dark:bg-green-900/20 dark:group-hover:bg-green-900/40">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mt-6 text-lg font-bold text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                {feature.text}
              </p>

              {/* Bottom Accent */}
              <div className="mt-6 h-1 w-10 rounded-full bg-green-600 transition-all duration-300 group-hover:w-20" />
            </div>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            🌿 Growing greener spaces, one rooftop at a time.
          </p>
        </div>
      </div>
    </section>
  );
}
