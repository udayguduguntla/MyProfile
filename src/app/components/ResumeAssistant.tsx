'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Project } from '@/data/portfolio'

type Prompt = { text: string; projectId?: string }

const DWELL_MS = 30000
const SKILL_HINT_MS = 400

const skillHints: Record<string, Prompt> = {
  LLMs: { text: 'LLMs reply in the chatbots and review articles before they publish.', projectId: 'worktual-chatbots' },
  RAG: { text: 'RAG is the document retrieval work, plus the public RagChat project.', projectId: 'worktual-rag' },
  Embeddings: { text: 'Embeddings are how document retrieval finds a customer’s own text.', projectId: 'worktual-rag' },
  Ontology: { text: 'Ontology is the shared graph model behind the CDC pipeline.', projectId: 'worktual-cdc' },
  'Semantic Layers': { text: 'The semantic layer is where I built the Cypher agent.', projectId: 'worktual-semantic' },
  'Agent Workflows': { text: 'Agent workflows are the shared kit, and the ticketing skills.', projectId: 'worktual-adk' },
  MCP: { text: 'MCP lets the agent kit pull in tools from outside.', projectId: 'worktual-adk' },
  Python: { text: 'Python runs the CDC pipeline, the chatbots, and the SEO tools.', projectId: 'worktual-cdc' },
  FastAPI: { text: 'FastAPI serves the chatbots and the SEO publisher.', projectId: 'worktual-chatbots' },
  'REST APIs': { text: 'REST APIs connect the chatbots, and publish articles to WordPress.', projectId: 'worktual-chatbots' },
  'WordPress REST API': { text: 'WordPress REST API is how the SEO platform publishes an article.', projectId: 'seo-content-platform' },
  CDC: { text: 'CDC is the pipeline I built to sync each tenant’s graph.', projectId: 'worktual-cdc' },
  Scheduling: { text: 'Scheduling is how articles go out to the right WordPress site.', projectId: 'seo-content-platform' },
  PostgreSQL: { text: 'PostgreSQL is the database the CDC pipeline listens to.', projectId: 'worktual-cdc' },
  Neo4j: { text: 'Neo4j stores the tenant graphs the CDC pipeline writes.', projectId: 'worktual-cdc' },
  Cypher: { text: 'Cypher is the query agent I owned on the semantic layer.', projectId: 'worktual-semantic' },
  SQL: { text: 'SQL is the other analytics agent. I owned the Cypher side.', projectId: 'worktual-semantic' },
  'Vector search': { text: 'Vector search is how document retrieval picks the right passage.', projectId: 'worktual-rag' },
  'Google Search Console API': { text: 'Search Console is the reporting side of the SEO platform.', projectId: 'seo-content-platform' },
  'Meta messaging APIs': { text: 'Meta APIs are the Messenger and Instagram side of the chatbots.', projectId: 'worktual-chatbots' },
  'Multi-tenant data flows': { text: 'Each customer’s documents and graph stay in their own lane.', projectId: 'worktual-cdc' },
  Authentication: { text: 'The SEO tools sign in to WordPress and Search Console.', projectId: 'seo-content-platform' },
  React: { text: 'React is this portfolio. The employer systems are Python.' },
  'Next.js': { text: 'This site is the Next.js work. The product systems are Python.' },
  TypeScript: { text: 'TypeScript is how this portfolio is written.' },
  'Tailwind CSS': { text: 'Tailwind is the styling on this site.' },
}

export function hintResumeSkill(skill: string) {
  window.dispatchEvent(new CustomEvent('uday-skill-hint', { detail: skill }))
}

function interestQuestion(name: string) {
  const options = [
    `Interested in ${name}?`,
    `Want to know more about ${name}?`,
    `Curious about ${name}?`,
  ]
  const index = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length
  return options[index]
}

let modalProject: Project | null = null
const modalListeners = new Set<() => void>()

export function setResumeModalProject(project: Project | null) {
  modalProject = project
  modalListeners.forEach((listener) => listener())
}

function subscribeModal(listener: () => void) {
  modalListeners.add(listener)
  return () => modalListeners.delete(listener)
}

export default function ResumeAssistant() {
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const activeProject = useSyncExternalStore(subscribeModal, () => modalProject, () => null)
  const hidden = useSyncExternalStore(
    (onChange) => {
      window.addEventListener('uday-assistant-hidden', onChange)
      return () => window.removeEventListener('uday-assistant-hidden', onChange)
    },
    () => window.sessionStorage.getItem('uday-assistant-hidden') === 'yes',
    () => false,
  )

  useEffect(() => {
    if (hidden) return
    let dwell = 0
    let current = ''
    let lastText = ''
    const show = (next: Prompt) => {
      if (document.body.dataset.portfolioModal === 'open' || next.text === lastText) return
      const last = Number(window.sessionStorage.getItem('uday-assistant-at') || 0)
      if (!next.projectId && Date.now() - last < 45000) return
      lastText = next.text
      window.sessionStorage.setItem('uday-assistant-at', String(Date.now()))
      setPrompt(next)
    }
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.45)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      window.clearTimeout(dwell)
      if (!visible) {
        current = ''
        return
      }
      const id = visible.target.getAttribute('data-project-id') || ''
      const name = visible.target.getAttribute('data-project-name') || ''
      if (!id || id === current) return
      dwell = window.setTimeout(() => {
        current = id
        show({ projectId: id, text: interestQuestion(name) })
      }, DWELL_MS)
    }, { threshold: [0.45, 0.7] })
    document.querySelectorAll('[data-project-id]').forEach((node) => observer.observe(node))
    const initial = window.setTimeout(() => {
      if (!current) show({ text: 'Want to know more about Uday’s projects?' })
    }, DWELL_MS)
    return () => {
      observer.disconnect()
      window.clearTimeout(dwell)
      window.clearTimeout(initial)
    }
  }, [hidden])

  useEffect(() => {
    if (hidden) return
    let timer = 0
    const onHint = (event: Event) => {
      const hint = skillHints[(event as CustomEvent<string>).detail]
      if (!hint || document.body.dataset.portfolioModal === 'open') return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setPrompt(hint), SKILL_HINT_MS)
    }
    window.addEventListener('uday-skill-hint', onHint)
    return () => {
      window.removeEventListener('uday-skill-hint', onHint)
      window.clearTimeout(timer)
    }
  }, [hidden])

  useEffect(() => {
    if (!activeProject || hidden) return
    const projectId = activeProject.id
    const name = activeProject.shortName
    const timer = window.setTimeout(() => {
      setPrompt({ projectId, text: interestQuestion(name) })
    }, DWELL_MS)
    return () => window.clearTimeout(timer)
  }, [activeProject, hidden])

  const bubble = prompt && !hidden && (!activeProject || prompt.projectId === activeProject.id)
    ? prompt
    : null

  const openProject = (projectId?: string, question?: string) => {
    if (question) window.sessionStorage.setItem('uday-pending-prompt', question)
    router.push(projectId ? `/?project=${projectId}` : '/')
  }

  return (
    <div className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 flex max-w-[calc(100vw-2rem)] items-end gap-3 ${activeProject ? 'z-[70]' : 'z-40'}`}>
      {bubble && (
        <button type="button" onClick={() => openProject(bubble.projectId)} className="max-w-64 rounded-2xl border border-sage/40 bg-[#2a0d0b]/95 px-3 py-2 text-left text-sm leading-snug text-cream shadow-2xl">{bubble.text}</button>
      )}
      <button
        type="button"
        aria-label={activeProject ? `Ask Uday about ${activeProject.shortName}` : 'Ask Uday about this page'}
        onClick={() => openProject(activeProject?.id || prompt?.projectId)}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-cream bg-burgundy shadow-2xl ring-2 ring-burgundy"
      >
        <Image src="/images/uday-hoodie-avatar.jpg" alt="" width={128} height={128} unoptimized priority className="h-full w-full scale-125 object-cover" />
        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[#2a0d0b] bg-sage" />
      </button>
    </div>
  )
}
