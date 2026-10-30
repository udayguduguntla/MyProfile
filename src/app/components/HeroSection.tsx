'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { portfolioData } from '@/data/portfolio'

const specialties = ['Ontology', 'Semantic layers', 'LLM workflows', 'Python automation']

export default function HeroSection() {
  const [imgError, setImgError] = useState(false)
  const initials = portfolioData.personal.name.split(' ').map((part) => part[0]).join('')

  return (
    <section className="relative z-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-sage">AI Engineer</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-cream sm:text-6xl">{portfolioData.personal.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{portfolioData.personal.tagline}</p>
          <p className="mt-4 text-sm text-sage">{portfolioData.personal.role} at Worktual · {portfolioData.personal.location}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {specialties.map((item) => (
              <span key={item} className="rounded-full border border-sage/30 bg-sage/10 px-3 py-1.5 text-sm text-cream">{item}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#projects" className="rounded-full bg-burgundy px-5 py-3 text-sm font-semibold text-cream">View case studies</Link>
            <Link href="#contact" className="rounded-full border border-cream/30 px-5 py-3 text-sm font-semibold text-cream">Contact</Link>
            <a href={portfolioData.personal.resume} className="rounded-full bg-cream px-5 py-3 text-sm font-semibold text-ink">Resume PDF</a>
          </div>
        </div>
        <div className="rounded-[2rem] border border-cream/20 bg-cream/[0.07] p-6 backdrop-blur-xl">
          <div className="mx-auto h-36 w-36 overflow-hidden rounded-[1.5rem] border border-cream/20 bg-graphite">
            {imgError ? (
              <div className="flex h-full items-center justify-center font-serif text-3xl text-cream">{initials}</div>
            ) : (
              <Image src={portfolioData.personal.avatar} alt={portfolioData.personal.name} width={460} height={460} className="h-full w-full object-cover" priority onError={() => setImgError(true)} />
            )}
          </div>
          <p className="mt-5 text-center text-sm leading-relaxed text-white/70">{portfolioData.contact.availability}</p>
        </div>
      </div>
    </section>
  )
}
