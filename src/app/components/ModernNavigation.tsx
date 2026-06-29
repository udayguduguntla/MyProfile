'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, BriefcaseBusiness, Home, Mail, Sparkles, UserRound } from 'lucide-react'

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    Icon: Home,
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    Icon: UserRound,
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    Icon: BriefcaseBusiness,
  },
  {
    id: 'achievements',
    label: 'Wins',
    href: '/achievements',
    Icon: Award,
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    Icon: Mail,
  },
]

export default function ModernNavigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const activeId = getActiveId(pathname)

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border px-3 py-2 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          isScrolled
            ? 'border-white/14 bg-slate-950/72 shadow-purple-950/30'
            : 'border-white/10 bg-white/[0.065] shadow-purple-950/12'
        }`}
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2 rounded-xl px-2 py-2 text-white">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/14 bg-white/10">
            <motion.span
              className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/25 via-violet-400/20 to-cyan-300/20"
              animate={{ rotate: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Sparkles className="relative h-5 w-5 text-purple-100" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold">Uday</span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">AI Portfolio</span>
          </span>
        </Link>

        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex min-w-max items-center justify-end gap-1">
            {navigationItems.map((item) => {
              const isActive = activeId === item.id
              const Icon = item.Icon

              return (
                <Link key={item.id} href={item.href} className="relative">
                  <motion.span
                    className={`relative flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${
                      isActive ? 'text-purple-950' : 'text-white/68 hover:text-white'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId="modern-nav-active"
                          className="absolute inset-0 rounded-xl bg-white shadow-lg shadow-purple-950/15"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </AnimatePresence>
                    <Icon className="relative h-4 w-4" />
                    <span className="relative hidden sm:inline">{item.label}</span>
                  </motion.span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

function getActiveId(pathname: string | null) {
  if (!pathname || pathname === '/') return 'home'
  if (pathname.startsWith('/about')) return 'about'
  if (pathname.startsWith('/projects')) return 'projects'
  if (pathname.startsWith('/achievements')) return 'achievements'
  if (pathname.startsWith('/contact')) return 'contact'
  return 'home'
}
