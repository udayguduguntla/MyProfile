'use client'

import { useEffect, useState } from 'react'

interface BackgroundProps {
  variant?: 'default' | 'projects' | 'about' | 'achievements' | 'contact'
}

export default function ImpressiveBackground({ variant = 'default' }: BackgroundProps) {
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

  const getVariantStyles = () => {
    switch (variant) {
      case 'projects':
        return {
          primary: 'bg-blue-500/20',
          secondary: 'bg-cyan-500/15',
          accent: 'bg-teal-500/20',
          highlight: 'bg-blue-400/25'
        }
      case 'about':
        return {
          primary: 'bg-green-500/20',
          secondary: 'bg-emerald-500/15',
          accent: 'bg-lime-500/20',
          highlight: 'bg-green-400/25'
        }
      case 'achievements':
        return {
          primary: 'bg-yellow-500/20',
          secondary: 'bg-orange-500/15',
          accent: 'bg-amber-500/20',
          highlight: 'bg-yellow-400/25'
        }
      case 'contact':
        return {
          primary: 'bg-pink-500/20',
          secondary: 'bg-rose-500/15',
          accent: 'bg-fuchsia-500/20',
          highlight: 'bg-pink-400/25'
        }
      default:
        return {
          primary: 'bg-purple-500/20',
          secondary: 'bg-indigo-500/15',
          accent: 'bg-violet-500/20',
          highlight: 'bg-purple-400/25'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 gradient-mesh"></div>
      
      {/* Moving Wave Effect */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute w-full h-full"
          style={{
            background: `
              radial-gradient(circle at ${50 + Math.sin(scrollY * 0.01) * 20}% ${50 + Math.cos(scrollY * 0.01) * 20}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at ${30 + Math.cos(scrollY * 0.008) * 15}% ${70 + Math.sin(scrollY * 0.008) * 15}%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
            `
          }}
        ></div>
      </div>
      
      {/* Morphing Blobs with Variant Colors */}
      <div className={`absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 ${styles.primary} rounded-full morphing-blob animate-drift`}></div>
      <div className={`absolute top-20 sm:top-40 right-5 sm:right-20 w-40 sm:w-64 lg:w-96 h-40 sm:h-64 lg:h-96 ${styles.secondary} rounded-full morphing-blob animate-drift animation-delay-2000`}></div>
      <div className={`absolute bottom-10 sm:bottom-20 left-1/4 sm:left-1/3 w-32 sm:w-48 lg:w-80 h-32 sm:h-48 lg:h-80 ${styles.accent} rounded-full morphing-blob animate-drift animation-delay-4000`}></div>
      <div className={`absolute top-1/2 right-5 sm:right-10 w-24 sm:w-40 lg:w-64 h-24 sm:h-40 lg:h-64 ${styles.highlight} rounded-full morphing-blob animate-pulse-glow`}></div>
      
      {/* Floating Orbs with Physics */}
      <div className="absolute top-1/4 left-1/2 w-20 sm:w-32 h-20 sm:h-32 bg-pink-500/10 rounded-full animate-float animation-delay-1000 transform hover:scale-110 transition-transform duration-300"></div>
      <div className="absolute bottom-1/4 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-cyan-500/10 rounded-full animate-float animation-delay-3000 transform hover:scale-110 transition-transform duration-300"></div>
      
      {/* Interactive Mouse Follower with Trail */}
      <div 
        className="absolute w-96 h-96 bg-purple-400/5 rounded-full blur-3xl transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>
      <div 
        className="absolute w-64 h-64 bg-violet-400/8 rounded-full blur-2xl transition-all duration-1500 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      ></div>
      
      {/* Enhanced Floating Particles */}
      <div className="floating-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              animationDelay: `${i * 0.5}s`,
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`
            }}
          ></div>
        ))}
      </div>
      
      {/* Moving Geometric Shapes */}
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white/20 rotate-45 animate-sparkle transform hover:scale-150 transition-transform duration-300"></div>
      <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-purple-300/30 rotate-45 animate-sparkle animation-delay-1000 transform hover:scale-150 transition-transform duration-300"></div>
      <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-violet-300/30 rotate-45 animate-sparkle animation-delay-2000 transform hover:scale-150 transition-transform duration-300"></div>
      
      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full transition-all duration-1000"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${50 + Math.sin(scrollY * 0.01) * 10}px ${50 + Math.cos(scrollY * 0.01) * 10}px`,
            transform: `rotate(${scrollY * 0.05}deg)`
          }}
        ></div>
      </div>
      
      {/* Parallax Depth Layers */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div 
          className="absolute top-10 left-10 w-40 h-40 bg-gradient-radial from-purple-500/10 to-transparent rounded-full animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-radial from-violet-500/10 to-transparent rounded-full animate-pulse animation-delay-2000"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-radial from-indigo-500/5 to-transparent rounded-full animate-pulse animation-delay-4000"
          style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.05}px)` }}
        ></div>
      </div>

      {/* Floating Icons for Context */}
      {variant === 'projects' && (
        <div className="absolute top-1/4 right-1/4 text-blue-300/20 text-6xl animate-float animation-delay-1000">
          <i className="fas fa-code"></i>
        </div>
      )}
      {variant === 'about' && (
        <div className="absolute top-1/3 left-1/5 text-green-300/20 text-6xl animate-float animation-delay-1500">
          <i className="fas fa-user"></i>
        </div>
      )}
      {variant === 'achievements' && (
        <div className="absolute bottom-1/3 right-1/5 text-yellow-300/20 text-6xl animate-float animation-delay-2000">
          <i className="fas fa-trophy"></i>
        </div>
      )}
      {variant === 'contact' && (
        <div className="absolute top-1/2 left-1/6 text-pink-300/20 text-6xl animate-float animation-delay-1000">
          <i className="fas fa-envelope"></i>
        </div>
      )}
    </div>
  )
}