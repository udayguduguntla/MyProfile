'use client'

import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import AchievementsSection from './components/AchievementsSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import InteractiveStarBackground from './components/InteractiveStarBackground'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <InteractiveStarBackground variant="default" />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <AchievementsSection />
      <ContactSection />
    </div>
  )
}
