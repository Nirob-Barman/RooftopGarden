import { Link } from 'react-router-dom'
import { useGetCategoriesQuery } from '../catalog/categoriesApi'

export function CategoriesSection() {
  const { data: categories } = useGetCategoriesQuery()

  if (!categories || categories.length === 0) return null

  return (
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
  )
}
