'use client'

import { useEffect, useState } from 'react'
import { fallbackArticles, type Article } from '@/data/articles'

function formatDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${parsed.getUTCDate()} ${months[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`
}

export default function LatestWriting({ compact = false }: { compact?: boolean }) {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles)

  useEffect(() => {
    let active = true
    fetch('/api/articles')
      .then((response) => response.json())
      .then((data: { articles?: Article[] }) => {
        if (active && data.articles?.length) setArticles(data.articles.slice(0, 3))
      })
      .catch(() => {
        if (active) setArticles(fallbackArticles)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="writing" className={compact ? '' : 'relative z-10 py-20'}>
      <div className={compact ? '' : 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Latest writing</p>
        <div className={`mt-4 grid gap-3 ${compact ? '' : 'sm:grid-cols-3'}`}>
          {articles.map((article) => (
            <a key={article.url} href={article.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-cream/40">
              <p className="text-xs text-sage">{formatDate(article.date)}</p>
              <h3 className="mt-2 text-base font-semibold leading-snug text-cream">{article.title}</h3>
              {!compact && <p className="mt-2 line-clamp-3 text-sm text-white/65">{article.excerpt}</p>}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
