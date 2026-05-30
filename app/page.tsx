import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { HowItWorks } from '@/components/how-it-works'
import { CategoriesGrid } from '@/components/categories-grid'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <CategoriesGrid />
      <Footer />
    </main>
  )
}
