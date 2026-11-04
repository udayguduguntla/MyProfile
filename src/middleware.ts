import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((request) => {
  const path = request.nextUrl.pathname
  const login = request.auth?.user?.login
  const allowed = Boolean(process.env.ADMIN_GITHUB_LOGIN && login === process.env.ADMIN_GITHUB_LOGIN)
  if (path.startsWith('/api/studio') && !allowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/studio/:path*', '/api/studio/:path*'],
}
