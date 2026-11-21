import type { NextConfig } from 'next'
import { siteConfig } from './src/lib/site-config'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.11.43', '192.168.13.244'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  async redirects() {
    return siteConfig.legacyHosts.map((host) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: host }],
      destination: `${siteConfig.url}/:path*`,
      permanent: true,
    }))
  },
  async headers() {
    const noindex = [{ key: 'X-Robots-Tag', value: 'noindex' }]
    return [
      { source: '/api/:path*', headers: noindex },
      { source: '/google6db81e69d0cb427f.html', headers: noindex },
      { source: '/resume/Uday.pdf', headers: noindex },
    ]
  },
}

export default nextConfig
