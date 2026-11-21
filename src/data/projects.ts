import projectsJson from '@/content/projects.json'
import { projectSchema, type SiteContent } from '@/lib/content-schema'

export type PortfolioProject = SiteContent['projects'][number]
export type ProjectVisibility = PortfolioProject['visibility']
export type ProjectOwnership = PortfolioProject['ownership']

export const portfolioProjects: PortfolioProject[] = projectSchema.array().parse(projectsJson)

export function projectById(id?: string | null) {
  return portfolioProjects.find((project) => project.id === id)
}

export function indexableProjects() {
  return portfolioProjects.filter((project) => project.visibility !== 'module')
}

export function projectPath(id: string) {
  return `/projects/${id}`
}
