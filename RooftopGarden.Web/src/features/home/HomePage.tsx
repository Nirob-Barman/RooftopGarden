import { HeroSection } from './HeroSection'
import { CategoriesSection } from './CategoriesSection'
import { FeaturedProductsSection } from './FeaturedProductsSection'
import { ServicesSection } from './ServicesSection'
import { WhyRooftopGardenSection } from './WhyRooftopGardenSection'
import { TestimonialsSection } from './TestimonialsSection'
import { BlogPreviewSection } from './BlogPreviewSection'
import { CtaBannerSection } from './CtaBannerSection'
import { LazySection } from '../../components/LazySection'
import { usePageTitle } from '../../hooks/usePageTitle'

export function HomePage() {
  usePageTitle("Home");
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <LazySection>
        <FeaturedProductsSection />
      </LazySection>
      <LazySection>
        <ServicesSection />
      </LazySection>
      <WhyRooftopGardenSection />
      <LazySection>
        <TestimonialsSection />
      </LazySection>
      <LazySection>
        <BlogPreviewSection />
      </LazySection>
      <CtaBannerSection />
    </div>
  )
}
