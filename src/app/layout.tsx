import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from './components/Footer'
import dynamic from 'next/dynamic'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: 'Uday Kumar Guduguntla - Full Stack Developer & AI Innovator',
  description: 'Passionate Full Stack Developer specializing in AI/ML, Computer Vision, and Accessibility Technology',
  keywords: 'Full Stack Developer, AI, Machine Learning, Computer Vision, Accessibility Technology, React, Python, Flask',
  authors: [{ name: 'Uday Kumar Guduguntla' }],
  creator: 'Uday Kumar Guduguntla',
  openGraph: {
    title: 'Uday Kumar Guduguntla - Full Stack Developer & AI Innovator',
    description: 'Passionate Full Stack Developer specializing in AI/ML, Computer Vision, and Accessibility Technology',
    url: 'https://udayguduguntla.com',
    siteName: 'Uday Kumar Portfolio',
    images: [
      {
        url: '/assets/images/profilePic.jpg',
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
    title: 'Uday Kumar Guduguntla - Full Stack Developer & AI Innovator',
    description: 'Passionate Full Stack Developer specializing in AI/ML, Computer Vision, and Accessibility Technology',
    images: ['/assets/images/profilePic.jpg'],
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
        <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
        <link rel="alternate icon" href="/assets/images/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
      </head>
      <body className={`${inter.className}`}>
        <main className="min-h-screen relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
