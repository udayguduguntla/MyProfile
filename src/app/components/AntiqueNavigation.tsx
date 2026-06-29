'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AntiqueNavigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { 
      id: 'home', 
      label: 'Home', 
      href: '/', 
      icon: '🏠',
      description: 'Portfolio Home'
    },
    { 
      id: 'about', 
      label: 'About', 
      href: '/about', 
      icon: '👤',
      description: 'About Me'
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      href: '/projects', 
      icon: '💼',
      description: 'My Projects'
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      href: '/achievements', 
      icon: '🏆',
      description: 'Achievements'
    },
    { 
      id: 'contact', 
      label: 'Contact', 
      href: '/contact', 
      icon: '📧',
      description: 'Get In Touch'
    }
  ]

  const getActiveId = () => {
    if (!pathname) return 'home'
    if (pathname === '/') return 'home'
    if (pathname === '/about') return 'about'
    if (pathname === '/projects' || pathname.startsWith('/projects/')) return 'projects'
    if (pathname === '/achievements') return 'achievements'
    if (pathname === '/contact') return 'contact'
    return 'home'
  }

  const activeId = getActiveId()

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
      isScrolled ? 'scale-95 opacity-95' : 'scale-100 opacity-100'
    }`}>
      <nav className="glass-purple px-6 py-3 rounded-full">
        <div className="flex items-center space-x-2 relative z-10">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative px-4 py-2 rounded-full transition-all duration-300 ${
                activeId === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                  : 'text-purple-100 hover:bg-purple-500/30 hover:text-white'
              }`}
              title={item.description}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span className="font-semibold text-sm hidden sm:inline">
                  {item.label}
                </span>
              </div>
              
              {/* Purple tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="glass-purple px-3 py-1 rounded-lg text-xs text-center whitespace-nowrap text-white">
                  {item.description}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rotate-45"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 text-purple-300 text-xs animate-pulse">✦</div>
        <div className="absolute -bottom-2 -right-2 text-purple-300 text-xs animate-pulse animation-delay-1000">✦</div>
      </nav>
    </div>
  )
}