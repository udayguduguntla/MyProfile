import type { Metadata } from 'next'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Experience, projects, education, and writing for Uday Kumar Guduguntla, an AI engineer in Chennai.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: `Resume | ${siteConfig.name}`,
    description: 'Experience, projects, education, and writing for Uday Kumar Guduguntla.',
    url: absoluteUrl('/resume'),
    type: 'profile',
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
