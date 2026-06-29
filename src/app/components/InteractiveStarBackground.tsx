'use client'

import { useEffect, useRef, useState, useMemo } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkleSpeed: number
  hue: number
}

interface InteractiveStarBackgroundProps {
  variant?: 'default' | 'projects' | 'about' | 'achievements' | 'contact'
}

export default function InteractiveStarBackground({ variant = 'default' }: InteractiveStarBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const starsRef = useRef<Star[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize stars
    const initStars = () => {
      const stars: Star[] = []
      const numStars = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000))
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          hue: getVariantHue(variant) + (Math.random() - 0.5) * 60
        })
      }
      
      starsRef.current = stars
    }

    // Get hue based on variant
    const getVariantHue = (variant: string) => {
      switch (variant) {
        case 'projects': return 260 // Blue-purple
        case 'about': return 280 // Purple
        case 'achievements': return 300 // Magenta-purple
        case 'contact': return 320 // Pink-purple
        default: return 270 // Pure purple
      }
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Animation loop
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const stars = starsRef.current
      const mouse = mouseRef.current

      stars.forEach((star, index) => {
        // Update star position
        star.y += star.speed
        if (star.y > canvas.height + 10) {
          star.y = -10
          star.x = Math.random() * canvas.width
        }

        // Twinkle effect
        star.opacity += Math.sin(time * star.twinkleSpeed) * 0.01

        // Mouse interaction - stars move away from cursor
        const dx = star.x - mouse.x
        const dy = star.y - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          star.x += (dx / distance) * force * 2
          star.y += (dy / distance) * force * 2
          star.size = Math.min(star.size * (1 + force * 0.5), 4)
        } else {
          star.size = Math.max(star.size * 0.99, 0.5)
        }

        // Keep stars in bounds
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0

        // Draw star
        ctx.save()
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        )
        
        const alpha = Math.max(0, Math.min(1, star.opacity))
        gradient.addColorStop(0, `hsla(${star.hue}, 70%, 80%, ${alpha})`)
        gradient.addColorStop(0.4, `hsla(${star.hue}, 60%, 60%, ${alpha * 0.6})`)
        gradient.addColorStop(1, `hsla(${star.hue}, 50%, 40%, 0)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw bright center
        ctx.fillStyle = `hsla(${star.hue}, 80%, 90%, ${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()

        // Draw connections between nearby stars
        if (index % 3 === 0) { // Only check every 3rd star for performance
          stars.slice(index + 1).forEach(otherStar => {
            const dx = star.x - otherStar.x
            const dy = star.y - otherStar.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 120) {
              const opacity = (120 - distance) / 120 * 0.3
              ctx.strokeStyle = `hsla(${(star.hue + otherStar.hue) / 2}, 60%, 70%, ${opacity})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(star.x, star.y)
              ctx.lineTo(otherStar.x, otherStar.y)
              ctx.stroke()
            }
          })
        }
      })

      // Draw mouse glow effect
      if (mouse.x && mouse.y) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 100
        )
        gradient.addColorStop(0, `hsla(${getVariantHue(variant)}, 70%, 80%, 0.1)`)
        gradient.addColorStop(1, 'transparent')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize and start
    initStars()
    setIsLoaded(true)
    window.addEventListener('mousemove', handleMouseMove)
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [variant])

  const particles = useMemo(() => {
    if (typeof window === 'undefined') return []
    return [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className={`w-full h-full transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'transparent' }}
      />
      
      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-800/10 to-transparent" />
      
      {/* Floating particles for extra magic */}
      {particles.length > 0 && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}