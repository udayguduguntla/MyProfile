'use client'

import { useState } from 'react'
import Image from 'next/image'
import { hasPublicUrl, portfolioData, type Project } from '@/data/portfolio'

export default function ProjectsSection() {
  const projects = [...portfolioData.projects].sort((a, b) => Number(b.featured) - Number(a.featured))
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <section id="projects" className="relative z-10 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/70">Featured case studies</p>
        <h2 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">Systems with a job to do</h2>
        <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:overflow-visible">
          {projects.map((project) => (
            <button key={project.id} type="button" onClick={() => setSelected(project)} className="w-[84%] shrink-0 snap-center rounded-[1.8rem] border border-burgundy/40 bg-[#4a2420] p-4 text-left transition hover:-translate-y-1 hover:border-cream/40 sm:w-[46%] lg:w-auto">
              <Image src={project.image} alt="" width={640} height={360} unoptimized className="h-40 w-full rounded-2xl object-cover" />
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-burgundy px-2.5 py-1 text-cream">{project.context}</span>
                <span className="rounded-full bg-cream/10 px-2.5 py-1 capitalize text-cream">{project.status}</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">{project.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">{project.description}</p>
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2a0d0b]/70 p-4 sm:items-center" onClick={() => setSelected(null)}>
          <article className="max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-cream/20 bg-graphite p-6 text-white sm:p-8" onClick={(event) => event.stopPropagation()}>
            <p className="text-xs uppercase tracking-[0.18em] text-sage">{selected.context}{selected.employer ? ` · ${selected.employer}` : ''}</p>
            <h3 className="mt-2 text-3xl text-cream">{selected.title}</h3>
            <p className="mt-4 leading-relaxed text-white/75">{selected.problem}</p>
            <p className="mt-3 leading-relaxed text-white/75">{selected.contribution}</p>
            {selected.workflow.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {selected.workflow.map((step) => <span key={step} className="rounded-full border border-sage/30 px-3 py-1 text-xs text-sage">{step}</span>)}
              </div>
            )}
            <ul className="mt-5 space-y-2 text-sm text-white/75">
              {selected.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            {selected.safeguards && <p className="mt-5 rounded-2xl bg-sage/10 p-4 text-sm text-cream">{selected.safeguards}</p>}
            {selected.planned.length > 0 && <p className="mt-4 text-sm text-sage">Planned next: {selected.planned.join(', ')}.</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              {hasPublicUrl(selected.github) && <a className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink" href={selected.github} target="_blank" rel="noreferrer">GitHub</a>}
              {hasPublicUrl(selected.readmeUrl) && selected.readmeUrl !== selected.github && <a className="rounded-full border border-cream/30 px-4 py-2 text-sm" href={selected.readmeUrl} target="_blank" rel="noreferrer">Related repo</a>}
              {!hasPublicUrl(selected.github) && <p className="text-sm text-sage">Employer work is described here without publishing private code.</p>}
              <button type="button" className="rounded-full border border-white/15 px-4 py-2 text-sm" onClick={() => setSelected(null)}>Close</button>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}
