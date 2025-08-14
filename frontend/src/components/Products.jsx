import ParticlesBackground from './ParticlesBackground'
import ProductHero from './ProductHero'
import ProductFeatures from './ProductFeatures'
import StatsSection from './StatsSection'
import TestimonialsSection from './TestimonialsSection'
import CTASection from './CTASection'
import Footer from './Footer'

function Products() {

  return (
    <>
     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-x-hidden">
      {/* Background particles */}
      <ParticlesBackground />
      
      {/* Main content */}
      <div className="relative z-10">
        <ProductHero />
        <ProductFeatures />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
    </>
  )
}

export default Products
