import { useParams, Link } from "react-router-dom";
import { useGetBlogByIdQuery } from "./blogApi";
import { usePageTitle } from "../../hooks/usePageTitle";

export function BlogPostPage() {
  usePageTitle("Blog Post");

  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useGetBlogByIdQuery(Number(id));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-6 p-5 sm:p-8">
        <div className="h-5 w-32 rounded bg-foreground/10" />
        <div className="h-10 w-3/4 rounded bg-foreground/10" />
        <div className="h-72 rounded-3xl bg-foreground/10" />
        <div className="space-y-3">
          <div className="h-4 rounded bg-foreground/10" />
          <div className="h-4 w-5/6 rounded bg-foreground/10" />
          <div className="h-4 w-4/6 rounded bg-foreground/10" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl">🌿</div>
          <h2 className="mt-4 text-2xl font-bold">Article Not Found</h2>
          <p className="mt-2 text-sm text-foreground/50">
            This article may have been removed or is no longer available.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Explore Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-5 py-8 sm:px-8 lg:py-12">
      {/* Article */}
      <article className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:opacity-70"
        >
          <span>←</span>
          Back to Gardening Blog
        </Link>

        {/* Article Header */}
        <header className="mb-8 mt-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            🌱 Gardening Journal
          </div>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-foreground/50">
            <span className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                🌿
              </span>
              RooftopGarden
            </span>

            <span>•</span>

            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>

            {post.updatedAt && (
              <>
                <span>•</span>
                <span>
                  Updated {new Date(post.updatedAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {post.imageUrl && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-sm">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="max-h-[520px] w-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="rounded-2xl border border-foreground/10 bg-surface p-5 shadow-sm sm:p-8 lg:p-10">
          <div className="whitespace-pre-wrap break-words text-sm leading-8 text-foreground/80 sm:text-base sm:leading-9">
            {post.content}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-primary/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Enjoyed this article?</h2>
            <p className="mt-1 text-sm text-foreground/50">
              Explore more tips and inspiration for your garden.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Explore More Articles →
          </Link>
        </div>
      </article>
    </div>
  );
}
