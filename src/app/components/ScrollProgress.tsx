'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-purple-500 via-violet-400 to-purple-500 origin-left"
      style={{ scaleX }}
    />
  )
}
