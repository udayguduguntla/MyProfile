import type { ReactNode } from 'react'
import type { PortfolioProject } from '@/data/projects'

type VisualType = PortfolioProject['visualType']

const ink = '#E8D2B5'
const sage = '#A5A79B'
const wine = '#8f3a32'

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 160 96" className="h-full w-full" aria-hidden="true">
      <rect x="1" y="1" width="158" height="94" rx="16" fill="#2a0d0b" stroke="rgba(232,210,181,0.28)" />
      {children}
    </svg>
  )
}

function nodes(type: VisualType) {
  if (type === 'rag') {
    return (
      <>
        <rect x="16" y="28" width="34" height="40" rx="6" fill="none" stroke={ink} />
        <path d="M24 40h18M24 48h14M24 56h16" stroke={sage} />
        <path d="M50 48h22" stroke={ink} />
        <circle cx="86" cy="48" r="14" fill="none" stroke={ink} />
        <path d="M100 48h18" stroke={ink} />
        <rect x="118" y="34" width="26" height="28" rx="6" fill="none" stroke={wine} />
      </>
    )
  }
  if (type === 'conversation') {
    return (
      <>
        <rect x="18" y="22" width="46" height="22" rx="8" fill="none" stroke={ink} />
        <rect x="96" y="22" width="46" height="22" rx="8" fill="none" stroke={sage} />
        <rect x="40" y="54" width="80" height="22" rx="8" fill="none" stroke={wine} />
        <path d="M41 44v10M119 44v10" stroke={ink} />
      </>
    )
  }
  if (type === 'graph') {
    return (
      <>
        <circle cx="36" cy="30" r="8" fill="none" stroke={ink} />
        <circle cx="78" cy="24" r="8" fill="none" stroke={sage} />
        <circle cx="120" cy="36" r="8" fill="none" stroke={ink} />
        <circle cx="58" cy="68" r="8" fill="none" stroke={wine} />
        <circle cx="108" cy="70" r="8" fill="none" stroke={sage} />
        <path d="M44 32l26-6M86 26l26 8M42 36l12 26M66 64l34 4M114 42l-4 20" stroke={ink} />
      </>
    )
  }
  if (type === 'semantic') {
    return (
      <>
        <rect x="18" y="20" width="124" height="16" rx="4" fill="none" stroke={sage} />
        <path d="M40 36v12M80 36v12M120 36v12" stroke={ink} />
        <rect x="22" y="48" width="36" height="28" rx="6" fill="none" stroke={ink} />
        <rect x="62" y="48" width="36" height="28" rx="6" fill="none" stroke={wine} />
        <rect x="102" y="48" width="36" height="28" rx="6" fill="none" stroke={sage} />
      </>
    )
  }
  if (type === 'agent') {
    return (
      <>
        <circle cx="80" cy="28" r="10" fill="none" stroke={ink} />
        <path d="M80 38v10" stroke={ink} />
        <rect x="48" y="48" width="64" height="14" rx="4" fill="none" stroke={wine} />
        <path d="M58 62v10M80 62v10M102 62v10" stroke={sage} />
        <circle cx="58" cy="78" r="5" fill="none" stroke={ink} />
        <circle cx="80" cy="78" r="5" fill="none" stroke={ink} />
        <circle cx="102" cy="78" r="5" fill="none" stroke={ink} />
      </>
    )
  }
  if (type === 'data') {
    return (
      <>
        <ellipse cx="46" cy="30" rx="22" ry="8" fill="none" stroke={ink} />
        <path d="M24 30v28c0 5 10 8 22 8s22-3 22-8V30" fill="none" stroke={ink} />
        <path d="M24 42c0 5 10 8 22 8s22-3 22-8" fill="none" stroke={sage} />
        <path d="M90 48h18" stroke={wine} />
        <rect x="108" y="28" width="34" height="40" rx="6" fill="none" stroke={sage} />
      </>
    )
  }
  if (type === 'vision') {
    return (
      <>
        <circle cx="80" cy="48" r="22" fill="none" stroke={ink} />
        <circle cx="80" cy="48" r="8" fill="none" stroke={wine} />
        <path d="M80 18v8M80 70v8M50 48h-8M118 48h8" stroke={sage} />
      </>
    )
  }
  if (type === 'ocr') {
    return (
      <>
        <rect x="28" y="18" width="104" height="60" rx="6" fill="none" stroke={ink} />
        <path d="M40 36h48M40 48h36M40 60h42" stroke={sage} />
        <rect x="100" y="34" width="20" height="28" fill="none" stroke={wine} />
      </>
    )
  }
  return (
    <>
      <rect x="18" y="34" width="28" height="28" rx="6" fill="none" stroke={ink} />
      <path d="M46 48h16" stroke={sage} />
      <rect x="62" y="34" width="28" height="28" rx="6" fill="none" stroke={wine} />
      <path d="M90 48h16" stroke={sage} />
      <rect x="106" y="34" width="28" height="28" rx="6" fill="none" stroke={ink} />
    </>
  )
}

export default function SystemGlyph({ type }: { type: VisualType }) {
  return <Frame>{nodes(type)}</Frame>
}
