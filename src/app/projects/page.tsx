'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  ExternalLink,
  Github,
  ScanEye,
  Sparkles,
} from 'lucide-react'
import { portfolioData } from '@/data/portfolio'
import ModernNavigation from '../components/ModernNavigation'
import InteractiveStarBackground from '../components/InteractiveStarBackground'

const categories = ['all', 'AI/ML', 'Computer Vision', 'Machine Learning', 'Web Automation']

const categoryMeta = {
  'AI/ML': {
    Icon: BrainCircuit,
    tone: 'from-fuchsia-400/25 via-violet-400/15 to-cyan-300/10',
    label: 'Agentic systems',
  },
  'Computer Vision': {
    Icon: ScanEye,
    tone: 'from-cyan-300/25 via-violet-400/15 to-purple-500/10',
    label: 'Vision pipelines',
  },
  'Machine Learning': {
    Icon: Sparkles,
    tone: 'from-emerald-300/20 via-violet-400/15 to-fuchsia-400/10',
    label: 'Applied models',
  },
  'Web Automation': {
    Icon: Bot,
    tone: 'from-amber-300/20 via-violet-400/15 to-cyan-300/10',
    label: 'Automation systems',
  },
} as const

type Project = (typeof portfolioData.projects)[number]

function getProjectMeta(project: Project) {
  return categoryMeta[project.category as keyof typeof categoryMeta] ?? categoryMeta['AI/ML']
}

function getDemoHref(project: Project) {
  return `/projects/${project.id}/demo`
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProjects = useMemo(
    () =>
      selectedCategory === 'all'
        ? portfolioData.projects
        : portfolioData.projects.filter((project) => project.category === selectedCategory),
    [selectedCategory]
  )

  const featuredProject = filteredProjects.find((project) => project.featured) ?? filteredProjects[0]
  const supportingProjects = filteredProjects.filter((project) => project.id !== featuredProject?.id)

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      <InteractiveStarBackground variant="projects" />
      <ModernNavigation />

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mb-10 sm:mb-14"
          >
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-purple-100 backdrop-blur-xl">
                <Activity className="h-4 w-4" />
                Selected work across AI, vision, and automation
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                Projects built for real use, not just screenshots.
              </h1>
              <p className="mt-5 max-w-3xl text-base sm:text-lg text-white/76 leading-8">
                A focused collection of production-minded systems, ML experiments, and practical tools with clearer paths to code and demos.
              </p>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mb-10 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-xl sm:flex-wrap sm:overflow-visible"
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-white text-purple-950 shadow-lg shadow-purple-950/20'
                      : 'text-white/72 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category === 'all' ? 'All Projects' : category}
                </button>
              )
            })}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.section
              key={selectedCategory}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
            >
              {featuredProject && <FeaturedProject project={featuredProject} />}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {supportingProjects.map((project, index) => (
                  <ProjectTile key={project.id} project={project} index={index} />
                ))}
              </div>
            </motion.section>
          </AnimatePresence>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
            className="mt-14 border-t border-white/10 pt-10 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">More work lives on GitHub</h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/70">
              Browse experiments, utilities, and source code that did not need a full portfolio case study.
            </p>
            <a
              href={portfolioData.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/18"
            >
              <Github className="h-5 w-5" />
              GitHub Profile
            </a>
          </motion.section>
        </div>
      </main>
    </div>
  )
}

function FeaturedProject({ project }: { project: Project }) {
  const { Icon, tone, label } = getProjectMeta(project)

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      className="overflow-hidden rounded-2xl border border-white/14 bg-white/[0.08] shadow-2xl shadow-purple-950/20 backdrop-blur-2xl"
    >
      <div className="grid min-h-[420px] lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`relative flex min-h-[260px] items-center justify-center bg-gradient-to-br ${tone}`}>
          <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
            Featured
          </div>
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/18 bg-white/12 text-white shadow-2xl backdrop-blur-xl"
          >
            <Icon className="h-16 w-16" />
          </motion.div>
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-purple-100">
                {label}
              </span>
              <span className="text-sm text-white/55">{project.status === 'completed' ? 'Completed' : 'In progress'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{project.title}</h2>
            <p className="mt-4 text-base leading-8 text-white/74">{project.description}</p>
          </div>

          <div className="mt-8">
            <TechList project={project} limit={6} />
            <ActionLinks project={project} />
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function ProjectTile({ project, index }: { project: Project; index: number }) {
  const { Icon, tone, label } = getProjectMeta(project)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-white/12 bg-white/[0.065] p-5 shadow-xl shadow-purple-950/10 backdrop-blur-xl transition-colors hover:bg-white/[0.09]"
    >
      <div className="flex gap-4">
        <div className={`hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white sm:flex`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-200/75">{label}</span>
            {project.featured && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">Featured</span>}
          </div>
          <h3 className="text-xl font-bold text-white transition group-hover:text-purple-100">{project.title}</h3>
          <p className="mt-3 text-sm leading-6 text-white/68">{project.description}</p>
          <TechList project={project} limit={4} compact />
          <ActionLinks project={project} compact />
        </div>
      </div>
    </motion.article>
  )
}

function TechList({ project, limit, compact = false }: { project: Project; limit: number; compact?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'mt-4' : 'mt-6'}`}>
      {project.technologies.slice(0, limit).map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/72"
        >
          {tech}
        </span>
      ))}
      {project.technologies.length > limit && (
        <span className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/60">
          +{project.technologies.length - limit}
        </span>
      )}
    </div>
  )
}

function ActionLinks({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-3 ${compact ? 'mt-5' : 'mt-8'}`}>
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/18"
      >
        <Github className="h-4 w-4" />
        Code
      </a>
      <a
        href={getDemoHref(project)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-purple-950 shadow-lg shadow-purple-950/15 transition hover:translate-y-[-1px]"
      >
        <ExternalLink className="h-4 w-4" />
        View Demo
      </a>
      <a
        href={`/projects/${project.id}`}
        className="inline-flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-white/72 transition hover:text-white"
      >
        Details
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}
