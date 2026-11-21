import { indexableProjects, projectPath } from '@/data/projects'

export type PublicRoute = {
  path: '/' | '/resume' | `/projects/${string}`
  changeFrequency: 'weekly' | 'monthly'
  priority: number
}

export function publicRoutes(): PublicRoute[] {
  return [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/resume', changeFrequency: 'monthly', priority: 0.8 },
    ...indexableProjects().map((project) => ({
      path: projectPath(project.id) as `/projects/${string}`,
      changeFrequency: 'monthly' as const,
      priority: project.visibility === 'featured' ? 0.7 : 0.5,
    })),
  ]
}
