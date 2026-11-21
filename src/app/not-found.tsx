import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 text-cream">
      <p className="text-xs uppercase tracking-[0.18em] text-sage">404</p>
      <h1 className="mt-3 font-serif text-5xl">This page is not on the site.</h1>
      <p className="mt-4 text-sm leading-relaxed text-cream/75">The address does not match a public page.</p>
      <div className="mt-8 flex gap-3 text-sm">
        <Link href="/" className="rounded-full bg-cream px-4 py-2 font-semibold text-ink">Home</Link>
        <Link href="/resume" className="rounded-full border border-cream/30 px-4 py-2">Resume</Link>
      </div>
    </main>
  )
}
