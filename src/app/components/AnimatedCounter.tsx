'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: string
  className?: string
}

export default function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  const numeric = parseInt(value.replace(/[^0-9]/g, ''))
  const suffix = value.replace(/[0-9,]/g, '')
  const isNumeric = !isNaN(numeric)

  useEffect(() => {
    if (!isNumeric || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1200
          const steps = 30
          const increment = numeric / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= numeric) {
              setDisplay(value)
              clearInterval(timer)
            } else {
              setDisplay(Math.floor(current).toLocaleString() + suffix)
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [numeric, suffix, value, isNumeric])

  if (!isNumeric) {
    return <span className={className}>{value}</span>
  }

  return <span ref={ref} className={className}>{display}</span>
}
