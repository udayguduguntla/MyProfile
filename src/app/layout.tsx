import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import SmoothScroll from './components/SmoothScroll'
import ScrollProgress from './components/ScrollProgress'
import HashLinks from './components/HashLinks'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Uday Kumar Guduguntla | AI Engineer',
  description: 'AI engineer portfolio covering ontology, semantic layers, conversational systems, and Python automation.',
  keywords: 'AI Engineer, NLP Developer, Python Engineer, RAG, Multi-Agent Systems, Next.js, FastAPI',
  authors: [{ name: 'Uday Kumar Guduguntla' }],
  creator: 'Uday Kumar Guduguntla',
  openGraph: {
    title: 'Uday Kumar Guduguntla | AI Engineer',
    description: 'AI engineer portfolio covering ontology, semantic layers, conversational systems, and Python automation.',
    url: 'https://udayguduguntla.com',
    siteName: 'Uday Kumar Portfolio',
    images: [{ url: '/images/profilePic.jpg', width: 460, height: 460, alt: 'Uday Kumar Guduguntla' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uday Kumar Guduguntla | AI Engineer',
    description: 'AI engineer portfolio covering ontology, semantic layers, conversational systems, and Python automation.',
    images: ['/images/profilePic.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <link rel="alternate icon" href="/images/favicon-g.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} ${instrumentSerif.variable}`}>
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <SmoothScroll>
          <HashLinks />
          <ScrollProgress />
          <main id="content" className="min-h-screen relative overflow-x-hidden">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  )
}
