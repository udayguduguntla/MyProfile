import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site-config'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', height: '100%', width: '100%', background: '#2a0d0b', color: '#e8d2b5', padding: 72, flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', color: '#a5a79b' }}>AI Engineer</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, lineHeight: 1.05 }}>{siteConfig.name}</div>
          <div style={{ marginTop: 24, fontSize: 32, color: '#f6efe4' }}>Retrieval, agents, and Python automation</div>
        </div>
        <div style={{ fontSize: 24, color: '#a5a79b' }}>uday-guduguntla.vercel.app</div>
      </div>
    ),
    size,
  )
}
