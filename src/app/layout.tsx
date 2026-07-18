import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from './components/SmoothScroll'
import ScrollProgress from './components/ScrollProgress'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: 'Uday Kumar Guduguntla | AI Engineer',
  description: 'Chat-first AI portfolio for Uday Kumar Guduguntla, NLP Developer and Python Engineer.',
  keywords: 'AI Engineer, NLP Developer, Python Engineer, RAG, Multi-Agent Systems, Next.js, FastAPI',
  authors: [{ name: 'Uday Kumar Guduguntla' }],
  creator: 'Uday Kumar Guduguntla',
  openGraph: {
    title: 'Uday Kumar Guduguntla | AI Engineer',
    description: 'Chat-first AI portfolio for Uday Kumar Guduguntla, NLP Developer and Python Engineer.',
    url: 'https://udayguduguntla.com',
    siteName: 'Uday Kumar Portfolio',
    images: [
      {
        url: '/images/profilePic.jpg',
        width: 800,
        height: 600,
        alt: 'Uday Kumar Guduguntla',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uday Kumar Guduguntla | AI Engineer',
    description: 'Chat-first AI portfolio for Uday Kumar Guduguntla, NLP Developer and Python Engineer.',
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
      <body className={inter.className}>
        <SmoothScroll>
          <ScrollProgress />
          <main className="min-h-screen relative overflow-x-hidden">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  )
}
