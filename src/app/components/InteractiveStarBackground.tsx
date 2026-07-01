'use client'

import { useEffect, useRef } from 'react'

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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const getVariantHue = (v: string) => {
      switch (v) {
        case 'projects': return 260
        case 'about': return 280
        case 'achievements': return 300
        case 'contact': return 320
        default: return 270
      }
    }

    const initStars = () => {
      const stars: Star[] = []
      const numStars = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000))
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.8 + 0.4,
          opacity: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.4 + 0.08,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          hue: getVariantHue(variant) + (Math.random() - 0.5) * 50
        })
      }
      starsRef.current = stars
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const stars = starsRef.current
      const mouse = mouseRef.current

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        star.y += star.speed
        if (star.y > canvas.height + 10) {
          star.y = -10
          star.x = Math.random() * canvas.width
        }

        star.opacity += Math.sin(time * star.twinkleSpeed) * 0.01

        const dx = star.x - mouse.x
        const dy = star.y - mouse.y
        const distance = dx * dx + dy * dy

        if (distance < 10000) {
          const dist = Math.sqrt(distance)
          const force = (100 - dist) / 100
          star.x += (dx / dist) * force * 2
          star.y += (dy / dist) * force * 2
          star.size = Math.min(star.size * (1 + force * 0.4), 3.5)
        } else {
          star.size = Math.max(star.size * 0.99, 0.4)
        }

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0

        const alpha = Math.max(0, Math.min(1, star.opacity))

        ctx.save()
        ctx.fillStyle = `hsla(${star.hue}, 70%, 85%, ${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `hsla(${star.hue}, 80%, 92%, ${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        if (i % 4 === 0) {
          for (let j = i + 1; j < stars.length; j++) {
            const other = stars[j]
            const dx = star.x - other.x
            const dy = star.y - other.y
            const dist = dx * dx + dy * dy
            if (dist < 10000) {
              const d = Math.sqrt(dist)
              const opacity = (100 - d) / 100 * 0.2
              ctx.strokeStyle = `hsla(${(star.hue + other.hue) / 2}, 60%, 70%, ${opacity})`
              ctx.lineWidth = 0.4
              ctx.beginPath()
              ctx.moveTo(star.x, star.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          }
        }
      }

      if (mouse.x && mouse.y) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80)
        gradient.addColorStop(0, `hsla(${getVariantHue(variant)}, 70%, 80%, 0.08)`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    initStars()
    window.addEventListener('mousemove', handleMouseMove)
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [variant])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 will-change-transform">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-800/10 to-transparent" />
    </div>
  )
}