import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/app/components/JsonLd'
import PageShell from '@/app/components/layout/PageShell'
import SystemGlyph from '@/app/components/SystemGlyph'
import { portfolioProjects, projectById, projectPath } from '@/data/projects'
import { indexableProjectIds, projectGraph } from '@/lib/structured-data'
import { projectActions, projectCaseStudy, projectNeighbors, projectStory, relatedProjects } from '@/lib/project-presentation'
import { absoluteUrl } from '@/lib/site-config'
import ProjectGallery from './components/ProjectGallery'

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
  const study = projectCaseStudy(project)
  const children = portfolioProjects.filter((item) => item.parentId === project.id)
  const story = projectStory(project)
  const neighbors = projectNeighbors(project)
  const related = relatedProjects(project)
  const actions = projectActions(project)

  return (
    <article className="min-h-screen py-12 text-cream sm:py-16">
      <PageShell>
        <JsonLd data={projectGraph(project)} />
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-3 text-sm text-sage">
          <Link href="/">Home</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/resume#projects">Projects</Link>
        </nav>
        <div className="mt-8 grid items-center gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-sage">{project.company} · {project.category} · {project.status}</p>
            <h1 className="mt-3 max-w-[18ch] font-serif text-[2.5rem] leading-tight sm:text-6xl">{project.title}</h1>
            <p className="prose-copy mt-5 max-w-[65ch] text-lg text-cream/85">{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {actions.map((action) => <a key={action.label} href={action.href} target="_blank" rel="noreferrer" className="rounded-full bg-cream px-4 py-2 font-semibold text-ink">{action.label}</a>)}
              <Link href={`/?project=${project.id}`} className="rounded-full border border-cream/30 px-4 py-2">Ask about this</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.8rem] border border-cream/15 bg-black/20 xl:max-w-[480px] xl:justify-self-end">
            {project.image.endsWith('.svg') ? <div className="h-64"><SystemGlyph type={project.visualType} /></div> : <img src={project.image} alt="" className="h-64 w-full object-cover sm:h-80" />}
          </div>
        </div>
        <dl className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Ownership', project.ownershipLabel],
            ['Context', project.context],
            ['Status', project.status],
            ['Stack', project.technologies.slice(0, 3).join(', ')],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 p-4">
              <dt className="text-xs uppercase tracking-[0.14em] text-sage">{label}</dt>
              <dd className="mt-2 text-base">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(44rem,1fr)_18rem]">
          <div className="space-y-10">
            {story.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-3xl sm:text-4xl">{section.title}</h2>
                <p className="prose-copy mt-3 max-w-[70ch] text-cream/85">{section.body}</p>
              </section>
            ))}
            <section>
              <h2 className="font-serif text-3xl sm:text-4xl">Architecture</h2>
              <ol className="prose-copy mt-4 space-y-3">
                {project.architecture.map((step, index) => <li key={step} className="rounded-2xl border border-white/10 px-4 py-3">{index + 1}. {step}</li>)}
              </ol>
            </section>
            <section>
              <h2 className="font-serif text-3xl sm:text-4xl">Workflow</h2>
              <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.workflow.map((step, index) => <li key={step} className="rounded-2xl bg-white/5 px-4 py-3">{index + 1}. {step}</li>)}
              </ol>
            </section>
            {study.outcomes.length > 0 && (
              <section>
                <h2 className="font-serif text-3xl sm:text-4xl">Outcomes</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">{study.outcomes.map((item) => <article key={item.title} className="rounded-2xl border border-white/10 p-4"><h3 className="text-xl">{item.title}</h3><p className="prose-copy mt-2 text-cream/80">{item.detail}</p></article>)}</div>
              </section>
            )}
            {project.features.length > 0 && <section><h2 className="font-serif text-3xl sm:text-4xl">Features</h2><ul className="prose-copy mt-4 list-disc space-y-2 pl-5">{project.features.map((item) => <li key={item}>{item}</li>)}</ul></section>}
            {study.constraints.length > 0 && <section><h2 className="font-serif text-3xl sm:text-4xl">Constraints</h2><ul className="prose-copy mt-4 list-disc space-y-2 pl-5">{study.constraints.map((item) => <li key={item}>{item}</li>)}</ul></section>}
            {study.learnings.length > 0 && <section><h2 className="font-serif text-3xl sm:text-4xl">Learnings</h2><ul className="prose-copy mt-4 list-disc space-y-2 pl-5">{study.learnings.map((item) => <li key={item}>{item}</li>)}</ul></section>}
            <ProjectGallery project={project} />
            {children.length > 0 && (
              <section>
                <h2 className="font-serif text-3xl sm:text-4xl">Modules in this work</h2>
                <div className="mt-4 grid gap-3">{children.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 p-4"><h3 className="text-xl">{item.title}</h3><p className="prose-copy mt-2 text-cream/80">{item.description}</p></article>)}</div>
              </section>
            )}
          </div>
          <aside className="h-fit rounded-[1.5rem] border border-white/10 p-5 xl:sticky xl:top-24">
            <h2 className="text-sm uppercase tracking-[0.16em] text-sage">Technologies</h2>
            <ul className="mt-3 flex flex-wrap gap-2">{project.technologies.map((item) => <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-sm">{item}</li>)}</ul>
          </aside>
        </div>
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-serif text-3xl">Related work</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">{related.map((item) => <Link key={item.id} href={projectPath(item.id)} className="rounded-2xl border border-white/10 p-4 hover:border-cream/40"><span className="text-xs text-sage">{item.company}</span><span className="mt-2 block text-xl">{item.shortName}</span></Link>)}</div>
          </section>
        )}
        <nav className="mt-10 flex justify-between gap-4 text-sm" aria-label="Project sequence">
          {neighbors.previous ? <Link href={projectPath(neighbors.previous.id)}>Previous: {neighbors.previous.shortName}</Link> : <span />}
          {neighbors.next ? <Link href={projectPath(neighbors.next.id)}>Next: {neighbors.next.shortName}</Link> : <span />}
        </nav>
      </PageShell>
    </article>
  )
}
