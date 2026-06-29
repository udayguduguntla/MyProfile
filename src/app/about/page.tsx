'use client'

import { portfolioData } from '@/data/portfolio'
import ModernNavigation from '../components/ModernNavigation'
import InteractiveStarBackground from '../components/InteractiveStarBackground'

export default function AboutPage() {
  return (
    <div className="min-h-screen relative pt-24 pb-16">
      <InteractiveStarBackground variant="about" />
      <ModernNavigation />

      <main className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">About Me</h1>
          <p className="mt-4 text-lg text-white/70">
            {portfolioData.personal.description}
          </p>
        </div>

        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-white">Education</h2>
          <div className="space-y-6">
            {portfolioData.education.map((edu, index) => (
              <div key={index} className="relative border-l-2 border-purple-500/40 pl-6">
                <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full border-2 border-purple-400 bg-purple-900" />
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-purple-200">
                      {edu.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-purple-300">{edu.institution}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{edu.description}</p>
                  {edu.cgpa && (
                    <p className="mt-2 text-sm text-white/50">
                      CGPA: <span className="font-semibold text-purple-200">{edu.cgpa}</span>
                      {edu.status === 'current' && (
                        <span className="ml-3 inline-flex items-center gap-1.5 text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          In Progress
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-2xl font-bold text-white">Experience</h2>
          <div className="space-y-6">
            {portfolioData.experience.map((exp, index) => (
              <div key={index} className="relative border-l-2 border-purple-500/40 pl-6">
                <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full border-2 border-purple-400 bg-purple-900" />
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-purple-200">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-purple-300">{exp.company}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{exp.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-0.5 text-xs text-white/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {exp.current && (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Current Position
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
