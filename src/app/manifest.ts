import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#2a0d0b',
    theme_color: '#2a0d0b',
    icons: [
      { src: '/images/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/images/favicon-g.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
  }
}
