import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/app/components/JsonLd'
import SystemGlyph from '@/app/components/SystemGlyph'
import { portfolioProjects, projectById, projectPath } from '@/data/projects'
import { indexableProjectIds, projectGraph } from '@/lib/structured-data'
import { absoluteUrl } from '@/lib/site-config'

type PageProps = { params: Promise<{ id: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return indexableProjectIds().map((id) => ({ id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const project = projectById(id)
  if (!project || project.visibility === 'module') return { title: 'Project not found', robots: { index: false, follow: false } }
  const path = projectPath(project.id)
  return {
    title: project.shortName,
    description: project.description,
    alternates: { canonical: path },
    openGraph: {
      title: project.title,
      description: project.description,
      url: absoluteUrl(path),
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params
  const project = projectById(id)
  if (!project || project.visibility === 'module') notFound()
  const related = portfolioProjects.filter((item) => item.parentId === project.id)

  return (
    <article className="mx-auto min-h-screen max-w-3xl px-4 py-16 text-cream sm:px-6">
      <JsonLd data={projectGraph(project)} />
      <nav className="flex flex-wrap gap-3 text-sm text-sage">
        <Link href="/">Home</Link>
        <Link href="/resume">Resume</Link>
        <Link href="/resume#projects">All projects</Link>
      </nav>
      <p className="mt-8 text-xs uppercase tracking-[0.18em] text-sage">{project.company} · {project.category}</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight">{project.title}</h1>
      <p className="mt-4 text-lg text-cream/80">{project.description}</p>
      <div className="mt-8 h-36 overflow-hidden rounded-[1.5rem] border border-cream/15">
        <SystemGlyph type={project.visualType} />
      </div>
      <section className="mt-10">
        <h2 className="font-serif text-3xl">Problem</h2>
        <p className="mt-3 leading-relaxed text-cream/80">{project.problem}</p>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-3xl">What I owned</h2>
        <p className="mt-3 leading-relaxed text-cream/80">{project.contribution}</p>
        <p className="mt-3 text-sm text-sage">{project.ownershipLabel}</p>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-3xl">How it works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-cream/80">
          {project.architecture.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p className="mt-4 leading-relaxed text-cream/80">{project.chatDetail}</p>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-3xl">Technologies</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.technologies.map((item) => <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-sm">{item}</li>)}
        </ul>
      </section>
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-3xl">Modules in this work</h2>
          <ul className="mt-3 space-y-3">
            {related.map((item) => (
              <li key={item.id}>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-cream/75">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {project.safeguards && <p className="mt-8 text-sm text-sage">{project.safeguards}</p>}
    </article>
  )
}
