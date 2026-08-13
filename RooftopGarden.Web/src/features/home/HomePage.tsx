import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '../catalog/productsApi'
import { ProductCard } from '../catalog/components/ProductCard'
import { useGetServicesQuery } from '../gardening-services/gardeningServicesApi'
import { useGetBlogsQuery } from '../blog/blogApi'
import { Footer } from './Footer'

function excerpt(content: string, length = 120) {
  return content.length > length ? `${content.slice(0, length)}...` : content
}

export function HomePage() {
  const { data: products, isLoading: isLoadingProducts } = useGetProductsQuery({ pageSize: 4 })
  const { data: services, isLoading: isLoadingServices } = useGetServicesQuery({ pageSize: 3 })
  const { data: posts, isLoading: isLoadingPosts } = useGetBlogsQuery({ pageSize: 3 })

  return (
    <div>
      <section className="bg-primary px-6 py-20 text-center text-white">
        <h1 className="mx-auto max-w-2xl text-4xl font-semibold">Turn Your Rooftop Into a Living Garden</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          Discover plants, gardening essentials, and professional rooftop gardening services designed for modern
          urban living.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/products" className="rounded-full bg-white px-5 py-2 font-medium text-primary">
            Explore Products
          </Link>
          <Link to="/services" className="rounded-full border border-white px-5 py-2 font-medium">
            Book a Gardening Service
          </Link>
        </div>
      </section>

      <section className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Products</h2>
          <Link to="/products" className="text-sm text-primary underline">
            View all
          </Link>
        </div>
        {isLoadingProducts ? (
          <p className="text-sm text-foreground/60">Loading...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {products?.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-surface p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Professional Rooftop Gardening Services</h2>
          <Link to="/services" className="text-sm text-primary underline">
            View all
          </Link>
        </div>
        {isLoadingServices ? (
          <p className="text-sm text-foreground/60">Loading...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {services?.items.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="block rounded-xl border border-foreground/10 bg-background p-4"
              >
                {service.imageUrl && (
                  <img src={service.imageUrl} alt={service.name} className="mb-2 h-32 w-full rounded-lg object-cover" />
                )}
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-foreground/60">{service.duration}</p>
                <p className="mt-1 font-semibold">From ${service.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">From the Blog</h2>
          <Link to="/blog" className="text-sm text-primary underline">
            View all
          </Link>
        </div>
        {isLoadingPosts ? (
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

      <Footer />
    </div>
  )
}
