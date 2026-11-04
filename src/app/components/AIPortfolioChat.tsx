'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { detectIntent, fallbackAnswer, projectIntroduction, projectPrompts, type Intent } from '@/lib/portfolio-chat'
import { projectById } from '@/data/projects'
import SystemGlyph from './SystemGlyph'
import LatestWriting from './LatestWriting'
import InteractiveStarBackground from './InteractiveStarBackground'

type Message = {
  id: string
  query: string
  intent: Intent
  answer: string
  source?: 'nvidia' | 'local' | 'fallback'
  projectId?: string
  prompts?: string[]
}

const quickPrompts: Array<{ label: string; intent: Intent; prompt: string; Icon: typeof UserRound; color: string }> = [
  { label: 'Me', intent: 'me', prompt: 'Tell me about yourself.', Icon: UserRound, color: 'text-cream' },
  { label: 'Projects', intent: 'projects', prompt: 'Show me your projects.', Icon: BriefcaseBusiness, color: 'text-sage' },
  { label: 'Experience', intent: 'experience', prompt: 'Tell me about your work experience.', Icon: FileText, color: 'text-cream' },
  { label: 'Skills', intent: 'skills', prompt: 'What are your skills?', Icon: Code2, color: 'text-sage' },
  { label: 'Writing', intent: 'articles', prompt: 'What have you written recently?', Icon: FileText, color: 'text-sage' },
  { label: 'Contact', intent: 'contact', prompt: 'How can I contact you?', Icon: UsersRound, color: 'text-cream' },
]

const CHAT_STORAGE_KEY = 'uday-portfolio-chat-v1'
const CHAT_STORAGE_EVENT = 'uday-portfolio-chat-change'

let storedChatSnapshot = ''

function readStoredChat() {
  const next = window.localStorage.getItem(CHAT_STORAGE_KEY) ?? ''
  if (next !== storedChatSnapshot) storedChatSnapshot = next
  return storedChatSnapshot
}

function subscribeStoredChat(onChange: () => void) {
  window.addEventListener(CHAT_STORAGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHAT_STORAGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

function parseStoredChat(raw: string): Message[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as { version?: number; messages?: Message[] }
    if (parsed.version !== 1 || !Array.isArray(parsed.messages)) return []
    const seen = new Set<string>()
    return parsed.messages.filter((message) => {
      if (!message.answer || !(message.query || message.projectId) || seen.has(message.id)) return false
      seen.add(message.id)
      return true
    }).slice(-12)
  } catch {
    return []
  }
}

function storeChat(messages: Message[]) {
  const seen = new Set<string>()
  const unique = messages.filter((message) => {
    if (seen.has(message.id)) return false
    seen.add(message.id)
    return true
  })
  const payload = JSON.stringify({
    version: 1,
    messages: unique.slice(-12).map(({ id, query, intent, answer, source, projectId, prompts }) => ({ id, query, intent, answer, source, projectId, prompts })),
  })
  if (payload.length > 80_000) return
  window.localStorage.setItem(CHAT_STORAGE_KEY, payload)
  window.dispatchEvent(new Event(CHAT_STORAGE_EVENT))
}

const featuredProjects = portfolioData.projects.filter((project) => project.visibility === 'featured')

function buildAnswer(intent: Intent, query = '', projectId?: string) {
  return fallbackAnswer(intent, query, projectId)
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = window.setTimeout(() => setDisplayed(text), 0)
      return () => window.clearTimeout(timer)
    }
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
    <div className="flex w-full max-w-full flex-nowrap items-center justify-start gap-2 overflow-x-auto px-2 py-1 md:justify-center">
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
            role="dialog"
            aria-modal="true"
            aria-label="About this chat"
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
            <h2 className="pr-10 text-3xl font-bold tracking-tight">About this chat</h2>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-white/72">
              <div>
                <h3 className="mb-1 font-semibold text-white">Who is speaking?</h3>
                <p>
                  The assistant answers in Uday&apos;s voice from verified portfolio records. It is an AI representation, not a live conversation with Uday.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">Where is the chat stored?</h3>
                <p>
                  This browser keeps the recent conversation in local storage so a refresh can restore it. Nothing is saved in a database or cookie. Clear chat removes it from this browser.
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
      src="/images/uday-hoodie-avatar.jpg"
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
      <div className="absolute inset-x-0 top-0 h-36">
        <SystemGlyph type={project.visualType} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cream/80">{project.category}</p>
        <h3 className="text-2xl font-bold leading-tight text-white">{project.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/65">{project.description}</p>
      </div>
    </button>
  )
}

function ResponseContent({ intent, projectId, onProjectSelect }: { intent: Intent; projectId?: string; onProjectSelect: (project: Project) => void }) {
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
    const focused = projectById(projectId)
    const cards = focused ? [focused] : featuredProjects
    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{focused ? focused.shortName : 'Featured Projects'}</h2>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 pt-2">
          {cards.map((project) => (
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
                  <p className="font-medium text-white">{item.title}{item.result ? ` · ${item.result}` : ''}</p>
                  <p className="text-sm text-white/65">{item.description}</p>
                  {item.postUrl && (
                    <a href={item.postUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-sm text-cream underline">LinkedIn post</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  if (intent === 'articles') {
    return <LatestWriting />
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
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [nudge, setNudge] = useState(false)
  const introStarted = useRef(false)
  const messageCount = useRef(0)
  const storedChat = useSyncExternalStore(subscribeStoredChat, readStoredChat, () => '')
  const messages = useMemo(() => parseStoredChat(storedChat), [storedChat])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isComposerFocused, setIsComposerFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)

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
    const viewport = window.visualViewport
    if (!viewport) return
    const update = () => {
      const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      document.documentElement.style.setProperty('--keyboard-offset', `${offset}px`)
    }
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    update()
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  const clearChat = () => {
    window.localStorage.removeItem(CHAT_STORAGE_KEY)
    window.dispatchEvent(new Event(CHAT_STORAGE_EVENT))
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((index) => (index + 1) % placeholders.length)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [placeholders.length])

  useEffect(() => {
    const thread = threadRef.current
    if (!thread) return
    const pinToLatest = () => {
      thread.scrollTop = thread.scrollHeight
    }
    pinToLatest()
    const observer = new MutationObserver(pinToLatest)
    observer.observe(thread, { childList: true, subtree: true, characterData: true })
    const frame = window.requestAnimationFrame(pinToLatest)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
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

  const activeProjectId = messages.at(-1)?.projectId

  const submitQuery = useCallback(async (prompt = query, forcedIntent?: Intent, projectId = activeProjectId) => {
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt || isTyping) return

    const fallbackIntent = forcedIntent ?? detectIntent(cleanPrompt)
    setQuery('')
    setNudge(false)
    setIsTyping(true)

    try {
      const history = messages.flatMap((message) => [
        ...(message.query ? [{ role: 'user' as const, content: message.query }] : []),
        { role: 'assistant' as const, content: message.answer },
      ])

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanPrompt, history, activeProjectId: projectId }),
      })

      if (!response.ok) {
        throw new Error(`Chat API returned ${response.status}`)
      }

      const data = await response.json()
      storeChat([
        ...messages,
        {
          id: `message-${messageCount.current += 1}`,
          query: cleanPrompt,
          intent: data.intent || fallbackIntent,
          answer: data.answer || buildAnswer(fallbackIntent, cleanPrompt, projectId),
          source: data.source,
          projectId: data.projectId || projectId,
          prompts: data.prompts || [],
        },
      ])
    } catch (error) {
      console.error('Chat request failed:', error)
      const fallbackProject = projectById(projectId)
      storeChat([
        ...messages,
        {
          id: `message-${messageCount.current += 1}`,
          query: cleanPrompt,
          intent: fallbackIntent,
          answer: buildAnswer(fallbackIntent, cleanPrompt, projectId),
          source: 'fallback',
          projectId,
          prompts: fallbackProject ? projectPrompts(fallbackProject) : [],
        },
      ])
    } finally {
      setIsTyping(false)
      window.setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [activeProjectId, isTyping, messages, query])

  useEffect(() => {
    const projectId = searchParams.get('project')
    if (!projectId || introStarted.current) return
    const project = projectById(projectId)
    if (!project) return
    const introId = `intro-${project.id}`
    const stored = parseStoredChat(readStoredChat())
    if (stored.some((message) => message.id === introId)) {
      introStarted.current = true
      return
    }
    introStarted.current = true
    const addIntro = (answer: string, source: Message['source'], prompts: string[]) => {
      const current = parseStoredChat(readStoredChat())
      if (current.some((message) => message.id === introId)) return
      storeChat([
        ...current,
        { id: introId, query: '', intent: 'projects', answer, source, projectId: project.id, prompts },
      ])
    }
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'intro', projectId }),
    })
      .then((response) => response.json())
      .then((data) => {
        addIntro(data.answer, data.source, data.prompts || projectPrompts(project))
      })
      .catch(() => {
        addIntro(projectIntroduction(project), 'fallback', projectPrompts(project))
      })
  }, [searchParams])

  const pendingHandled = useRef(false)
  const submitRef = useRef(submitQuery)
  useEffect(() => {
    submitRef.current = submitQuery
    if (pendingHandled.current || isTyping) return
    const projectId = searchParams.get('project')
    const pending = window.sessionStorage.getItem('uday-pending-prompt')
    if (!projectId || !pending) return
    if (!messages.some((message) => message.id === `intro-${projectId}`)) return
    const timer = window.setTimeout(() => {
      pendingHandled.current = true
      window.sessionStorage.removeItem('uday-pending-prompt')
      void submitRef.current(pending, undefined, projectId)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [isTyping, messages, searchParams, submitQuery])

  const isChatting = messages.length > 0 || isTyping

  useEffect(() => {
    if (!isChatting || isTyping || query.trim() || document.hidden) return
    const timer = window.setTimeout(() => setNudge(true), 60000)
    const activity = () => setNudge(false)
    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    events.forEach((event) => window.addEventListener(event, activity))
    return () => {
      window.clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, activity))
    }
  }, [isChatting, isTyping, messages.length, query])

  return (
    <section className={`relative z-10 px-4 pt-6 sm:px-6 lg:px-8 ${isChatting ? 'flex h-dvh flex-col overflow-hidden' : 'min-h-screen pb-10'}`}>
      <InteractiveStarBackground variant="default" />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-18%] h-96 w-96 rounded-full bg-sage/20 blur-3xl" />
        <div className="absolute bottom-[-18%] right-[-12%] h-96 w-96 rounded-full bg-cream/15 blur-3xl" />
        <div className="absolute right-[18%] top-[18%] h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between">
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
          className="mx-auto flex w-full max-w-5xl flex-col items-center px-2 py-10 text-center sm:py-16"
        >
          <h1 className="font-serif text-5xl leading-none text-cream sm:text-7xl">I&apos;m Uday Guduguntla</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-sage">AI Engineer</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/75">This is an AI representation of my portfolio. It answers from verified records, not as a live conversation with me.</p>
        </motion.div>
      ) : (
        <div ref={threadRef} data-lenis-prevent className="mx-auto mt-4 w-full max-w-4xl flex-1 overflow-y-auto overscroll-contain pb-40 [overflow-anchor:none]">
          <div>
          <button
            onClick={clearChat}
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/[0.14] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Clear chat
          </button>

          <AnimatePresence>
            <motion.div className="space-y-8">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  {message.query && (
                  <div className="flex justify-end">
                    <div className="max-w-[86%] rounded-2xl rounded-br-sm bg-cream px-5 py-3 text-[15px] font-medium leading-relaxed text-ink shadow-lg shadow-[#2a0d0b]/30">
                      {message.query}
                    </div>
                  </div>
                  )}

                  <ResponseContent intent={message.intent} projectId={message.projectId} onProjectSelect={setSelectedProject} />

                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.08] px-5 py-4 text-[15px] leading-relaxed text-white/78 shadow-xl shadow-[#2a0d0b]/15 backdrop-blur-2xl">
                      <TypewriterText key={message.id} text={message.answer} />
                      {message.prompts && message.prompts.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.prompts.map((prompt) => (
                            <button key={prompt} type="button" onClick={() => submitQuery(prompt, undefined, message.projectId)} className="rounded-full border border-cream/30 px-3 py-1 text-left text-xs text-cream">{prompt}</button>
                          ))}
                        </div>
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
          </div>
        </div>
      )}

      <motion.div
        layout
        className={isChatting
          ? 'fixed inset-x-0 z-30 mx-auto flex w-full max-w-3xl flex-col px-4'
          : 'mx-auto mt-6 flex w-full max-w-2xl flex-col px-4'}
        style={isChatting ? { bottom: 'calc(1rem + env(safe-area-inset-bottom) + var(--keyboard-offset, 0px))' } : undefined}
      >
        {nudge && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-cream/30 bg-ink/90 px-4 py-3 text-sm text-cream">
            <p>Are we still connected?</p>
            <button type="button" onClick={() => setNudge(false)} className="rounded-full border border-cream/30 px-3 py-1 text-xs">Yes</button>
          </div>
        )}
        <AnimatePresence>
          {showPromptSuggestions && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mb-3 w-full">
              <QuickPromptDock onPrompt={(prompt, intent) => submitQuery(prompt, intent)} />
            </motion.div>
          )}
        </AnimatePresence>
        <ChatComposer
          value={query}
          placeholder={placeholders[placeholderIndex]}
          suggestion={typedSuggestion}
          isTyping={isTyping}
          compact={isChatting}
          inputRef={inputRef}
          onChange={setQuery}
          onSubmit={() => submitQuery()}
          onFocus={() => setIsComposerFocused(true)}
          onBlur={() => setIsComposerFocused(false)}
        />
      </motion.div>
      {!isChatting && (
        <div className="mx-auto mt-8 w-full max-w-3xl px-4 pb-10">
          <LatestWriting compact />
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
              role="dialog"
              aria-modal="true"
              aria-label={selectedProject.title}
              tabIndex={-1}
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
