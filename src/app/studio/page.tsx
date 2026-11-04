import type { Metadata } from 'next'
import { auth, isOwnerLogin, signIn, signOut } from '@/auth'
import profileJson from '@/content/profile.json'
import projectsJson from '@/content/projects.json'
import { portfolioContentSchema, projectSchema } from '@/lib/content-schema'
import StudioEditor from './StudioEditor'

export const metadata: Metadata = {
  title: 'Owner studio',
  robots: { index: false, follow: false },
}

export default async function StudioPage() {
  const session = await auth()
  const owner = isOwnerLogin(session?.user?.login)
  const configured = Boolean(process.env.AUTH_SECRET && process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET && process.env.ADMIN_GITHUB_LOGIN)

  if (!owner) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 text-cream">
        <p className="text-xs uppercase tracking-[0.18em] text-sage">Private</p>
        <h1 className="mt-3 font-serif text-5xl">Owner studio</h1>
        <p className="mt-4 text-sm leading-relaxed text-cream/75">
          This address is not linked from the public site. Opening it does not grant editing or publishing access.
        </p>
        {configured ? (
          <form className="mt-8" action={async () => { 'use server'; await signIn('github', { redirectTo: '/studio' }) }}>
            <button type="submit" className="rounded-full bg-cream px-5 py-3 text-sm font-semibold text-ink">Continue with GitHub</button>
          </form>
        ) : (
          <p className="mt-8 text-sm text-sage">GitHub sign-in is not configured on this deployment.</p>
        )}
      </main>
    )
  }

  const profile = portfolioContentSchema.parse(profileJson)
  const projects = projectSchema.array().parse(projectsJson)

  return (
    <main className="min-h-screen bg-[#2a0d0b] text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-sage">Signed in as {session?.user?.login}</p>
          <h1 className="font-serif text-4xl">Owner studio</h1>
        </div>
        <form action={async () => { 'use server'; await signOut({ redirectTo: '/studio' }) }}>
          <button type="submit" className="rounded-full border border-cream/30 px-4 py-2 text-sm">Sign out</button>
        </form>
      </div>
      <StudioEditor initialProfile={profile} initialProjects={projects} />
    </main>
  )
}
