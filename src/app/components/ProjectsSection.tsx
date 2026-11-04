'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useLenis } from 'lenis/react'
import { motion, useReducedMotion } from 'motion/react'
import { hasPublicUrl, portfolioData, type Project } from '@/data/portfolio'
import { setResumeModalProject } from './ResumeAssistant'
import SystemGlyph from './SystemGlyph'

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const modules = portfolioData.projects.filter((item) => item.parentId === project.id)
  const dialogRef = useRef<HTMLElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    const page = document.querySelector('[data-resume-root]')
    document.body.dataset.portfolioModal = 'open'
    page?.setAttribute('inert', '')
    html.style.overflow = 'hidden'
    lenis?.stop()
    dialogRef.current?.focus({ preventScroll: true })

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      delete document.body.dataset.portfolioModal
      page?.removeAttribute('inert')
      html.style.overflow = previousOverflow
      lenis?.start()
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [lenis, onClose])

  const dialog = (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#2a0d0b]/80 p-4 pb-28 backdrop-blur-[2px] sm:items-center sm:p-6 sm:pr-28"
      data-lenis-prevent
      onClick={onClose}
    >
      <article
        className="max-h-[min(86vh,calc(100dvh-8rem))] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-[2rem] border border-sage/35 bg-gradient-to-b from-[#4a1814] via-[#2a0d0b] to-[#31372c] p-6 text-white shadow-2xl [scrollbar-color:rgba(232,210,181,0.5)_transparent] sm:p-8"
        ref={dialogRef}
        tabIndex={-1}
        data-lenis-prevent
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-sage">{project.company} · {project.ownershipLabel}</p>
        <h3 id="project-title" className="mt-2 font-serif text-3xl text-cream">{project.title}</h3>
        <p className="mt-4 leading-relaxed text-white/80">{project.problem}</p>
        <p className="mt-3 leading-relaxed text-cream/80">{project.contribution}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.architecture.map((step) => <span key={step} className="rounded-full border border-sage/40 bg-sage/15 px-3 py-1 text-xs text-sage">{step}</span>)}
        </div>
        <p className="mt-5 rounded-2xl border border-cream/20 bg-cream/10 p-4 text-sm leading-relaxed text-cream">{project.businessValue}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((item) => <span key={item} className="rounded-full bg-burgundy px-3 py-1 text-xs text-cream">{item}</span>)}
        </div>
        {project.safeguards && <p className="mt-5 rounded-2xl border border-sage/25 bg-sage/10 p-4 text-sm text-cream">{project.safeguards}</p>}
        {modules.length > 0 && (
          <div className="mt-6 space-y-3">
            {modules.map((item) => (
              <div key={item.id} className="rounded-2xl border border-sage/25 bg-burgundy/30 p-4">
                <h4 className="text-lg text-cream">{item.shortName}</h4>
                <p className="mt-1 text-sm text-white/75">{item.description}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          {hasPublicUrl(project.github) && <a className="rounded-full border border-sage/40 px-4 py-2 text-sm text-sage" href={project.github} target="_blank" rel="noreferrer">GitHub</a>}
          <button type="button" className="rounded-full border border-cream/40 px-4 py-2 text-sm text-cream" onClick={onClose}>Close</button>
        </div>
      </article>
    </div>
  )

  return createPortal(dialog, document.body)
}

function SystemIndex({ groups, activeId, onSelect }: { groups: Array<[string, Project[]]>; activeId: string; onSelect: (project: Project) => void }) {
  return (
    <div className="space-y-5" role="tablist" aria-label="Projects">
      {groups.map(([label, items]) => (
        <div key={label}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">{label}</p>
          <div className="mt-2 space-y-1">
            {items.map((project) => {
              const active = project.id === activeId
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelect(project)}
                  onMouseEnter={() => onSelect(project)}
                  onFocus={() => onSelect(project)}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${active ? 'bg-cream text-ink' : 'text-cream/80 hover:bg-white/5'}`}
                  role="tab"
                  aria-selected={active}
                >
                  {project.shortName}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

const stackFaces = [
  'border-sage/40 bg-[#243028]',
  'border-cream/30 bg-[#3c2a22]',
  'border-burgundy/80 bg-[#4a1814]',
]

function SystemStack({
  projects,
  active,
  onSelect,
  onOpen,
}: {
  projects: Project[]
  active: Project
  onSelect: (project: Project) => void
  onOpen: (project: Project) => void
}) {
  const reduce = useReducedMotion()
  const index = Math.max(0, projects.findIndex((project) => project.id === active.id))
  const behind = [1, 2, 3].map((offset) => projects[(index + offset) % projects.length])
  const touch = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const [slide, setSlide] = useState(1)
  const cue = useSyncExternalStore(
    (onChange) => {
      const narrow = window.matchMedia('(max-width: 1023px)')
      const coarse = window.matchMedia('(pointer: coarse)')
      narrow.addEventListener('change', onChange)
      coarse.addEventListener('change', onChange)
      window.addEventListener('uday-swipe-cue', onChange)
      return () => {
        narrow.removeEventListener('change', onChange)
        coarse.removeEventListener('change', onChange)
        window.removeEventListener('uday-swipe-cue', onChange)
      }
    },
    () => window.matchMedia('(max-width: 1023px)').matches && window.matchMedia('(pointer: coarse)').matches && window.localStorage.getItem('uday-swipe-cue') !== 'seen',
    () => false,
  )
  const mobile = useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia('(max-width: 1023px)')
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia('(max-width: 1023px)').matches,
    () => false,
  )
  const dismissCue = () => {
    window.localStorage.setItem('uday-swipe-cue', 'seen')
    window.dispatchEvent(new Event('uday-swipe-cue'))
  }
  const showProject = (direction: 1 | -1) => {
    setSlide(direction)
    dismissCue()
    onSelect(projects[(index + direction + projects.length) % projects.length])
  }

  return (
    <div className="relative pt-14 pr-2 sm:pt-16">
      {behind.map((project, depth) => (
        <button
          key={project.id}
          type="button"
          onMouseEnter={() => onSelect(project)}
          onFocus={() => onSelect(project)}
          aria-label={`Show ${project.shortName}`}
          className={`absolute bottom-0 left-0 rounded-[1.8rem] border text-right shadow-lg ${stackFaces[depth]}`}
          style={{
            top: 56 - (depth + 1) * 14,
            right: -((depth + 1) * 16),
            zIndex: 3 - depth,
          }}
        >
          <span className="absolute right-5 top-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/80">
            {project.shortName}
          </span>
        </button>
      ))}
      <motion.article
          key={active.id}
          data-project-id={active.id}
          data-project-name={active.shortName}
          initial={reduce ? { opacity: 0 } : mobile ? { x: slide * 72, opacity: 0 } : { x: 92, y: -68, rotate: 4, opacity: 0 }}
          animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: reduce ? 0.15 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 touch-pan-y rounded-[1.8rem] border border-sage/35 bg-gradient-to-br from-[#3a1210] via-[#2a0d0b] to-[#31372c] p-5 shadow-2xl sm:p-7"
          onTouchStart={(event) => {
            touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
          }}
          onTouchEnd={(event) => {
            if (!touch.current) return
            const dx = event.changedTouches[0].clientX - touch.current.x
            const dy = event.changedTouches[0].clientY - touch.current.y
            touch.current = null
            if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
            swiped.current = true
            showProject(dx < 0 ? 1 : -1)
          }}
        >
          <div className="mb-4 h-24 overflow-hidden rounded-2xl border border-cream/15">
            <SystemGlyph type={active.visualType} />
          </div>
          <div data-swipe-controls="ready" className="mb-3 flex items-center justify-between gap-3 lg:hidden">
            <button type="button" className="rounded-full border border-cream/30 px-3 py-1 text-sm text-cream" onClick={() => showProject(-1)} aria-label="Previous project">Previous</button>
            <p className="text-xs text-cream/70">{index + 1} of {projects.length}</p>
            <button type="button" className="rounded-full border border-cream/30 px-3 py-1 text-sm text-cream" onClick={() => showProject(1)} aria-label="Next project">Next</button>
          </div>
          <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">{active.company}</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-cream/70">{active.category}</p>
          </div>
          <h3 className="mt-3 font-serif text-3xl leading-tight text-cream sm:text-4xl">{active.title}</h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85">{active.problem}</p>
          <div className="mt-5 border-t border-cream/15 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/70">My part</p>
            <p className="mt-2 max-w-2xl leading-relaxed text-cream">{active.contribution}</p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {active.workflow.map((step, stepIndex) => (
              <span key={step} className="inline-flex items-center gap-2 text-sm text-cream">
                {step}
                {stepIndex < active.workflow.length - 1 && <span className="text-sage">→</span>}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-sage">{active.technologies.join(' · ')}</p>
            <button
              type="button"
              onClick={() => {
                if (swiped.current) {
                  swiped.current = false
                  return
                }
                onOpen(active)
              }}
              className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink"
            >
              Open
            </button>
          </div>
      </motion.article>
      {cue && <p className="mt-2 text-center text-xs text-sage lg:hidden">Swipe to explore</p>}
    </div>
  )
}

export default function ProjectsSection() {
  const worktual = portfolioData.projects.filter((project) => project.company === 'Worktual' && project.visibility !== 'module')
  const webfosys = portfolioData.projects.filter((project) => project.company === 'Webfosys' && project.visibility !== 'module')
  const personal = portfolioData.projects.filter((project) => project.visibility === 'personal')
  const groups: Array<[string, Project[]]> = [['Worktual', worktual], ['Webfosys', webfosys], ['Self projects', personal]]
  const [active, setActive] = useState<Project>(worktual[0])
  const [selected, setSelected] = useState<Project | null>(null)
  const closeProject = useCallback(() => setSelected(null), [setSelected])
  const callout = useSyncExternalStore(
    (onChange) => {
      window.addEventListener('uday-project-callout', onChange)
      return () => window.removeEventListener('uday-project-callout', onChange)
    },
    () => window.sessionStorage.getItem('uday-project-callout') === 'hidden' ? 'hidden' : 'show',
    () => 'show',
  )

  useEffect(() => {
    setResumeModalProject(selected)
    return () => setResumeModalProject(null)
  }, [selected])

  const hideCallout = () => {
    window.sessionStorage.setItem('uday-project-callout', 'hidden')
    window.dispatchEvent(new Event('uday-project-callout'))
  }

  return (
    <section id="projects" className="relative z-10 overflow-x-clip py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Selected work</p>
        <h2 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">Worktual, Webfosys, and self projects</h2>
        {callout === 'show' && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-sage/30 bg-sage/15 px-4 py-3 text-sm text-cream">
            <p>Want the technical detail? Ask Uday from any project.</p>
            <button type="button" onClick={hideCallout} className="rounded-full border border-cream/40 px-3 py-1 text-cream">Dismiss</button>
          </div>
        )}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[220px_1fr]">
          <div className="hidden lg:block">
            <SystemIndex groups={groups} activeId={active.id} onSelect={setActive} />
          </div>
          <SystemStack
            projects={[...worktual, ...webfosys, ...personal]}
            active={active}
            onSelect={setActive}
            onOpen={setSelected}
          />
        </div>
      </div>
      {selected && <ProjectModal project={selected} onClose={closeProject} />}
    </section>
  )
}
