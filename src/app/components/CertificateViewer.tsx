'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLenis } from 'lenis/react'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

const MIN_ZOOM = 0.85
const MAX_ZOOM = 3.2

export default function CertificateViewer({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lenis = useLenis()
  const docRef = useRef<PDFDocumentProxy | null>(null)
  const renderTask = useRef<RenderTask | null>(null)
  const view = useRef({ scale: 1, x: 0, y: 0, fitWidth: 0, fitHeight: 0 })
  const gesture = useRef<{ mode: 'undecided' | 'zoom' | 'pan' | 'pinch'; x: number; y: number; dist: number } | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')

  const layout = useCallback(() => {
    const canvas = canvasRef.current
    const { scale, x, y, fitWidth, fitHeight } = view.current
    if (!canvas || !fitWidth) return
    canvas.style.width = `${fitWidth * scale}px`
    canvas.style.height = `${fitHeight * scale}px`
    canvas.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
  }, [])

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    const stage = stageRef.current
    if (!stage) return
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.current.scale * factor))
    const ratio = next / view.current.scale
    if (ratio === 1) return
    const rect = stage.getBoundingClientRect()
    const cx = clientX - rect.left - rect.width / 2
    const cy = clientY - rect.top - rect.height / 2
    view.current.x = cx * (1 - ratio) + view.current.x * ratio
    view.current.y = cy * (1 - ratio) + view.current.y * ratio
    view.current.scale = next
    layout()
  }, [layout])

  useEffect(() => {
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    const page = document.querySelector('[data-resume-root]')
    document.body.dataset.portfolioModal = 'open'
    page?.setAttribute('inert', '')
    html.style.overflow = 'hidden'
    lenis?.stop()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      delete document.body.dataset.portfolioModal
      page?.removeAttribute('inert')
      html.style.overflow = previousOverflow
      lenis?.start()
      window.removeEventListener('keydown', onKey)
      void docRef.current?.destroy()
    }
  }, [lenis, onClose])

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    let cancelled = false
    const draw = async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
        const doc = await pdfjs.getDocument(src).promise
        if (cancelled) {
          await doc.destroy()
          return
        }
        docRef.current = doc
        const page = await doc.getPage(1)
        const base = page.getViewport({ scale: 1 })
        const fit = Math.min((stage.clientWidth - 48) / base.width, (stage.clientHeight - 48) / base.height)
        const longer = Math.max(base.width, base.height)
        const renderScale = Math.min(fit * MAX_ZOOM * Math.min(window.devicePixelRatio || 1, 2), 2200 / longer)
        const viewport = page.getViewport({ scale: renderScale })
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        const context = canvas.getContext('2d')
        if (!context) throw new Error('canvas')
        view.current.fitWidth = base.width * fit
        view.current.fitHeight = base.height * fit
        layout()
        if (cancelled) return
        renderTask.current?.cancel()
        const task = page.render({ canvasContext: context, viewport })
        renderTask.current = task
        setStatus('ready')
        await task.promise
      } catch (error) {
        const cancelledRender = error instanceof Error && /cancel/i.test(error.message)
        if (!cancelled && !cancelledRender) setStatus('failed')
      }
    }
    void draw()
    return () => {
      cancelled = true
      renderTask.current?.cancel()
    }
  }, [layout, src])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      zoomAt(event.clientX, event.clientY, Math.exp(-event.deltaY * 0.0015))
    }
    const onTouchMove = (event: TouchEvent) => {
      const current = gesture.current
      if (!current) return
      event.preventDefault()
      if (event.touches.length === 2) {
        const [a, b] = [event.touches[0], event.touches[1]]
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
        const midX = (a.clientX + b.clientX) / 2
        const midY = (a.clientY + b.clientY) / 2
        if (current.dist) zoomAt(midX, midY, dist / current.dist)
        view.current.x += midX - current.x
        view.current.y += midY - current.y
        current.dist = dist
        current.x = midX
        current.y = midY
        current.mode = 'pinch'
        layout()
        return
      }
      const touch = event.touches[0]
      const dx = touch.clientX - current.x
      const dy = touch.clientY - current.y
      if (current.mode === 'undecided') {
        if (Math.hypot(dx, dy) < 8) return
        current.mode = Math.abs(dy) >= Math.abs(dx) ? 'zoom' : 'pan'
      }
      if (current.mode === 'zoom') zoomAt(touch.clientX, touch.clientY, Math.exp(-dy * 0.0045))
      if (current.mode === 'pan') {
        view.current.x += dx
        view.current.y += dy
        layout()
      }
      current.x = touch.clientX
      current.y = touch.clientY
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    stage.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      stage.removeEventListener('wheel', onWheel)
      stage.removeEventListener('touchmove', onTouchMove)
    }
  }, [layout, zoomAt])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = { mode: 'pan', x: event.clientX, y: event.clientY, dist: 0 }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = gesture.current
    if (!current || current.mode !== 'pan' || event.pointerType === 'touch') return
    view.current.x += event.clientX - current.x
    view.current.y += event.clientY - current.y
    current.x = event.clientX
    current.y = event.clientY
    layout()
  }

  const endPointer = () => {
    if (gesture.current?.mode === 'pan') gesture.current = null
  }

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]]
      gesture.current = {
        mode: 'pinch',
        x: (a.clientX + b.clientX) / 2,
        y: (a.clientY + b.clientY) / 2,
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      }
      return
    }
    const touch = event.touches[0]
    gesture.current = { mode: 'undecided', x: touch.clientX, y: touch.clientY, dist: 0 }
  }

  const dialog = (
    <div className="fixed inset-0 z-[80] bg-[#140403]" data-lenis-prevent>
      <div
        ref={stageRef}
        className="absolute inset-0 cursor-grab overflow-hidden bg-[radial-gradient(ellipse_at_center,#3a1210_0%,#140403_68%)] active:cursor-grabbing"
        data-lenis-prevent
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onTouchStart={onTouchStart}
        onTouchEnd={() => { gesture.current = null }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <canvas ref={canvasRef} className={`absolute left-1/2 top-1/2 max-w-none shadow-[0_30px_80px_rgba(0,0,0,0.45)] ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`} />
        {status !== 'ready' && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-cream/70">
            {status === 'failed' ? 'The certificate could not be opened.' : 'Opening the certificate'}
          </p>
        )}
      </div>
      <button type="button" aria-label="Close certificate" onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 bg-[#140403]/70 text-lg text-cream">×</button>
    </div>
  )

  return createPortal(dialog, document.body)
}
