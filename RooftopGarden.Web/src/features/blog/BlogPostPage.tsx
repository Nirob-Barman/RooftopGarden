import { useParams, Link } from 'react-router-dom'
import { useGetBlogByIdQuery } from './blogApi'

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading, error } = useGetBlogByIdQuery(Number(id))

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error || !post) return <div className="p-6">Article not found.</div>

  return (
    <article className="mx-auto max-w-2xl p-6">
      <Link to="/blog" className="text-sm text-primary underline">
        &larr; Back to blog
      </Link>
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="mt-4 w-full rounded-xl object-cover" />
      )}
      <h1 className="mt-4 text-3xl font-semibold">{post.title}</h1>
      <p className="mt-1 text-sm text-foreground/50">
        {new Date(post.createdAt).toLocaleDateString()}
        {post.updatedAt && ` · updated ${new Date(post.updatedAt).toLocaleDateString()}`}
      </p>
      <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</div>
    </article>
  )
}
