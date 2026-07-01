'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Code2, Mail, Activity, Cpu, Database, Orbit, Boxes } from 'lucide-react'
import { portfolioData } from '@/data/portfolio'

const dashboardStats = [
  { label: 'Total API Requests', value: '14,592+', Icon: Activity },
  { label: 'Active Agents Running', value: '4', Icon: Cpu },
  { label: 'RAG Queries Processed', value: '2,104', Icon: Database },
  { label: 'Models in Production', value: '6', Icon: Orbit },
]

const runningProjects = [
  { name: 'Multi-Agent Orchestrator', status: 'online' as const },
  { name: 'Enterprise RAG Pipeline', status: 'online' as const },
  { name: 'MCP Server Framework', status: 'online' as const },
]

export default function HeroSection() {
  const [imgError, setImgError] = useState(false)

  return (
    <section className="relative flex min-h-screen flex-col pt-24 lg:flex-row lg:items-center lg:gap-6 xl:gap-10">
      <div className="flex flex-1 items-center justify-center px-6 pb-8 lg:pb-0 lg:pl-16">
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
            className="mt-8 flex flex-col sm:flex-row items-start gap-6"
          >
            <div className="shrink-0 group relative overflow-hidden rounded-2xl border border-white/16 bg-white/10 shadow-xl shadow-purple-950/25 transition-shadow duration-300 hover:shadow-purple-950/50 w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-600/10 z-10" />
              {imgError ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-violet-800 text-2xl font-black text-white">
                  {portfolioData.personal.name.split(' ').map((p) => p[0]).join('')}
                </div>
              ) : (
                <Image
                  src="/images/profilePic.jpg"
                  alt={portfolioData.personal.name}
                  width={460}
                  height={460}
                  priority
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
                {portfolioData.personal.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                {portfolioData.personal.description}
              </p>
            </div>
          </motion.div>

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
              <ArrowRight className="h-4 w-4" />
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

      <div className="flex flex-1 items-center justify-center px-6 pb-20 lg:pb-0 lg:pr-16">
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
                  <div className="flex items-center gap-2 mb-1">
                    <stat.Icon className="h-4 w-4 text-purple-300 shrink-0" />
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="mt-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Boxes className="h-4 w-4 text-purple-300" />
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Running Projects</p>
              </div>
              <div className="space-y-3">
                {runningProjects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"
                  >
                    <span className="text-sm text-white/80">{project.name}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      {project.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.85 }}
              className="mt-4 rounded-xl border border-white/10 bg-white/[0.06] p-4"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">System Online</p>
                  <p className="text-xs text-white/50">All agents operating normally</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
