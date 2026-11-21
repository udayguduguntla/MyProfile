import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import HashLinks from './components/HashLinks'
import JsonLd from './components/JsonLd'
import ScrollProgress from './components/ScrollProgress'
import SiteAnalytics from './components/SiteAnalytics'
import SmoothScroll from './components/SmoothScroll'
import { siteGraph } from '@/lib/structured-data'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['AI Engineer', 'NLP Developer', 'Python Engineer', 'RAG', 'Multi-Agent Systems', 'Next.js', 'FastAPI'],
  authors: [{ name: siteConfig.name, url: absoluteUrl('/') }],
  creator: siteConfig.name,
  alternates: { canonical: '/' },
  verification: { google: siteConfig.googleVerification },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
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
        <JsonLd data={siteGraph()} />
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <SmoothScroll>
          <HashLinks />
          <ScrollProgress />
          <main id="content" className="min-h-screen relative overflow-x-hidden">
            {children}
          </main>
        </SmoothScroll>
        <SiteAnalytics />
      </body>
    </html>
  )
}
