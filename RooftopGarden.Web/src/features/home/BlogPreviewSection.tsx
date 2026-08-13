import { Link } from 'react-router-dom'
import { useGetBlogsQuery } from '../blog/blogApi'

function excerpt(content: string, length = 120) {
  return content.length > length ? `${content.slice(0, length)}...` : content
}

export function BlogPreviewSection() {
  const { data: posts, isLoading } = useGetBlogsQuery({ pageSize: 3 })

  return (
    <section className="p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">From the Blog</h2>
        <Link to="/blog" className="text-sm text-primary underline">
          View all
        </Link>
      </div>
      {isLoading ? (
        <p className="text-sm text-foreground/60">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {posts?.items.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="block rounded-xl border border-foreground/10 bg-surface p-4"
            >
              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="mb-2 h-32 w-full rounded-lg object-cover" />
              )}
              <h3 className="font-medium">{post.title}</h3>
              <p className="mt-1 text-sm text-foreground/60">{excerpt(post.content)}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
