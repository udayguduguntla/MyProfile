'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import achievementsData from '@/data/achievements.json'
import ModernNavigation from '../components/ModernNavigation'
import InteractiveStarBackground from '../components/InteractiveStarBackground'

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

export default function AchievementsPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null)
  const achievements: AchievementItem[] = achievementsData.achievements

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      <InteractiveStarBackground variant="achievements" />
      <ModernNavigation />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Credentials</h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Achievements, certifications, and competition results.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-white/12 bg-white/[0.065] shadow-xl shadow-purple-950/10 backdrop-blur-xl"
            >
              <div className="relative h-44 overflow-hidden" style={{ background: item.color }}>
                <div className="flex h-full items-center justify-center">
                  <span className="text-6xl opacity-80">{item.icon}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/14 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full border border-white/14 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {item.date}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/68">
                  {item.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-white/50">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <button
                    onClick={() => setSelectedAchievement(item)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-purple-950 transition hover:bg-white/90"
                  >
                    View / Open
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedAchievement && (
          <CredentialModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function CredentialModal({ achievement, onClose }: { achievement: AchievementItem; onClose: () => void }) {
  const imagePath = `/achievements/${achievement.image}`
  const isPdf = achievement.type === 'pdf'

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
          <div>
            <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
            <p className="text-sm text-white/60">{achievement.category} &middot; {achievement.date}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-center p-6">
          {isPdf ? (
            <div className="text-center">
              <div className="mb-4 text-6xl text-red-400">📄</div>
              <p className="mb-4 text-white/70">PDF document</p>
              <a
                href={imagePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                <ExternalLink className="h-4 w-4" />
                Open PDF
              </a>
            </div>
          ) : (
            <img
              src={imagePath}
              alt={achievement.title}
              className="max-h-[70vh] rounded-lg object-contain"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
