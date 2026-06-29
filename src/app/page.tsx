'use client'

import HeroSection from './components/HeroSection'
import ModernNavigation from './components/ModernNavigation'
import InteractiveStarBackground from './components/InteractiveStarBackground'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <InteractiveStarBackground variant="default" />
      <ModernNavigation />
      <HeroSection />
    </div>
  )
}
