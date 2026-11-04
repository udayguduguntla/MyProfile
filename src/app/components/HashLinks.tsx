'use client'

import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

export default function HashLinks() {
  const lenis = useLenis()

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a[href^="#"]')
      if (!(link instanceof HTMLAnchorElement)) return
      const id = link.getAttribute('href')?.slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      event.preventDefault()
      if (lenis) lenis.scrollTo(target, { offset: -88 })
      else target.scrollIntoView({ block: 'start' })
      history.replaceState(null, '', `#${id}`)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

  return null
}
