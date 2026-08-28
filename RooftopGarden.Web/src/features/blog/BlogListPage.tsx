import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { useGetBlogsQuery, useDeleteBlogMutation } from './blogApi'
import { useConfirmDialog } from '../../components/useConfirmDialog'
import { usePageTitle } from '../../hooks/usePageTitle'

const PAGE_SIZE = 20

function excerpt(content: string, length = 160) {
  return content.length > length ? `${content.slice(0, length)}...` : content
}

export function BlogListPage() {
  usePageTitle("Blog");
  const isAdmin = useAppSelector((state) => state.auth.user?.role === 'Admin')
  const [pageNumber, setPageNumber] = useState(1)
  const { data, isLoading } = useGetBlogsQuery({ pageNumber, pageSize: PAGE_SIZE })
  const [deleteBlog] = useDeleteBlogMutation()
  const { confirm, dialog } = useConfirmDialog()

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1

  const handleDelete = async (id: number, title: string) => {
    if (await confirm({ title: 'Delete article', message: `Delete "${title}"? This cannot be undone.`, destructive: true })) {
      deleteBlog(id)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gardening blog</h1>
        {isAdmin && (
          <Link to="/blog/new" className="rounded-full bg-primary px-3 py-2 text-sm text-white">
            Write article
          </Link>
        )}
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-foreground/60">No articles yet.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.items.map((post) => (
              <article key={post.id} className="rounded-xl border border-foreground/10 bg-surface p-4">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} className="mb-2 h-32 w-full rounded-lg object-cover" />
                )}
                <Link to={`/blog/${post.id}`} className="font-medium text-primary underline">
                  {post.title}
                </Link>
                <p className="mt-1 text-sm text-foreground/70">{excerpt(post.content)}</p>
                <p className="mt-2 text-xs text-foreground/50">{new Date(post.createdAt).toLocaleDateString()}</p>
                {isAdmin && (
                  <div className="mt-2 flex gap-3 text-sm">
                    <Link to={`/blog/${post.id}/edit`} className="text-primary underline">
                      Edit
                    </Link>
                    <button type="button" onClick={() => handleDelete(post.id, post.title)} className="text-error">
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber((p) => p - 1)}
                className="rounded border border-foreground/20 px-3 py-1 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {pageNumber} of {totalPages}
              </span>
              <button
                type="button"
                disabled={pageNumber >= totalPages}
                onClick={() => setPageNumber((p) => p + 1)}
                className="rounded border border-foreground/20 px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {dialog}
    </div>
  )
}
