'use client'

import Link from 'next/link'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ProjectsSection from '../components/ProjectsSection'
import SkillsSection from '../components/SkillsSection'
import LeadershipSection from '../components/LeadershipSection'
import AchievementsSection from '../components/AchievementsSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import InteractiveStarBackground from '../components/InteractiveStarBackground'

const links = [
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['Contact', '#contact'],
] as const

export default function ResumePortfolioPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <InteractiveStarBackground variant="about" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#2a0d0b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="rounded-full bg-cream px-3 py-1.5 text-sm font-semibold text-ink">Chat</Link>
          <nav className="flex gap-1 overflow-x-auto text-sm text-cream/80">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full px-3 py-1.5 hover:bg-sage/15 hover:text-cream">{label}</a>
            ))}
          </nav>
        </div>
      </header>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <LeadershipSection />
      <AchievementsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
