import { Link } from "react-router-dom";
import { useGetBlogsQuery } from "../blog/blogApi";

function excerpt(content: string, length = 140) {
  return content.length > length
    ? `${content.slice(0, length).trim()}...`
    : content;
}

function BlogSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-52 animate-pulse bg-gray-100 dark:bg-gray-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function BlogPreviewSection() {
  const { data: posts, isLoading } = useGetBlogsQuery({
    pageSize: 3,
  });

  return (
    <section className="bg-white px-5 py-16 dark:bg-gray-950 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-green-700 dark:text-green-400">
              Garden Inspiration
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              From Our Gardening Blog
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-base">
              Explore gardening tips, creative ideas, and expert advice to help
              your rooftop garden flourish.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-green-700 px-5 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-700 hover:text-white dark:border-green-500 dark:text-green-400 dark:hover:bg-green-700 dark:hover:text-white"
          >
            Explore All Articles
            <span>→</span>
          </Link>
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </div>
        ) : posts?.items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.items.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-800"
              >
                {/* Cover Image */}
                <div className="relative h-56 overflow-hidden bg-green-50 dark:bg-gray-800">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-6xl">🌿</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-green-800 backdrop-blur-sm">
                    Gardening Journal
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-5">
                  <p className="text-xs font-medium text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-400">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                    {excerpt(post.content)}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Read Article
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700 transition group-hover:bg-green-700 group-hover:text-white dark:bg-green-900/30 dark:text-green-400">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="text-4xl">📚</div>

            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              No Articles Published Yet
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Stay tuned for gardening inspiration and helpful tips.
            </p>

            <Link
              to="/blog"
              className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Visit Our Blog
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoading && posts?.items.length ? (
          <div className="mt-10 text-center">
            <Link
              to="/blog"
              className="text-sm font-semibold text-green-700 transition hover:text-green-900 dark:text-green-400"
            >
              Discover more gardening ideas →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
