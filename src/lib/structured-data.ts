import { portfolioData } from '@/data/portfolio'
import { indexableProjects, projectPath, type PortfolioProject } from '@/data/projects'
import { absoluteUrl, siteConfig } from '@/lib/site-config'

function sameAs() {
  return [portfolioData.social.github, portfolioData.social.linkedin, portfolioData.social.leetcode, portfolioData.social.codechef]
}

export function siteGraph() {
  const personId = absoluteUrl('/#person')
  const websiteId = absoluteUrl('/#website')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: portfolioData.personal.name,
        jobTitle: portfolioData.personal.title,
        description: portfolioData.personal.description,
        url: absoluteUrl('/'),
        image: absoluteUrl(portfolioData.personal.avatar),
        email: portfolioData.contact.email,
        address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressCountry: 'IN' },
        sameAs: sameAs(),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteConfig.name,
        url: absoluteUrl('/'),
        description: siteConfig.description,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': absoluteUrl('/#profile'),
        url: absoluteUrl('/'),
        name: siteConfig.title,
        description: siteConfig.description,
        mainEntity: { '@id': personId },
        isPartOf: { '@id': websiteId },
      },
    ],
  }
}

export function projectGraph(project: PortfolioProject) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.shortName,
    description: project.description,
    url: absoluteUrl(projectPath(project.id)),
    creator: { '@id': absoluteUrl('/#person') },
    about: project.technologies,
    isPartOf: { '@id': absoluteUrl('/#website') },
  }
}

export function indexableProjectIds() {
  return indexableProjects().map((project) => project.id)
}
