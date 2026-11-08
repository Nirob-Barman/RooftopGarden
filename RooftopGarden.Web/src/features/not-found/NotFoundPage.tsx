import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-background px-5 py-16 sm:px-8">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl text-center">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
          <div className="absolute inset-0 rounded-full bg-primary/5" />
          <div className="absolute inset-4 rounded-full border border-dashed border-primary/20" />

          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-primary/10 text-7xl sm:h-44 sm:w-44 sm:text-8xl">
            🪴
          </div>

          <span className="absolute -right-1 top-6 animate-bounce text-3xl">
            🍃
          </span>

          <span className="absolute -bottom-1 left-2 text-3xl">🌱</span>

          <span className="absolute -left-4 top-12 text-2xl">✨</span>
        </div>

        {/* Error Code */}
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
          Oops! Something went wrong
        </p>

        <h1 className="mt-4 text-7xl font-extrabold tracking-tight text-primary sm:text-9xl">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
          Lost in the Garden?
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-foreground/60 sm:text-base">
          Looks like this garden path doesn't exist. The page you're searching
          for may have been moved, removed, or never planted.
        </p>

        {/* Actions */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition duration-300 hover:-translate-y-1 hover:opacity-90 sm:w-auto"
          >
            <span>🌱</span>
            Return Home
            <span>→</span>
          </Link>

          <Link
            to="/services"
            className="inline-flex w-full items-center justify-center rounded-xl border border-foreground/15 px-7 py-3.5 text-sm font-semibold text-foreground transition duration-300 hover:-translate-y-1 hover:bg-primary/5 sm:w-auto"
          >
            Explore Services
          </Link>
        </div>

        {/* Footer Message */}
        <p className="mt-10 text-xs font-medium tracking-wide text-foreground/40">
          Every great garden starts with a new path. 🌿
        </p>
      </div>
    </section>
  );
}
