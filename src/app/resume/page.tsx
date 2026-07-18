'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import AchievementsSection from '../components/AchievementsSection'
import ProjectsSection from '../components/ProjectsSection'
import ContactSection from '../components/ContactSection'
import InteractiveStarBackground from '../components/InteractiveStarBackground'
import Footer from '../components/Footer'

export default function ResumePortfolioPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white shadow-2xl shadow-purple-950/20 backdrop-blur-2xl transition hover:bg-white/[0.14]"
        >
          <ArrowLeft className="h-4 w-4" />
          Chat
        </Link>
      </div>
      <InteractiveStarBackground variant="default" />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <AchievementsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
