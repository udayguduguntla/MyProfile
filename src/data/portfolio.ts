import profileJson from '@/content/profile.json'
import { portfolioProjects, type PortfolioProject } from '@/data/projects'
import { portfolioContentSchema, type SiteContent } from '@/lib/content-schema'

export type Project = PortfolioProject
export type PortfolioContent = Omit<SiteContent, 'projects'>

const profile = portfolioContentSchema.parse(profileJson)

export const portfolioData = {
  ...profile,
  projects: portfolioProjects,
}

export const hasPublicUrl = (url?: string) => Boolean(url && url !== '#' && /^https?:\/\//.test(url))
