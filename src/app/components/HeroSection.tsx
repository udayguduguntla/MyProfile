'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Code2, Mail, Activity, Cpu, Database, Orbit } from 'lucide-react'
import { portfolioData } from '@/data/portfolio'

const dashboardStats = [
  { label: 'Total API Requests', value: '14,592+', Icon: Activity },
  { label: 'Active Agents Running', value: '4', Icon: Cpu },
  { label: 'RAG Queries Processed', value: '2,104', Icon: Database },
  { label: 'Models in Production', value: '6', Icon: Orbit },
]

export default function HeroSection() {
  const [imgError, setImgError] = useState(false)

  return (
    <section className="relative flex min-h-screen flex-col lg:flex-row lg:items-center">
      <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-24 lg:py-0 lg:pe-8 lg:ps-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full max-w-xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-purple-100 backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
            {portfolioData.personal.title}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            {portfolioData.personal.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-8"
          >
            <div className="group relative inline-block overflow-hidden rounded-xl border border-white/16 bg-white/10 shadow-2xl shadow-purple-950/30 transition-shadow duration-300 hover:shadow-purple-950/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-600/10" />
              {imgError ? (
                <div className="flex h-56 w-56 items-center justify-center bg-gradient-to-br from-purple-600 to-violet-800 text-4xl font-black text-white sm:h-64 sm:w-72">
                  {portfolioData.personal.name.split(' ').map((p) => p[0]).join('')}
                </div>
              ) : (
                <img
                  src="/images/profilePic.jpg"
                  alt={portfolioData.personal.name}
                  className="h-56 w-56 object-cover transition duration-500 group-hover:scale-105 sm:h-64 sm:w-72"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl"
          >
            {portfolioData.personal.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-purple-950 shadow-lg shadow-purple-950/15 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-purple-950/25"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/10 px-6 py-3 font-semibold text-white transition-all duration-200 hover:border-white/25 hover:bg-white/18 hover:translate-y-[-1px]"
            >
              <Mail className="h-4 w-4" />
              Contact
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.46 }}
            className="mt-6 flex gap-3"
          >
            <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/12 bg-white/[0.075] p-3 text-white/72 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 hover:text-white">
              <Github className="h-5 w-5" />
            </a>
            <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/12 bg-white/[0.075] p-3 text-white/72 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href={portfolioData.social.leetcode} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/12 bg-white/[0.075] p-3 text-white/72 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 hover:text-white">
              <Code2 className="h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 pb-16 lg:pb-0 lg:ps-8 lg:pe-16">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
          className="w-full max-w-xl"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-purple-950/20 backdrop-blur-2xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-purple-200">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Engine Room</p>
                <p className="text-xs text-white/50">Live system dashboard</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {dashboardStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.25 + i * 0.07 }}
                  className="rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-lg"
                >
                  <stat.Icon className="mb-3 h-4 w-4 text-purple-300" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] p-4"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">System Online</p>
                  <p className="text-xs text-white/50">Semantic Agent Orchestrator</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
