'use client'

import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MagneticProps {
  children: ReactNode
  className?: string
}

export default function Magnetic({ children, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ transition: 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)' }}
    >
      {children}
    </motion.div>
  )
}
