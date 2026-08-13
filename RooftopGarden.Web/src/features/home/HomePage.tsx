import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '../catalog/productsApi'
import { ProductCard } from '../catalog/components/ProductCard'
import { useGetCategoriesQuery } from '../catalog/categoriesApi'
import { useGetServicesQuery } from '../gardening-services/gardeningServicesApi'
import { useGetBlogsQuery } from '../blog/blogApi'
import { useGetReviewsQuery } from '../reviews/reviewsApi'
import { Footer } from './Footer'

function excerpt(content: string, length = 120) {
  return content.length > length ? `${content.slice(0, length)}...` : content
}

const WHY_ROOFTOPGARDEN = [
  { title: 'Quality Plants', text: 'Hand-selected, healthy plants sourced for rooftop conditions.' },
  { title: 'Expert Gardeners', text: 'Professional, experienced teams for every rooftop service.' },
  { title: 'Easy Online Booking', text: 'Book a gardening service in minutes, manage it anytime.' },
  { title: 'Sustainable Gardening', text: 'Eco-friendly products and practices, from soil to seed.' },
]

export function HomePage() {
  const { data: categories } = useGetCategoriesQuery()
  const { data: products, isLoading: isLoadingProducts } = useGetProductsQuery({ pageSize: 4 })
  const { data: services, isLoading: isLoadingServices } = useGetServicesQuery({ pageSize: 3 })
  const { data: posts, isLoading: isLoadingPosts } = useGetBlogsQuery({ pageSize: 3 })
  const { data: reviews, isLoading: isLoadingReviews } = useGetReviewsQuery({ pageSize: 6 })

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

      {categories && categories.length > 0 && (
        <section className="p-6">
          <h2 className="mb-3 text-xl font-semibold">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className="rounded-xl border border-foreground/10 bg-surface p-4 text-center hover:border-primary"
              >
                <p className="font-medium">{category.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-surface p-6">
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

      <section className="p-6">
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
                className="block rounded-xl border border-foreground/10 bg-surface p-4"
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

      <section className="bg-surface p-6">
        <h2 className="mb-3 text-xl font-semibold">Why RooftopGarden</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {WHY_ROOFTOPGARDEN.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-foreground/10 bg-background p-4">
              <h3 className="font-medium text-primary">{feature.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {!isLoadingReviews && reviews && reviews.items.length > 0 && (
        <section className="p-6">
          <h2 className="mb-3 text-xl font-semibold">What Our Customers Say</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {reviews.items.slice(0, 6).map((review) => (
              <div key={review.id} className="rounded-xl border border-foreground/10 bg-surface p-4">
                <span aria-label={`${review.rating} out of 5 stars`}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
                {review.comment && <p className="mt-2 text-sm">{review.comment}</p>}
                <p className="mt-2 text-xs text-foreground/50">Verified customer</p>
              </div>
            ))}
          </div>
        </section>
      )}

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

      <section className="bg-primary px-6 py-12 text-center text-white">
        <h2 className="text-2xl font-semibold">Ready to start your rooftop garden?</h2>
        <p className="mt-2 text-white/80">Join RooftopGarden today and bring your rooftop to life.</p>
        <Link to="/register" className="mt-4 inline-block rounded-full bg-white px-5 py-2 font-medium text-primary">
          Get Started
        </Link>
      </section>

      <Footer />
    </div>
  )
}
