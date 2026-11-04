'use client'

import { Suspense } from 'react'
import AIPortfolioChat from './components/AIPortfolioChat'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Suspense fallback={null}>
        <AIPortfolioChat />
      </Suspense>
    </div>
  )
}
