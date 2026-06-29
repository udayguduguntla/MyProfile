'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink, Github, X } from 'lucide-react'
import { portfolioData } from '@/data/portfolio'
import ModernNavigation from '../components/ModernNavigation'
import InteractiveStarBackground from '../components/InteractiveStarBackground'

type Project = (typeof portfolioData.projects)[number]

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      <InteractiveStarBackground variant="projects" />
      <ModernNavigation />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Projects</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            A focused collection of production-minded systems, ML experiments, and practical tools.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioData.projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-white/12 bg-white/[0.065] shadow-xl shadow-purple-950/10 backdrop-blur-xl transition hover:bg-white/[0.09]"
            >
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-purple-500/20 to-violet-500/20">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/14 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/68">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded-full border border-white/12 bg-white/[0.08] px-2.5 py-0.5 text-xs font-medium text-white/68">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="rounded-full border border-white/12 bg-white/[0.08] px-2.5 py-0.5 text-xs text-white/50">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <a
                    href={project.readmeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/18"
                    title="Open README"
                  >
                    Read More
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>

                  {project.isPublic && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/12 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                      title="View on GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="ml-auto rounded-lg bg-white px-3 py-2 text-sm font-semibold text-purple-950 transition hover:bg-white/90"
                  >
                    View Working
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
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
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-white">{project.title}</h3>
            <p className="text-sm text-white/60">{project.category}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[70vh] w-full">
          {project.workingUrl && project.workingUrl !== "#" ? (
            <iframe
              src={project.workingUrl}
              className="h-full w-full"
              title={project.title}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <img
                src={project.image}
                alt={project.title}
                className="max-h-64 rounded-xl object-cover shadow-lg"
              />
              <p className="max-w-md text-white/60">
                The live working version is not publicly deployed yet. Visit the GitHub repository to explore the source code.
              </p>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-purple-950 transition hover:bg-white/90"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
