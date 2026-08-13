import { HeroSection } from './HeroSection'
import { CategoriesSection } from './CategoriesSection'
import { FeaturedProductsSection } from './FeaturedProductsSection'
import { ServicesSection } from './ServicesSection'
import { WhyRooftopGardenSection } from './WhyRooftopGardenSection'
import { TestimonialsSection } from './TestimonialsSection'
import { BlogPreviewSection } from './BlogPreviewSection'
import { CtaBannerSection } from './CtaBannerSection'
import { Footer } from './Footer'

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ServicesSection />
      <WhyRooftopGardenSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <CtaBannerSection />
      <Footer />
    </div>
  )
}
