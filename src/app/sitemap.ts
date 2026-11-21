import type { MetadataRoute } from 'next'
import { publicRoutes } from '@/lib/public-routes'
import { absoluteUrl } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-11-21')
  return publicRoutes().map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
