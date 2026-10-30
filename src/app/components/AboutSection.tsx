'use client'

import { useState } from 'react'
import { portfolioData } from '@/data/portfolio'

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = portfolioData.experience[activeIndex]

  return (
    <section id="experience" className="relative z-10 bg-sage/[0.08] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Professional experience</p>
        <h2 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">Where the work happened</h2>
        <div className="mt-8 flex gap-3 overflow-x-auto">
          {portfolioData.experience.map((role, index) => (
            <button key={role.company} type="button" onClick={() => setActiveIndex(index)} className={`shrink-0 rounded-2xl border px-4 py-3 text-left ${index === activeIndex ? 'border-sage bg-sage/20 text-cream' : 'border-white/10 text-white/70'}`}>
              <span className="block text-sm font-semibold">{role.company}</span>
              <span className="text-xs">{role.period}</span>
            </button>
          ))}
        </div>
        <article className="mt-6 rounded-[2rem] border border-sage/25 bg-[#3e463c]/80 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-white">{active.title}</h3>
              <p className="mt-1 text-cream">{active.location}</p>
            </div>
            {active.current && <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink">Current</span>}
          </div>
          <p className="mt-5 max-w-3xl leading-relaxed text-white/75">{active.description}</p>
          <p className="mt-3 text-sm text-sage">{active.ownership}</p>
          <ul className="mt-6 space-y-3">
            {active.highlights.map((item) => (
              <li key={item} className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white/80">{item}</li>
            ))}
          </ul>
          {active.clientAssignment && (
            <div className="mt-6 rounded-3xl border border-cream/20 bg-cream/[0.06] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-sage">Client assignment · still at Webfosys</p>
              <h4 className="mt-2 text-xl text-cream">{active.clientAssignment.client}</h4>
              <p className="mt-1 text-sm text-white/60">{active.clientAssignment.period} · {active.clientAssignment.location}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{active.clientAssignment.summary}</p>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
