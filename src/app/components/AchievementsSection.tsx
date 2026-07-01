'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X, Trophy, Target, Medal, Brain, Code, Shield, Star } from 'lucide-react'
import achievementsData from '@/data/achievements.json'

interface AchievementItem {
  id: number
  title: string
  category: string
  date: string
  rank: string
  description: string
  highlights: string[]
  tags: string[]
  image: string
  type: string
  icon: string
  color: string
}

const iconMap: Record<string, React.ElementType> = {
  'fas fa-trophy': Trophy,
  'fas fa-medal': Medal,
  'fas fa-award': Star,
  'fas fa-brain': Brain,
  'fas fa-code': Code,
  'fas fa-certificate': Shield,
  'fas fa-star': Star,
  'fas fa-robot': Target,
}

function resolveIcon(icon: string) {
  return iconMap[icon] || Trophy
}

export default function AchievementsSection() {
  const [selected, setSelected] = useState<AchievementItem | null>(null)
  const achievements: AchievementItem[] = achievementsData.achievements

  return (
    <section id="achievements" className="relative z-10 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-14"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-purple-100 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
                Recognition
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Credentials
              </h2>
            </div>
            <p className="hidden sm:block text-sm text-white/40 max-w-xs text-right">
              Achievements, certifications, and competition results
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, index) => {
            const Icon = resolveIcon(item.icon)
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelected(item)}
                className="group relative text-left overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-xl transition-all duration-200 hover:border-white/20 hover:shadow-lg hover:shadow-purple-950/15 hover:-translate-y-0.5"
              >
                <div
                  className="relative h-28 flex items-center justify-center overflow-hidden"
                  style={{ background: item.color }}
                >
                  <Icon className="h-12 w-12 text-white/30 transition duration-500 group-hover:scale-110 group-hover:text-white/50" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full border border-white/14 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                      {item.category}
                    </span>
                    <span className="rounded-full border border-white/14 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                      {item.date}
                    </span>
                  </div>
                </div>

                <div className="p-3.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-white/50">
                    {item.rank}
                  </p>
                  <p className="mt-1.5 text-xs text-white/40 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/40">
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[9px] text-white/25">+{item.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <CredentialModal achievement={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

function CredentialModal({ achievement, onClose }: { achievement: AchievementItem; onClose: () => void }) {
  const imagePath = `/achievements/${achievement.image}`
  const isPdf = achievement.type === 'pdf'
  const Icon = resolveIcon(achievement.icon)

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
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: achievement.color }}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{achievement.title}</h3>
              <p className="text-xs text-white/60">{achievement.category} &middot; {achievement.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isPdf ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: achievement.color }}>
                  <Icon className="h-10 w-10 text-white" />
                </div>
              </div>
              <p className="text-lg font-semibold text-white mb-1">{achievement.title}</p>
              <p className="text-sm text-white/50 mb-2">{achievement.rank}</p>
              <p className="text-sm text-white/60 max-w-md mx-auto mb-6">{achievement.description}</p>
              <a
                href={imagePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                <ExternalLink className="h-4 w-4" />
                Open {achievement.type === 'pdf' ? 'PDF' : 'Certificate'}
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl shrink-0" style={{ background: achievement.color }}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{achievement.title}</p>
                  <p className="text-xs text-white/50">{achievement.rank}</p>
                </div>
              </div>
              <img
                src={imagePath}
                alt={achievement.title}
                className="max-h-[60vh] rounded-lg object-contain mx-auto border border-white/10"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
