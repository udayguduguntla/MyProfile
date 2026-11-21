'use client'

import { useEffect, useState } from 'react'
import type { PortfolioProject } from '@/data/projects'
import { projectCaseStudy } from '@/lib/project-presentation'

export default function ProjectGallery({ project }: { project: PortfolioProject }) {
  const gallery = projectCaseStudy(project).gallery
  const [open, setOpen] = useState<number | null>(null)
  const current = open === null ? undefined : gallery[open]

  useEffect(() => {
    if (open === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') setOpen((index) => index === null ? index : (index + 1) % gallery.length)
      if (event.key === 'ArrowLeft') setOpen((index) => index === null ? index : (index - 1 + gallery.length) % gallery.length)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [gallery.length, open])

  if (!gallery.length) return null

  return (
    <section className="mt-12">
      <h2 className="font-serif text-3xl sm:text-4xl">Gallery</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {gallery.map((item, index) => (
          <button key={`${item.src}-${index}`} type="button" onClick={() => setOpen(index)} className="overflow-hidden rounded-[1.4rem] border border-white/10 text-left">
            <img src={item.src} alt={item.alt} className="h-56 w-full object-cover" />
            {item.caption && <span className="block px-4 py-3 text-sm text-cream/75">{item.caption}</span>}
          </button>
        ))}
      </div>
      {current && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#140403]/90 p-4" role="dialog" aria-modal="true" aria-label={current.alt} onClick={() => setOpen(null)}>
          <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img src={current.src} alt={current.alt} className="max-h-[75vh] w-full rounded-2xl object-contain" />
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-cream">
              <p>{current.caption || current.alt}</p>
              <p>{open! + 1} of {gallery.length}</p>
              <button type="button" className="rounded-full bg-cream px-4 py-2 font-semibold text-ink" onClick={() => setOpen(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
