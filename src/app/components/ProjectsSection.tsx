'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, X, ChevronRight } from 'lucide-react'
import { portfolioData } from '@/data/portfolio'

type Project = (typeof portfolioData.projects)[number]

const projects = portfolioData.projects

export default function ProjectsSection() {
  const [active, setActive] = useState<Project>(projects[0])
  const [selected, setSelected] = useState<Project | null>(null)
  const [showAll, setShowAll] = useState(false)

  const rightProjects = projects.filter((p) => p.id !== active.id).slice(0, 3)
  const remainingCount = projects.length - 1 - 3

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-purple-100 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
            My Work
          </p>
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Projects
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left — Active Project */}
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-8 group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={active.image}
                alt={active.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full border border-white/14 bg-black/50 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {active.category}
                </span>
                {active.status === 'in-progress' && (
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300 border border-amber-500/20">
                    WIP
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">{active.title}</h3>
              <p className="mt-1.5 text-base text-white/60 line-clamp-2 max-w-xl">{active.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {active.technologies.slice(0, 5).map((tech) => (
                  <span key={tech} className="rounded-md border border-white/14 bg-black/40 px-2.5 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelected(active)}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-4 py-2.5 text-sm font-semibold text-purple-950 transition hover:bg-white"
              >
                View Details
              </button>
            </div>
          </motion.div>

          {/* Right — 3 Projects */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {rightProjects.map((project, i) => {
              const isActive = project.id === active.id
              return (
                <motion.button
                  key={project.id}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                  onClick={() => setActive(project)}
                  className={`w-full text-left overflow-hidden rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'border-purple-500/40 bg-purple-500/12 shadow-md shadow-purple-950/20'
                      : 'border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex gap-4 p-4">
                    <div className="shrink-0 h-20 w-20 overflow-hidden rounded-xl border border-white/10">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 self-center">
                      <p className="text-sm font-bold text-white truncate">{project.title}</p>
                      <p className="mt-1 text-xs text-white/40 line-clamp-2 leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                </motion.button>
              )
            })}

            {/* View More */}
            {remainingCount > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: 0.2 }}
                onClick={() => setShowAll(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.03] py-4 text-sm font-medium text-white/40 transition hover:border-white/25 hover:text-white/70 hover:bg-white/[0.06]"
              >
                View {remainingCount} more project{remainingCount > 1 ? 's' : ''}
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* View More Modal */}
      <AnimatePresence>
        {showAll && (
          <AllProjectsModal
            projects={projects.filter((p) => p.id !== active.id).slice(3)}
            onSelect={(p) => { setActive(p); setShowAll(false) }}
            onClose={() => setShowAll(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

function AllProjectsModal({ projects, onSelect, onClose }: { projects: Project[]; onSelect: (p: Project) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl border border-white/20 bg-gray-900/95 p-6 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">All Projects</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              onClick={() => onSelect(project)}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-3 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              <div className="shrink-0 h-14 w-14 overflow-hidden rounded-lg border border-white/10">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1 self-center">
                <p className="text-xs font-bold text-white truncate">{project.title}</p>
                <p className="text-[10px] text-white/40 line-clamp-1 mt-0.5">{project.category}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-purple-500/20 to-violet-600/20">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          <button onClick={onClose} className="absolute right-3 top-3 rounded-lg border border-white/14 bg-black/50 p-1.5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-5">
            <h3 className="text-lg font-bold text-white">{project.title}</h3>
            <p className="text-xs text-white/60">{project.category}</p>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-white/70">{project.description}</p>
          <div>
            <p className="mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Technologies</p>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-md border border-white/10 bg-white/[0.07] px-2.5 py-1 text-xs font-medium text-white/70">{tech}</span>
              ))}
            </div>
          </div>
          {project.features && (
            <div>
              <p className="mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Key Features</p>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center gap-3 border-t border-white/10 pt-4">
            <a href={project.readmeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-purple-950 transition hover:bg-white/90">
              <ExternalLink className="h-3.5 w-3.5" />
              View README
            </a>
            {project.isPublic && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3.5 py-2 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white">
                <Github className="h-3.5 w-3.5" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
