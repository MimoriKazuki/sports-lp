import HeroSection from '@/components/HeroSection'
import OverviewSection from '@/components/OverviewSection'
import FeaturesSection from '@/components/FeaturesSection'
import GuidelinesSection from '@/components/GuidelinesSection'
import PrizeSection from '@/components/PrizeSection'
import CTASection from '@/components/CTASection'
import NotesSection from '@/components/NotesSection'
import Footer from '@/components/Footer'
import MobileMenu from '@/components/MobileMenu'
import CountdownTimer from '@/components/CountdownTimer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <MobileMenu />
      <CountdownTimer />
      <HeroSection />
      <div id="overview">
        <OverviewSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="guidelines">
        <GuidelinesSection />
      </div>
      <div id="prize">
        <PrizeSection />
      </div>
      <CTASection />
      <NotesSection />
      <Footer />
    </main>
  )
}