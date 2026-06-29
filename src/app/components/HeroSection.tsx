'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Github,
  Linkedin,
  Mail,
  Radar,
  Sparkles,
  TerminalSquare,
} from 'lucide-react'
import { portfolioData } from '@/data/portfolio'

const roles = ['NLP Developer', 'Python Engineer', 'AI Agent Builder', 'RAG Systems Developer']

const signalCards = [
  { label: 'Current focus', value: 'Agent orchestration', Icon: BrainCircuit },
  { label: 'Core stack', value: 'Python, FastAPI, LangChain', Icon: TerminalSquare },
  { label: 'Strength', value: 'Production AI workflows', Icon: Radar },
]

export default function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="relative min-h-screen pt-28 sm:pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-purple-100 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
            Available for AI, NLP, and backend work
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
            Building intelligent systems that feel ready for the real world.
          </h1>

          <div className="mt-5 flex min-h-10 flex-wrap items-center gap-3 text-lg text-white/72 sm:text-2xl">
            <span>I work as a</span>
            <motion.span
              key={roles[currentRole]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-white/12 bg-white/[0.08] px-3 py-1 font-semibold text-purple-100"
            >
              {roles[currentRole]}
            </motion.span>
          </div>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            {portfolioData.personal.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-purple-950 shadow-lg shadow-purple-950/15 transition hover:translate-y-[-1px]"
            >
              View Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/10 px-6 py-3.5 font-semibold text-white transition hover:bg-white/18"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <SocialLink href={portfolioData.social.github} label="GitHub" Icon={Github} />
            <SocialLink href={portfolioData.social.linkedin} label="LinkedIn" Icon={Linkedin} />
            <SocialLink href={portfolioData.social.leetcode} label="LeetCode" Icon={Code2} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: 'easeOut' }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl border border-white/14 bg-white/[0.07] shadow-2xl shadow-purple-950/24 backdrop-blur-2xl">
            <div className="relative min-h-[520px] p-5 sm:p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/16 via-violet-400/10 to-cyan-300/12" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-100">Portfolio signal</p>
                    <p className="text-xs text-white/48">Live profile snapshot</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-purple-100" />
                </div>

                <div className="mt-8 flex justify-center">
                  <div className="relative h-64 w-64 overflow-hidden rounded-[2rem] border border-white/16 bg-white/10 p-3 shadow-2xl sm:h-72 sm:w-72">
                    <div className="h-full w-full overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-purple-100 to-purple-200">
                      {imgError ? (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-violet-800 text-5xl font-black text-white">
                          {portfolioData.personal.name.split(' ').map((part) => part[0]).join('')}
                        </div>
                      ) : (
                        <img
                          src="/images/profilePic.jpg"
                          alt={portfolioData.personal.name}
                          className="h-full w-full object-cover"
                          onError={() => setImgError(true)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3">
                  {signalCards.map((card, index) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.22 + index * 0.08 }}
                      className="flex items-center gap-4 rounded-2xl border border-white/12 bg-black/16 p-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-purple-100">
                        <card.Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">{card.label}</p>
                        <p className="mt-1 font-semibold text-white">{card.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SocialLink({ href, label, Icon }: { href: string; label: string; Icon: typeof Github }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.075] px-4 py-2.5 text-sm font-semibold text-white/72 transition hover:bg-white/12 hover:text-white"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  )
}
