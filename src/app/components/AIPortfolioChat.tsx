'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  FileText,
  Github,
  Info,
  Linkedin,
  Mail,
  X,
  Send,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { portfolioData, Project } from '@/data/portfolio'
import InteractiveStarBackground from './InteractiveStarBackground'

type Intent = 'me' | 'projects' | 'experience' | 'skills' | 'education' | 'achievements' | 'leadership' | 'contact' | 'general'

type Message = {
  id: string
  query: string
  intent: Intent
  answer: string
  source?: 'nvidia' | 'fallback'
}

const quickPrompts: Array<{ label: string; intent: Intent; prompt: string; Icon: typeof UserRound; color: string }> = [
  { label: 'Me', intent: 'me', prompt: 'Tell me about yourself.', Icon: UserRound, color: 'text-cream' },
  { label: 'Projects', intent: 'projects', prompt: 'Show me your projects.', Icon: BriefcaseBusiness, color: 'text-sage' },
  { label: 'Experience', intent: 'experience', prompt: 'Tell me about your work experience.', Icon: FileText, color: 'text-cream' },
  { label: 'Skills', intent: 'skills', prompt: 'What are your skills?', Icon: Code2, color: 'text-sage' },
  { label: 'Contact', intent: 'contact', prompt: 'How can I contact you?', Icon: UsersRound, color: 'text-cream' },
]

const featuredProjects = portfolioData.projects.filter((project) => project.featured).slice(0, 5)

function detectIntent(query: string): Intent {
  const text = query.toLowerCase()

  if (/(contact|email|phone|linkedin|github|hire|reach)/.test(text)) return 'contact'
  if (/(achievement|award|hackathon|certification|rank|prize)/.test(text)) return 'achievements'
  if (/(education|college|degree|university|cgpa|mca|bachelor)/.test(text)) return 'education'
  if (/(project|portfolio|rag|agent|mcp|vision|plate|plant|attendance|built|work sample)/.test(text)) return 'projects'
  if (/(skill|stack|technology|python|llm|database|tool|framework)/.test(text)) return 'skills'
  if (/(webfosys|seo|wordpress|search console|ontology|semantic|worktual|zenx|experience|job|company|role|career)/.test(text)) return 'experience'
  if (/(codetantra|teaching|trainer|leadership|public speaking|people skill)/.test(text)) return 'leadership'
  if (/(about|yourself|who are you|location|uday)/.test(text)) return 'me'

  return 'general'
}

function buildAnswer(intent: Intent) {
  switch (intent) {
    case 'me':
      return `${portfolioData.personal.name} is an ${portfolioData.personal.title} based in ${portfolioData.personal.location}. ${portfolioData.personal.description}`
    case 'projects':
      return `The strongest portfolio stories are ${featuredProjects.map((project) => project.title).join(', ')}. Employer systems are described without private code. Personal repositories are linked where they are public.`
    case 'skills':
      return `Uday's core stack is Python, JavaScript, TypeScript, LLMs, RAG, multi-agent systems, FastAPI, Flask, LangChain, LlamaIndex, PostgreSQL, Neo4j, Qdrant, Docker, React, and Next.js.`
    case 'experience':
      return `Uday is a Trainee Software Engineer in Python at Worktual, with hands-on work on the ontology and semantic layer and team contributions around conversational agents. At Webfosys he implemented a connected SEO platform for WordPress publishing, rule-plus-LLM quality checks, and Search Console reporting. ZenX was a Webfosys client assignment from July to September 2025, not a separate employer.`
    case 'leadership':
      return `CodeTantra was a college-linked technical training internship from February to July 2025. It belongs with leadership and communication, not core engineering employment.`
    case 'education':
      return portfolioData.education.map((item) => `${item.degree} at ${item.institution} (${item.period}, CGPA ${item.cgpa}).`).join(' ')
    case 'achievements':
      return portfolioData.achievements.map((group) => `${group.category}: ${group.items.map((item) => item.title).join('; ')}`).join(' ')
    case 'contact':
      return `The best way to reach Uday is by email at ${portfolioData.contact.email}. He is ${portfolioData.contact.availability.toLowerCase()} and is also available through LinkedIn and GitHub.`
    default:
      return `I can help you explore Uday's profile, projects, skills, experience, education, and contact details. Try asking about his AI projects, RAG work, NLP experience, or current availability.`
  }
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setDisplayed(text.slice(0, index))
      if (index >= text.length) window.clearInterval(timer)
    }, 8)

    return () => window.clearInterval(timer)
  }, [text])

  return <span>{displayed}</span>
}

function ChatComposer({
  value,
  placeholder,
  suggestion,
  isTyping,
  compact = false,
  inputRef,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
}: {
  value: string
  placeholder: string
  suggestion: string
  isTyping: boolean
  compact?: boolean
  inputRef: RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onSubmit: () => void
  onFocus: () => void
  onBlur: () => void
}) {
  const normalizedValue = value.trim().toLowerCase()
  const normalizedSuggestion = suggestion.toLowerCase()
  const showGhost = Boolean(
    suggestion &&
    !isTyping &&
    (!normalizedValue || (normalizedSuggestion.startsWith(normalizedValue) && normalizedSuggestion !== normalizedValue))
  )
  const ghostSuffix = normalizedValue ? suggestion.slice(value.length) : suggestion

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="w-full"
    >
      <div className="relative rounded-full border border-cream/25 bg-ink/55 shadow-[0_20px_70px_rgba(20,4,3,0.45)] backdrop-blur-2xl transition focus-within:border-cream/55 focus-within:bg-ink/70">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_18%_30%,rgba(167,139,250,0.16),transparent_35%),radial-gradient(circle_at_88%_70%,rgba(59,130,246,0.14),transparent_28%)]" />
        <div className="relative">
          {showGhost && (
            <div
              className={`${compact ? 'h-14 text-[15px]' : 'h-16 text-base sm:text-lg'} pointer-events-none absolute inset-0 flex items-center overflow-hidden whitespace-pre rounded-full py-4 pl-6 pr-16 text-left`}
              aria-hidden="true"
            >
              {normalizedValue ? (
                <>
                  <span className="invisible">{value}</span>
                  <span className="text-cream/25">{ghostSuffix}</span>
                </>
              ) : (
                <span className="text-cream/25">{suggestion}</span>
              )}
            </div>
          )}
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={(event) => {
              if (event.key === 'Tab' && showGhost) {
                event.preventDefault()
                onChange(suggestion)
              }
            }}
            placeholder={showGhost ? '' : placeholder}
            disabled={isTyping}
            className={`${compact ? 'h-14 text-[15px]' : 'h-16 text-base sm:text-lg'} relative w-full rounded-full bg-transparent py-4 pl-6 pr-16 text-white outline-none transition placeholder:text-cream/40 disabled:cursor-wait disabled:opacity-70`}
          />
          <button
            type="submit"
            disabled={isTyping || !value.trim()}
            className={`${compact ? 'right-1.5 top-1.5 h-11 w-11' : 'right-2 top-2 h-12 w-12'} group absolute flex items-center justify-center overflow-hidden rounded-full bg-cream text-ink shadow-lg shadow-[#2a0d0b]/35 transition hover:bg-[#f3e4cf] disabled:cursor-not-allowed disabled:opacity-45`}
            aria-label="Ask"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent opacity-0 transition group-hover:opacity-100" />
            <Send className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} relative mx-auto`} />
          </button>
        </div>
      </div>
    </form>
  )
}

function QuickPromptDock({ onPrompt }: { onPrompt: (prompt: string, intent: Intent) => void }) {
  return (
    <div className="flex w-full max-w-full flex-nowrap items-center justify-start gap-2 overflow-x-auto px-2 py-1 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
      {quickPrompts.map(({ label, prompt, intent, Icon, color }) => (
        <motion.button
          key={label}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onPrompt(prompt, intent)}
          whileHover={{ y: -4, scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 text-xs font-semibold text-white/78 shadow-[0_14px_40px_rgba(16,8,35,0.26)] backdrop-blur-2xl transition hover:border-cream/40 hover:bg-white/[0.14] sm:h-11 sm:px-5 sm:text-sm"
        >
          <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${color}`} />
          {label}
        </motion.button>
      ))}
    </div>
  )
}

function InfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-xl rounded-[2rem] border border-white/12 bg-ink p-7 text-white shadow-2xl shadow-[#2a0d0b]/45"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink transition hover:bg-cream/25"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="pr-10 text-3xl font-bold tracking-tight">Welcome to Uday AI</h2>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-white/72">
              <div>
                <h3 className="mb-1 font-semibold text-white">What is this?</h3>
                <p>
                  This is a conversational portfolio. Ask about Uday&apos;s projects, NLP work, RAG systems,
                  multi-agent experience, skills, education, or contact details.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">How does it answer?</h3>
                <p>
                  The chat uses Uday&apos;s portfolio data as context and routes questions through the NVIDIA-hosted
                  language model configured on the server.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-cream/25"
            >
              Start chatting
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Portrait({ className, alt }: { className: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  const initials = portfolioData.personal.name.split(' ').map((part) => part[0]).join('')

  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-burgundy to-ink font-serif text-3xl text-cream`}>
        {initials}
      </div>
    )
  }

  return (
    <Image
      src="/images/generated/ai-avatar.png"
      alt={alt}
      fill
      sizes="180px"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  )
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative h-80 w-64 shrink-0 snap-center overflow-hidden rounded-[2rem] border border-burgundy/40 bg-burgundy text-left shadow-2xl shadow-[#2a0d0b]/30 transition hover:-translate-y-1 hover:border-cream/40"
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        unoptimized
        sizes="256px"
        className="object-cover opacity-80 transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cream/80">{project.category}</p>
        <h3 className="text-2xl font-bold leading-tight text-white">{project.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/65">{project.description}</p>
      </div>
    </button>
  )
}

function ResponseContent({ intent, onProjectSelect }: { intent: Intent; onProjectSelect: (project: Project) => void }) {
  if (intent === 'me') {
    return (
      <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-[#2a0d0b]/20 backdrop-blur-2xl md:grid-cols-[180px_1fr] md:p-6">
        <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-[1.6rem] border border-white/15 bg-white/10 shadow-inner shadow-[#2a0d0b]/20 md:mx-0">
          <Portrait className="absolute inset-0" alt={portfolioData.personal.name} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">{portfolioData.personal.name}</h2>
          <p className="mt-1 text-sm font-medium text-cream">{portfolioData.personal.title} - {portfolioData.personal.location}</p>
          <p className="mt-4 leading-relaxed text-white/70">{portfolioData.personal.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['NLP', 'RAG', 'Multi-Agent Systems'].map((item) => (
              <span key={item} className="rounded-full bg-sage/20 px-4 py-1.5 text-sm font-medium text-cream">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (intent === 'projects') {
    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/55">{portfolioData.projects.length} total</span>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => onProjectSelect(project)} />
          ))}
        </div>
      </div>
    )
  }

  if (intent === 'skills') {
    return (
      <div className="space-y-5">
        <h2 className="text-3xl font-bold text-white">Skills & Expertise</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(portfolioData.skills).map(([group, skills]) => (
            <div key={group} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream">{group}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-[#3a1512]/80 px-3 py-1.5 text-xs font-medium text-white/75">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (intent === 'experience') {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Professional Experience</h2>
        {portfolioData.experience.map((role) => (
          <div key={`${role.company}-${role.title}`} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{role.title}</h3>
                <p className="text-sm text-cream">{role.company}</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-cream">{role.period}</span>
            </div>
            <p className="mt-4 leading-relaxed text-white/68">{role.description}</p>
            <p className="mt-3 text-sm text-sage">{role.ownership}</p>
          </div>
        ))}
      </div>
    )
  }

  if (intent === 'leadership') {
    return (
      <div className="rounded-[2rem] border border-cream/15 bg-cream/[0.06] p-6">
        <h2 className="text-3xl font-bold text-white">Leadership</h2>
        {portfolioData.leadership.map((item) => (
          <div key={item.organization} className="mt-4">
            <h3 className="text-xl text-cream">{item.title}</h3>
            <p className="text-sm text-sage">{item.organization} · {item.period} · {item.context}</p>
            <p className="mt-3 leading-relaxed text-white/75">{item.summary}</p>
          </div>
        ))}
      </div>
    )
  }

  if (intent === 'education') {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white">Education</h2>
        {portfolioData.education.map((item) => (
          <div key={item.degree} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{item.degree}</h3>
                <p className="text-sm text-cream">{item.institution}</p>
              </div>
              <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-semibold text-cream">{item.cgpa} CGPA</span>
            </div>
            <p className="mt-3 text-sm text-white/60">{item.period}</p>
            <p className="mt-3 leading-relaxed text-white/70">{item.description}</p>
          </div>
        ))}
      </div>
    )
  }

  if (intent === 'achievements') {
    return (
      <div className="space-y-5">
        <h2 className="text-3xl font-bold text-white">Achievements</h2>
        {portfolioData.achievements.map((group) => (
          <div key={group.category} className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cream">{group.category}</h3>
            <ul className="mt-3 space-y-3">
              {group.items.map((item) => (
                <li key={item.title}>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-white/65">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  if (intent === 'contact') {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-[#2a0d0b]/20 backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h2 className="text-3xl font-bold text-white">Contact</h2>
            <p className="mt-1 text-white/50">{portfolioData.contact.availability}</p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-cream">Available</span>
        </div>
        <a href={`mailto:${portfolioData.contact.email}`} className="mt-6 inline-flex text-lg font-semibold text-cream hover:text-white">
          {portfolioData.contact.email}
        </a>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={portfolioData.social.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-[#2a0d0b]/25">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a href={portfolioData.social.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-[#2a0d0b]/15">
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a href={`mailto:${portfolioData.contact.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white">
            <Mail className="h-4 w-4" /> Email
          </a>
        </div>
      </div>
    )
  }

  return null
}

export default function AIPortfolioChat() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isComposerFocused, setIsComposerFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const placeholders = useMemo(
    () => [
      'Ask me anything...',
      'Show me your projects...',
      'What is Uday\'s AI stack?',
      'Tell me about RAG experience...',
      'How can I contact you?',
    ],
    []
  )
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const typedSuggestion = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase()
    if (!trimmedQuery) return quickPrompts[placeholderIndex % quickPrompts.length].prompt

    return (
      quickPrompts.find(({ prompt }) => prompt.toLowerCase().startsWith(trimmedQuery) && prompt.toLowerCase() !== trimmedQuery)
        ?.prompt || ''
    )
  }, [placeholderIndex, query])
  const showPromptSuggestions = isComposerFocused && !query.trim() && !isTyping

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((index) => (index + 1) % placeholders.length)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [placeholders.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsInfoOpen(false)
      setSelectedProject(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const submitQuery = async (prompt = query, forcedIntent?: Intent) => {
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt || isTyping) return

    const fallbackIntent = forcedIntent ?? detectIntent(cleanPrompt)
    setQuery('')
    setIsTyping(true)

    try {
      const history = messages.flatMap((message) => [
        { role: 'user' as const, content: message.query },
        { role: 'assistant' as const, content: message.answer },
      ])

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanPrompt, history }),
      })

      if (!response.ok) {
        throw new Error(`Chat API returned ${response.status}`)
      }

      const data = await response.json()
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          query: cleanPrompt,
          intent: data.intent || fallbackIntent,
          answer: data.answer || buildAnswer(fallbackIntent),
          source: data.source,
        },
      ])
    } catch (error) {
      console.error('Chat request failed:', error)
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          query: cleanPrompt,
          intent: fallbackIntent,
          answer: buildAnswer(fallbackIntent),
          source: 'fallback',
        },
      ])
    } finally {
      setIsTyping(false)
      window.setTimeout(() => inputRef.current?.focus(), 80)
    }
  }

  const isChatting = messages.length > 0 || isTyping

  return (
    <section className="relative z-10 min-h-screen px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <InteractiveStarBackground variant="default" />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-18%] h-96 w-96 rounded-full bg-sage/20 blur-3xl" />
        <div className="absolute bottom-[-18%] right-[-12%] h-96 w-96 rounded-full bg-cream/15 blur-3xl" />
        <div className="absolute right-[18%] top-[18%] h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <a
          href="/resume"
          className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-[#2a0d0b]/20 backdrop-blur-2xl transition hover:bg-white/[0.14]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink">
            <FileText className="h-4 w-4" />
          </span>
          Resume
          <ArrowRight className="h-4 w-4 text-white/45" />
        </a>
        <button
          type="button"
          aria-label="About this portfolio"
          onClick={() => setIsInfoOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-cream shadow-2xl shadow-[#2a0d0b]/20 backdrop-blur-2xl transition hover:bg-white/[0.14] hover:text-white"
        >
          <Info className="h-5 w-5" />
        </button>
      </header>

      {!isChatting ? (
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          className="mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-5xl flex-col items-center justify-start pt-20 text-center sm:min-h-[calc(100vh-7rem)] sm:justify-center sm:pt-0"
        >
          <p className="font-serif text-xl italic text-cream/80 sm:text-3xl">Hey, I&apos;m {portfolioData.personal.name}</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-none text-cream sm:text-7xl lg:text-8xl">
            {portfolioData.personal.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sage sm:text-base">{portfolioData.personal.tagline}</p>
          <div className="relative mt-7 h-24 w-24 overflow-hidden rounded-[1.6rem] border border-cream/20 bg-ink shadow-2xl shadow-[#2a0d0b]/30 sm:h-28 sm:w-28 sm:rounded-[2rem]">
            <Portrait className="absolute inset-0" alt={portfolioData.personal.name} />
          </div>

          <div className="mt-8 w-full max-w-2xl sm:mt-10">
            <ChatComposer
              value={query}
              placeholder={placeholders[placeholderIndex]}
              suggestion={typedSuggestion}
              isTyping={isTyping}
              inputRef={inputRef}
              onChange={setQuery}
              onSubmit={() => submitQuery()}
              onFocus={() => setIsComposerFocused(true)}
              onBlur={() => setIsComposerFocused(false)}
            />
          </div>

          <AnimatePresence>
            {showPromptSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-6 w-full max-w-3xl sm:mt-8"
              >
                <QuickPromptDock onPrompt={(prompt, intent) => submitQuery(prompt, intent)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl flex-col pb-56 pt-16">
          <button
            onClick={() => setMessages([])}
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/[0.14] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <AnimatePresence mode="wait">
            <motion.div className="space-y-8">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <div className="flex justify-end">
                    <div className="max-w-[86%] rounded-2xl rounded-br-sm bg-cream px-5 py-3 text-[15px] font-medium leading-relaxed text-ink shadow-lg shadow-[#2a0d0b]/30">
                      {message.query}
                    </div>
                  </div>

                  <ResponseContent intent={message.intent} onProjectSelect={setSelectedProject} />

                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.08] px-5 py-4 text-[15px] leading-relaxed text-white/78 shadow-xl shadow-[#2a0d0b]/15 backdrop-blur-2xl">
                      <TypewriterText key={message.id} text={message.answer} />
                      {message.source === 'fallback' && (
                        <p className="mt-3 text-xs text-sage">Answered from portfolio records.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {isTyping ? (
              <motion.div
                key="typing"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.08] px-5 py-4 backdrop-blur-2xl">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="h-2 w-2 animate-bounce rounded-full bg-cream"
                      style={{ animationDelay: `${dot * 120}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div ref={messagesEndRef} />

          <div className="fixed bottom-5 left-1/2 z-30 flex w-full max-w-3xl -translate-x-1/2 flex-col items-center px-4">
            <AnimatePresence>
              {showPromptSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mb-3 w-full"
                >
                  <QuickPromptDock onPrompt={(prompt, intent) => submitQuery(prompt, intent)} />
                </motion.div>
              )}
            </AnimatePresence>
            <ChatComposer
              value={query}
              placeholder={placeholders[placeholderIndex]}
              suggestion={typedSuggestion}
              isTyping={isTyping}
              compact
              inputRef={inputRef}
              onChange={setQuery}
              onSubmit={() => submitQuery()}
              onFocus={() => setIsComposerFocused(true)}
              onBlur={() => setIsComposerFocused(false)}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-24 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 30, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.96 }}
              className="max-h-[calc(100vh-8rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-ink p-7 text-white shadow-2xl shadow-[#2a0d0b]/40"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-cream/70">{selectedProject.category}</p>
              <h2 className="mt-2 text-4xl font-bold">{selectedProject.title}</h2>
              <p className="mt-5 leading-relaxed text-white/68">{selectedProject.description}</p>
              {selectedProject.features.length > 0 && (
                <ul className="mt-5 space-y-2 text-sm text-white/70">
                  {selectedProject.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <span key={tech} className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-sm text-white/75">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {selectedProject.github.startsWith('http') && (
                <a href={selectedProject.github} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink">
                  GitHub
                </a>
                )}
                {selectedProject.workingUrl.startsWith('http') && (
                  <a href={selectedProject.workingUrl} target="_blank" rel="noreferrer" className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink">
                    Open Project
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed left-8 top-1/2 hidden -translate-y-1/2 text-cream/20 lg:block">
        <Sparkles className="h-7 w-7" />
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </section>
  )
}
