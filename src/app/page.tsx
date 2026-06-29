'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Bot,
  BrainCircuit,
  Code2,
  Database,
  ExternalLink,
  Layers3,
  ScanEye,
  Sparkles,
  Trophy,
} from 'lucide-react'
import HeroSection from './components/HeroSection'
import ModernNavigation from './components/ModernNavigation'
import InteractiveStarBackground from './components/InteractiveStarBackground'
import { portfolioData } from '@/data/portfolio'

type Project = (typeof portfolioData.projects)[number]

const projectMeta = {
  'AI/ML': { Icon: BrainCircuit, label: 'Agentic AI', tone: 'from-fuchsia-400/24 via-violet-400/14 to-cyan-300/10' },
  'Computer Vision': { Icon: ScanEye, label: 'Vision', tone: 'from-cyan-300/24 via-violet-400/14 to-purple-500/10' },
  'Machine Learning': { Icon: Sparkles, label: 'ML', tone: 'from-emerald-300/20 via-violet-400/14 to-fuchsia-400/10' },
  'Web Automation': { Icon: Bot, label: 'Automation', tone: 'from-amber-300/20 via-violet-400/14 to-cyan-300/10' },
} as const

const skillIcons = [BrainCircuit, Code2, Database, Layers3]

const statItems = [
  { value: `${portfolioData.projects.length}+`, label: 'Projects', detail: 'Across AI and automation' },
  { value: '20+', label: 'Technologies', detail: 'Practical delivery stack' },
  { value: '2+', label: 'Years', detail: 'Building production code' },
  { value: '3', label: 'Major wins', detail: 'Competitions and rankings' },
]

export default function Home() {
  const featuredProjects = portfolioData.projects.filter((project) => project.featured).slice(0, 3)
  const skills = Object.entries(portfolioData.skills).slice(0, 4)
  const achievements = portfolioData.achievements.flatMap((group) => group.items).slice(0, 3)

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <InteractiveStarBackground variant="default" />
      <ModernNavigation />

      <main className="relative z-10">
        <HeroSection />

        <section className="pb-20">
          <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45 }}
              className="grid gap-4 md:grid-cols-4"
            >
              {statItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/12 bg-white/[0.065] p-5 shadow-xl shadow-purple-950/10 backdrop-blur-xl">
                  <p className="text-3xl font-bold text-white">{item.value}</p>
                  <p className="mt-2 font-semibold text-purple-100">{item.label}</p>
                  <p className="mt-1 text-sm text-white/52">{item.detail}</p>
                </div>
              ))}
            </motion.div>

            <HomeSection
              eyebrow="Selected work"
              title="Featured projects with a stronger signal."
              description="A quick route into the same project experience you liked, with the strongest work surfaced first."
              actionHref="/projects"
              actionLabel="View all projects"
            >
              <div className="grid gap-4 lg:grid-cols-3">
                {featuredProjects.map((project, index) => (
                  <FeaturedProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </HomeSection>

            <HomeSection
              eyebrow="Core expertise"
              title="The stack behind the systems."
              description="A cleaner overview of the tools and engineering areas that support the project work."
              actionHref="/about"
              actionLabel="About me"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {skills.map(([category, skillList], index) => {
                  const Icon = skillIcons[index % skillIcons.length]
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="rounded-2xl border border-white/12 bg-white/[0.065] p-5 shadow-xl shadow-purple-950/10 backdrop-blur-xl"
                    >
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-purple-100">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{category}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillList.slice(0, 6).map((skill) => (
                          <span key={skill} className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/72">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </HomeSection>

            <HomeSection
              eyebrow="Recognition"
              title="Recent achievements without the heavy card wall."
              description="Competition results and recognitions presented with the same lighter interface rhythm."
              actionHref="/achievements"
              actionLabel="All achievements"
            >
              <div className="grid gap-4 lg:grid-cols-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={`${achievement.title}-${achievement.year}`}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    className="rounded-2xl border border-white/12 bg-white/[0.065] p-5 shadow-xl shadow-purple-950/10 backdrop-blur-xl"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-purple-100">
                        {index === 0 ? <Award className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
                      </div>
                      <span className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/62">
                        {achievement.year}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/62">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </HomeSection>
          </div>
        </section>
      </main>
    </div>
  )
}

function HomeSection({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  actionHref: string
  actionLabel: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-white/10 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-200/70">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-7 text-white/64">{description}</p>
        </div>
        <Link href={actionHref} className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/14 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/18">
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
      {children}
    </section>
  )
}

function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const meta = projectMeta[project.category as keyof typeof projectMeta] ?? projectMeta['AI/ML']
  const Icon = meta.Icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.065] shadow-xl shadow-purple-950/10 backdrop-blur-xl"
    >
      <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${meta.tone}`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/16 bg-white/12 text-white shadow-xl backdrop-blur-xl">
          <Icon className="h-8 w-8" />
        </div>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs font-semibold text-purple-100">
            {meta.label}
          </span>
          <span className="text-xs text-white/45">{project.status === 'completed' ? 'Completed' : 'In progress'}</span>
        </div>
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/62">{project.description}</p>
        <div className="mt-5 flex gap-3">
          <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-purple-950">
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/projects/${project.id}/demo`} target="_blank" className="inline-flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-white/68 transition hover:text-white">
            Demo
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
