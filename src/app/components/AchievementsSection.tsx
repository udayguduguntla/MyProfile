'use client'

import { useCallback, useState } from 'react'
import { portfolioData } from '@/data/portfolio'
import CertificateViewer from './CertificateViewer'

export default function AchievementsSection() {
  const items = portfolioData.achievements.flatMap((group) => group.items.map((item) => ({ ...item, category: group.category })))
  const [certificate, setCertificate] = useState<{ src: string; title: string } | null>(null)
  const closeCertificate = useCallback(() => setCertificate(null), [])

  return (
    <section id="achievements" className="relative z-10 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Credentials</p>
        <h2 className="mt-3 font-serif text-4xl text-cream">Competitions and certification</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const certificateUrl = item.credentialUrl.endsWith('.pdf') ? item.credentialUrl : ''
            return (
              <article key={item.title} className={`rounded-3xl border p-5 text-left ${item.featured ? 'border-cream/30 bg-cream/10' : 'border-white/10 bg-white/[0.04]'}`}>
                <p className="text-xs uppercase tracking-[0.16em] text-sage">{item.category}{item.year ? ` · ${item.year}` : ''}</p>
                <h3 className="mt-3 text-lg text-white">{item.title}</h3>
                {item.result && <p className="mt-2 text-sm font-semibold text-cream">{item.result}</p>}
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-4">
                  {item.postUrl && (
                    <a href={item.postUrl} target="_blank" rel="noreferrer" className="text-sm text-cream underline decoration-cream/40 underline-offset-4">LinkedIn post</a>
                  )}
                  {certificateUrl && (
                    <button type="button" onClick={() => setCertificate({ src: certificateUrl, title: item.title })} className="text-sm text-cream underline decoration-cream/40 underline-offset-4">
                      View certificate
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
      {certificate && <CertificateViewer src={certificate.src} title={certificate.title} onClose={closeCertificate} />}
    </section>
  )
}
