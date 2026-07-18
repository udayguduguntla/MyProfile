'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar } from 'lucide-react'
import { portfolioData } from '@/data/portfolio'

const experience = portfolioData.experience

export default function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = experience[activeIndex]

  return (
    <section id="about" className="relative z-10 py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-white sm:text-5xl">About Me</h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            {portfolioData.personal.description}
          </p>
        </motion.div>

        <div className="grid gap-0 lg:grid-cols-12 lg:gap-10 items-start">
          {/* Company Tabs */}
          <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0" style={{ scrollbarWidth: 'none' }}>
            {experience.map((exp, i) => {
              const isActive = i === activeIndex
              return (
                <motion.button
                  key={i}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 250, damping: 22, delay: i * 0.06 }}
                  onClick={() => setActiveIndex(i)}
                  className={`shrink-0 w-40 lg:w-full text-left rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'border-purple-500/40 bg-purple-500/12 shadow-md shadow-purple-950/20'
                      : 'border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3 p-3 sm:p-4">
                    <div className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition-all ${
                      isActive
                        ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/30 to-violet-600/30 text-purple-200'
                        : 'border-white/10 bg-white/10 text-white/50'
                    }`}>
                      {exp.company[0]}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-purple-200' : 'text-white'}`}>
                        {exp.company}
                      </p>
                      <p className="text-[10px] text-white/40 truncate mt-0.5">{exp.period}</p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-8 mt-4 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl overflow-hidden"
              >
                {/* Top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-purple-500/60 via-violet-400/40 to-transparent" />

                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{active.title}</h3>
                      <p className="text-sm text-purple-300/80 mt-0.5">{active.company}</p>
                    </div>
                    {active.current && (
                      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/20">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-white/40 mb-5">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {active.period}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-white/60">
                    {active.description}
                  </p>

                  <div className="mt-5 pt-5 border-t border-white/10">
                    <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {active.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-xs font-medium text-white/60 transition hover:border-purple-500/20 hover:text-purple-200/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
