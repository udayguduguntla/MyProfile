'use client'

import { useEffect, useState } from 'react'

interface AntiqueBackgroundProps {
  variant?: 'home' | 'about' | 'projects' | 'achievements' | 'contact'
}

export default function AntiqueBackground({ variant = 'home' }: AntiqueBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const getVariantElements = () => {
    switch (variant) {
      case 'about':
        return {
          primary: 'rgba(80, 200, 120, 0.15)',
          secondary: 'rgba(53, 94, 59, 0.1)',
          accent: 'rgba(156, 175, 136, 0.12)',
          icon: '📚',
          ornaments: ['❦', '✦', '❋', '✧']
        }
      case 'projects':
        return {
          primary: 'rgba(70, 130, 180, 0.15)',
          secondary: 'rgba(0, 128, 128, 0.1)',
          accent: 'rgba(112, 128, 144, 0.12)',
          icon: '⚒️',
          ornaments: ['⚙', '⚡', '⚒', '🔧']
        }
      case 'achievements':
        return {
          primary: 'rgba(255, 215, 0, 0.15)',
          secondary: 'rgba(205, 127, 50, 0.1)',
          accent: 'rgba(184, 115, 51, 0.12)',
          icon: '🏆',
          ornaments: ['👑', '🏆', '⭐', '🎖️']
        }
      case 'contact':
        return {
          primary: 'rgba(220, 20, 60, 0.15)',
          secondary: 'rgba(128, 0, 32, 0.1)',
          accent: 'rgba(114, 47, 55, 0.12)',
          icon: '✉️',
          ornaments: ['✉', '📮', '🕊️', '💌']
        }
      default:
        return {
          primary: 'rgba(212, 175, 55, 0.15)',
          secondary: 'rgba(128, 0, 32, 0.1)',
          accent: 'rgba(80, 200, 120, 0.08)',
          icon: '🏛️',
          ornaments: ['❦', '✦', '❋', '✧']
        }
    }
  }

  const variantData = getVariantElements()

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Vintage paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${variantData.primary} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${variantData.secondary} 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${variantData.accent} 0%, transparent 50%)
          `
        }}
      />

      {/* Floating vintage ornaments */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-600 opacity-20 animate-vintage-float"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${15 + (i % 4) * 20}%`,
              fontSize: `${1 + (i % 3) * 0.5}rem`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + (i % 3) * 2}s`
            }}
          >
            {variantData.ornaments[i % variantData.ornaments.length]}
          </div>
        ))}
      </div>

      {/* Manuscript-style floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 opacity-10 animate-vintage-float">
        <div className="w-full h-full border-4 border-yellow-600 rounded-full relative">
          <div className="absolute inset-4 border-2 border-yellow-500 rounded-full">
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl">
              {variantData.icon}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 right-20 w-24 h-24 opacity-15 animate-vintage-float" style={{animationDelay: '2s'}}>
        <div className="w-full h-full border-3 border-yellow-700 transform rotate-45 relative">
          <div className="absolute inset-2 bg-gradient-to-tr from-yellow-300 to-yellow-500 flex items-center justify-center text-lg transform -rotate-45">
            ❦
          </div>
        </div>
      </div>

      {/* Interactive mouse follower with vintage effect */}
      <div 
        className="absolute w-64 h-64 rounded-full opacity-5 transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          background: `radial-gradient(circle, ${variantData.primary} 0%, transparent 70%)`
        }}
      />

      {/* Scrolling parchment effect */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, rgba(212, 175, 55, 0.1) 50%, transparent 60%)
          `,
          backgroundSize: '200px 200px',
          transform: `translateX(${scrollY * 0.1}px) translateY(${scrollY * 0.05}px)`
        }}
      />

      {/* Vintage corner decorations */}
      <div className="absolute top-8 left-8 text-4xl text-yellow-600 opacity-20 animate-ornament-spin">
        ❦
      </div>
      <div className="absolute top-8 right-8 text-4xl text-yellow-600 opacity-20 animate-ornament-spin" style={{animationDirection: 'reverse'}}>
        ❦
      </div>
      <div className="absolute bottom-8 left-8 text-4xl text-yellow-600 opacity-20 animate-ornament-spin" style={{animationDelay: '3s'}}>
        ❦
      </div>
      <div className="absolute bottom-8 right-8 text-4xl text-yellow-600 opacity-20 animate-ornament-spin" style={{animationDirection: 'reverse', animationDelay: '1.5s'}}>
        ❦
      </div>

      {/* Floating manuscript pages */}
      <div className="absolute top-1/4 left-1/4 w-16 h-20 opacity-10 animate-vintage-float" style={{animationDelay: '4s'}}>
        <div className="w-full h-full bg-gradient-to-b from-yellow-100 to-yellow-200 border border-yellow-400 rounded-sm shadow-lg transform rotate-12">
          <div className="p-1 text-xs text-yellow-800 leading-tight">
            <div className="w-full h-1 bg-yellow-400 mb-1"></div>
            <div className="w-3/4 h-0.5 bg-yellow-300 mb-0.5"></div>
            <div className="w-full h-0.5 bg-yellow-300 mb-0.5"></div>
            <div className="w-2/3 h-0.5 bg-yellow-300"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-1/3 right-1/3 w-20 h-16 opacity-10 animate-vintage-float" style={{animationDelay: '6s'}}>
        <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-yellow-150 border border-yellow-500 rounded-sm shadow-lg transform -rotate-6">
          <div className="p-1 text-xs">
            <div className="w-full h-1 bg-yellow-500 mb-1"></div>
            <div className="w-4/5 h-0.5 bg-yellow-400 mb-0.5"></div>
            <div className="w-full h-0.5 bg-yellow-400 mb-0.5"></div>
            <div className="w-3/4 h-0.5 bg-yellow-400"></div>
          </div>
        </div>
      </div>

      {/* Vintage ink blots */}
      <div className="absolute top-1/2 left-1/6 w-8 h-8 opacity-5 animate-vintage-float" style={{animationDelay: '8s'}}>
        <div className="w-full h-full bg-gradient-radial from-yellow-800 to-transparent rounded-full"></div>
      </div>

      <div className="absolute top-2/3 right-1/5 w-6 h-6 opacity-8 animate-vintage-float" style={{animationDelay: '10s'}}>
        <div className="w-full h-full bg-gradient-radial from-yellow-700 to-transparent rounded-full"></div>
      </div>

      {/* Antique compass rose */}
      <div className="absolute top-1/3 right-1/4 w-20 h-20 opacity-10 animate-ornament-spin" style={{animationDuration: '20s'}}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0 border-2 border-yellow-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-yellow-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-yellow-500 rounded-full bg-yellow-100"></div>
        </div>
      </div>
    </div>
  )
}