'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  ox: number
  oy: number
  baseSize: number
  opacity: number
  speed: number
  twinkle: number
}

interface InteractiveStarBackgroundProps {
  variant?: 'default' | 'projects' | 'about' | 'achievements' | 'contact'
}

const glowByVariant = {
  default: { cream: 0.22, sage: 0.1, radius: 260 },
  projects: { cream: 0.26, sage: 0.12, radius: 280 },
  about: { cream: 0.18, sage: 0.14, radius: 240 },
  achievements: { cream: 0.24, sage: 0.08, radius: 250 },
  contact: { cream: 0.2, sage: 0.16, radius: 270 },
}

export default function InteractiveStarBackground({ variant = 'default' }: InteractiveStarBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const starsRef = useRef<Star[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const pointerRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)')
    let running = true
    const glow = glowByVariant[variant]

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      initStars()
    }

    const initStars = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const density = width < 768 ? 18000 : 11000
      const count = Math.min(width < 768 ? 48 : 90, Math.floor((width * height) / density))
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        ox: 0,
        oy: 0,
        baseSize: Math.random() * 1.4 + 0.45,
        opacity: Math.random() * 0.45 + 0.25,
        speed: Math.random() * 0.22 + 0.04,
        twinkle: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (time: number) => {
      const width = window.innerWidth
      const height = window.innerHeight
      ctx.clearRect(0, 0, width, height)
      const pointer = pointerRef.current
      const target = mouseRef.current
      if (target.active) {
        pointer.x += (target.x - pointer.x) * 0.12
        pointer.y += (target.y - pointer.y) * 0.12
      }

      const stars = starsRef.current
      const glowing: Array<{ star: Star; influence: number }> = []
      for (const star of stars) {
        if (!motionQuery.matches) {
          star.y += star.speed
          if (star.y > height + 8) {
            star.y = -8
            star.x = Math.random() * width
            star.ox = 0
            star.oy = 0
          }
        }

        const dx = star.x - pointer.x
        const dy = star.y - pointer.y
        const distance = Math.hypot(dx, dy)
        const reach = 340
        const proximity = target.active ? Math.max(0, 1 - distance / reach) : 0
        const influence = proximity ** 1.35
        const canRepel = target.active && finePointer.matches && !motionQuery.matches && distance > 0.5 && distance < reach
        const push = canRepel ? influence * influence * 58 : 0
        const targetOx = canRepel ? (dx / distance) * push : 0
        const targetOy = canRepel ? (dy / distance) * push : 0
        if (!motionQuery.matches) {
          star.ox += (targetOx - star.ox) * 0.12
          star.oy += (targetOy - star.oy) * 0.12
          if (!target.active && Math.hypot(star.ox, star.oy) < 0.25) {
            star.ox = 0
            star.oy = 0
          }
        }
        const drawX = star.x + star.ox
        const drawY = star.y + star.oy
        const alpha = Math.min(1, star.opacity + Math.sin(time * 0.002 + star.twinkle) * 0.08 + influence * 0.7)
        const size = star.baseSize * (1 + influence * 2.1)

        ctx.fillStyle = `rgba(232, 210, 181, ${alpha})`
        ctx.beginPath()
        ctx.arc(drawX, drawY, size, 0, Math.PI * 2)
        ctx.fill()

        if (influence > 0.08) {
          glowing.push({ star: { ...star, x: drawX, y: drawY }, influence })
          ctx.fillStyle = `rgba(165, 167, 155, ${influence * 0.4})`
          ctx.beginPath()
          ctx.arc(drawX, drawY, size * (2.2 + influence * 2), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (target.active && finePointer.matches && !motionQuery.matches) {
        for (let i = 0; i < glowing.length; i += 1) {
          let links = 0
          for (let j = i + 1; j < glowing.length && links < 3; j += 1) {
            const a = glowing[i]
            const b = glowing[j]
            const dx = a.star.x - b.star.x
            const dy = a.star.y - b.star.y
            const distance = Math.hypot(dx, dy)
            if (distance <= 0 || distance > 190) continue
            const strength = (1 - distance / 190) * Math.min(a.influence, b.influence)
            ctx.strokeStyle = `rgba(89, 9, 7, ${strength * 0.55})`
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.moveTo(a.star.x, a.star.y)
            ctx.lineTo(b.star.x, b.star.y)
            ctx.stroke()
            ctx.strokeStyle = `rgba(165, 167, 155, ${strength * 0.55})`
            ctx.lineWidth = 1.6
            ctx.stroke()
            ctx.strokeStyle = `rgba(232, 210, 181, ${strength * 0.9})`
            ctx.lineWidth = 0.8
            ctx.stroke()
            links += 1
          }
        }
      }

      if (target.active && pointer.x > -1000) {
        const outer = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, glow.radius)
        outer.addColorStop(0, `rgba(232, 210, 181, ${glow.cream})`)
        outer.addColorStop(0.34, `rgba(165, 167, 155, ${glow.sage})`)
        outer.addColorStop(0.72, 'rgba(89, 9, 7, 0.05)')
        outer.addColorStop(1, 'transparent')
        ctx.fillStyle = outer
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, glow.radius, 0, Math.PI * 2)
        ctx.fill()

        const core = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 42)
        core.addColorStop(0, 'rgba(232, 210, 181, 0.72)')
        core.addColorStop(1, 'transparent')
        ctx.fillStyle = core
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, 42, 0, Math.PI * 2)
        ctx.fill()
      }

      if (running && !motionQuery.matches) {
        animationRef.current = requestAnimationFrame(draw)
      }
    }

    const onMove = (event: PointerEvent) => {
      if (!finePointer.matches) return
      mouseRef.current = { x: event.clientX, y: event.clientY, active: true }
      if (pointerRef.current.x < -1000) pointerRef.current = { x: event.clientX, y: event.clientY }
    }
    const onLeave = () => {
      mouseRef.current.active = false
    }
    const onVisibility = () => {
      running = document.visibilityState === 'visible'
      if (running && !motionQuery.matches) animationRef.current = requestAnimationFrame(draw)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    animationRef.current = requestAnimationFrame(draw)
    if (motionQuery.matches) draw(0)

    return () => {
      running = false
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [variant])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,210,181,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(165,167,155,0.08),transparent_34%)]" />
    </div>
  )
}
