'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Code2, Mail, Activity, Cpu, Database, Orbit, Boxes } from 'lucide-react'
import { portfolioData } from '@/data/portfolio'
import AnimatedCounter from './AnimatedCounter'
import Magnetic from './Magnetic'

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

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HeroSection() {
  const [imgError, setImgError] = useState(false)

  return (
    <section className="relative min-h-screen pt-8 sm:pt-12 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="w-full max-w-6xl"
      >
        <motion.div variants={cardVariants} className="text-center mb-6 sm:mb-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-purple-100 backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
            {portfolioData.personal.title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl"
          >
            {portfolioData.personal.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-3 text-base text-white/50 max-w-xl mx-auto"
          >
            {portfolioData.personal.tagline}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid gap-5 lg:grid-cols-12"
        >
          {/* Profile Card */}
          <motion.div variants={cardVariants} className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl h-full flex flex-col items-center text-center gap-4">
              <div className="group relative overflow-hidden rounded-2xl border border-white/16 bg-white/10 shadow-lg shadow-purple-950/25 w-24 h-24 sm:w-28 sm:h-28">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-600/10 z-10" />
                {imgError ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-violet-800 text-xl font-black text-white">
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
              <div>
                <p className="text-sm font-semibold text-white/90">{portfolioData.personal.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{portfolioData.personal.location}</p>
              </div>
              <div className="flex gap-2">
                <Magnetic>
                  <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/10 text-white/50 transition hover:bg-purple-500/20 hover:text-purple-200">
                    <Github className="h-3.5 w-3.5" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/10 text-white/50 transition hover:bg-purple-500/20 hover:text-purple-200">
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href={portfolioData.social.leetcode} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/10 text-white/50 transition hover:bg-purple-500/20 hover:text-purple-200">
                    <Code2 className="h-3.5 w-3.5" />
                  </a>
                </Magnetic>
              </div>
              <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
                {portfolioData.personal.description}
              </p>
            </div>
          </motion.div>

          {/* Dashboard Card */}
          <motion.div variants={cardVariants} className="lg:col-span-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 backdrop-blur-2xl h-full">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-purple-200">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Engine Room</p>
                  <p className="text-[10px] text-white/50">Live system dashboard</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-medium text-emerald-300">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {dashboardStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                    className="rounded-xl border border-white/10 bg-white/[0.06] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <stat.Icon className="h-3.5 w-3.5 text-purple-300 shrink-0" />
                      <AnimatedCounter value={stat.value} className="text-lg font-bold text-white" />
                    </div>
                    <p className="text-[11px] text-white/50">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }}
                className="mt-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Boxes className="h-3.5 w-3.5 text-purple-300" />
                  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Running Projects</p>
                </div>
                <div className="space-y-2">
                  {runningProjects.map((project, i) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.65 + i * 0.06 }}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.06] px-3.5 py-2.5"
                    >
                      <span className="text-xs text-white/80">{project.name}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
                transition={{ duration: 0.4, delay: 0.9 }}
                className="mt-3 rounded-lg border border-white/10 bg-white/[0.06] p-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-xs font-semibold text-white">System Online</p>
                  <p className="text-[10px] text-white/40 ml-auto">All agents operating</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div variants={cardVariants} className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl h-full flex flex-col gap-4">
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Quick Actions</p>

              <Magnetic>
                <Link
                  href="/#projects"
                  className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 font-semibold text-purple-950 shadow-lg shadow-purple-950/15 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">View Projects</p>
                    <p className="text-[10px] text-purple-600/60">Explore my work</p>
                  </div>
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  href="/#contact"
                  className="flex items-center gap-3 rounded-xl border border-white/14 bg-white/10 px-4 py-3.5 text-white transition-all duration-200 hover:border-white/25 hover:bg-white/18"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Mail className="h-4 w-4 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Contact Me</p>
                    <p className="text-[10px] text-white/40">Say hello</p>
                  </div>
                </Link>
              </Magnetic>

              <div className="mt-auto pt-2 border-t border-white/10">
                <p className="text-[10px] text-white/40 mb-2">Availability</p>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs text-emerald-300 font-medium">Open to opportunities</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
