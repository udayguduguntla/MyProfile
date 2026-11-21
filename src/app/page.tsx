import { Suspense } from 'react'
import AIPortfolioChat from './components/AIPortfolioChat'
import { portfolioData } from '@/data/portfolio'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <h1 className="sr-only">{portfolioData.personal.name}, {portfolioData.personal.title}</h1>
      <p className="sr-only">{portfolioData.personal.description} The full record is on the resume page.</p>
      <Suspense fallback={null}>
        <AIPortfolioChat />
      </Suspense>
    </div>
  )
}
