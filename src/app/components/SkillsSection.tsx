'use client'

import { motion } from 'motion/react'
import { portfolioData } from '@/data/portfolio'

export default function SkillsSection() {
  return (
    <section id="skills" className="relative z-10 bg-[#3e463c] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Capabilities</p>
          <h2 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">Skills</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(portfolioData.skills).map(([group, skills], index) => (
            <motion.article
              key={group}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.04 }}
              className="rounded-3xl border border-cream/15 bg-white/[0.05] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cream/35 hover:shadow-[0_18px_50px_rgba(232,210,181,0.08)]"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cream">{group}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-cream/10 bg-ink/40 px-3 py-1.5 text-xs text-sage">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
