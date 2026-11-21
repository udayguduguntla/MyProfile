import { indexableProjects, projectPath, type PortfolioProject } from '@/data/projects'
import { emptyCaseStudy } from '@/lib/content-schema'

export type ProjectSection = { title: string; body: string }

export function projectCaseStudy(project: PortfolioProject) {
  return project.caseStudy ?? emptyCaseStudy()
}

export function projectActions(project: PortfolioProject) {
  return [
    project.github.startsWith('http') ? { label: 'GitHub', href: project.github } : null,
    project.workingUrl.startsWith('http') ? { label: 'Demo', href: project.workingUrl } : null,
    project.readmeUrl.startsWith('http') ? { label: 'Readme', href: project.readmeUrl } : null,
  ].filter((item): item is { label: string; href: string } => Boolean(item))
}

export function projectStory(project: PortfolioProject): ProjectSection[] {
  const study = projectCaseStudy(project)
  return [
    { title: 'Challenge', body: project.problem },
    { title: 'Value', body: project.businessValue },
    { title: 'My contribution', body: `${project.contribution} ${project.ownershipLabel}`.trim() },
    project.safeguards ? { title: 'Scope', body: project.safeguards } : null,
    ...study.approach.map((section) => ({ title: section.title, body: section.body })),
    study.approach.length === 0 ? { title: 'How it works', body: project.chatDetail } : null,
  ].filter((section): section is ProjectSection => Boolean(section))
}

export function relatedProjects(project: PortfolioProject) {
  return indexableProjects()
    .filter((item) => item.id !== project.id && (item.company === project.company || item.category === project.category))
    .slice(0, 3)
}

export function projectNeighbors(project: PortfolioProject) {
  const projects = indexableProjects()
  const index = projects.findIndex((item) => item.id === project.id)
  return {
    previous: index > 0 ? projects[index - 1] : undefined,
    next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : undefined,
  }
}

export function projectHref(project: PortfolioProject) {
  return project.visibility === 'module' && project.parentId ? projectPath(project.parentId) : projectPath(project.id)
}
