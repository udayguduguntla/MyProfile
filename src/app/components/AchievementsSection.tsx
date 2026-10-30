import { portfolioData } from '@/data/portfolio'

export default function AchievementsSection() {
  const items = portfolioData.achievements.flatMap((group) => group.items.map((item) => ({ ...item, category: group.category })))

  return (
    <section id="achievements" className="relative z-10 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Credentials</p>
        <h2 className="mt-3 font-serif text-4xl text-cream">Competitions and certification</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-sage">{item.category} · {item.year}</p>
              <h3 className="mt-3 text-lg text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
