import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useGetBlogsQuery, useDeleteBlogMutation } from "./blogApi";
import { useConfirmDialog } from "../../components/useConfirmDialog";
import { usePageTitle } from "../../hooks/usePageTitle";

const PAGE_SIZE = 20;

function excerpt(content: string, length = 160) {
  return content.length > length
    ? `${content.slice(0, length).trim()}...`
    : content;
}

export function BlogListPage() {
  usePageTitle("Blog");

  const isAdmin = useAppSelector((state) => state.auth.user?.role === "Admin");

  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError, refetch } = useGetBlogsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
  });

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const { confirm, dialog } = useConfirmDialog();

  const posts = data?.items ?? [];

  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE))
    : 1;

  const handleDelete = async (id: number, title: string) => {
    if (
      await confirm({
        title: "Delete article",
        message: `Delete "${title}"? This cannot be undone.`,
        destructive: true,
      })
    ) {
      await deleteBlog(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-green-700 dark:text-green-400">Blog</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Gardening Blog
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Share gardening knowledge, ideas, and inspiration with your
              community.
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/blog/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span className="text-lg">+</span>
              Write Article
            </Link>
          )}
        </div>

        {/* Blog Summary */}
        {!isLoading && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Articles
              </p>

              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data?.totalCount ?? 0}
                </h2>

                <div className="rounded-xl bg-green-100 p-3 text-xl text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ✎
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Page
              </p>

              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {pageNumber}
                  <span className="text-lg font-medium text-gray-400">
                    {" "}
                    / {totalPages}
                  </span>
                </h2>

                <div className="rounded-xl bg-blue-100 p-3 text-xl text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  ▤
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Directory */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                All Articles
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Explore the latest gardening articles and updates.
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {data?.totalCount ?? 0} articles
            </span>
          </div>

          <div className="p-5">
            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                  >
                    <div className="h-44 bg-gray-200 dark:bg-gray-800" />

                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              /* Error State */
              <div className="py-16 text-center">
                <div className="text-4xl">⚠</div>

                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                  Unable to load articles
                </h3>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Something went wrong while retrieving blog articles.
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  Try Again
                </button>
              </div>
            ) : posts.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  ✎
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  No articles yet
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                  Gardening articles and helpful tips will appear here.
                </p>

                {isAdmin && (
                  <Link
                    to="/blog/new"
                    className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                  >
                    Write Your First Article
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Blog Cards */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <article
                      key={post.id}
                      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-green-800"
                    >
                      {/* Image */}
                      <Link
                        to={`/blog/${post.id}`}
                        className="relative block overflow-hidden bg-gray-100 dark:bg-gray-800"
                      >
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-48 items-center justify-center text-5xl text-green-700 dark:text-green-400">
                            🌿
                          </div>
                        )}

                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm backdrop-blur dark:bg-gray-900/90 dark:text-green-400">
                          Gardening
                        </span>
                      </Link>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>✎</span>
                          <time dateTime={post.createdAt}>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </time>
                        </div>

                        <Link
                          to={`/blog/${post.id}`}
                          className="mt-3 line-clamp-2 text-lg font-bold text-gray-900 transition hover:text-green-700 dark:text-white dark:hover:text-green-400"
                        >
                          {post.title}
                        </Link>

                        <p className="mt-2 flex-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                          {excerpt(post.content)}
                        </p>

                        <Link
                          to={`/blog/${post.id}`}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:gap-3 dark:text-green-400"
                        >
                          Read Article
                          <span>→</span>
                        </Link>

                        {/* Admin Actions */}
                        {isAdmin && (
                          <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                            <Link
                              to={`/blog/${post.id}/edit`}
                              className="flex-1 rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-semibold text-green-700 transition hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDelete(post.id, post.title)}
                              className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Page{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {pageNumber}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {totalPages}
                      </span>
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber((p) => p - 1)}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        ← Previous
                      </button>

                      <button
                        type="button"
                        disabled={pageNumber >= totalPages}
                        onClick={() => setPageNumber((p) => p + 1)}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {dialog}
    </div>
  );
}
