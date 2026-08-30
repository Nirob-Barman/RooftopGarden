import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-6 text-6xl" aria-hidden="true">
          🌿
        </div>

        <h1 className="text-8xl font-bold tracking-tight text-primary sm:text-9xl">
          404
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-foreground sm:text-4xl">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-foreground/70">
          Looks like this garden path doesn't exist. The page you're looking for
          may have been moved or removed.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light"
        >
          🌱 Return Home
        </Link>
      </div>
    </section>
  );
}
