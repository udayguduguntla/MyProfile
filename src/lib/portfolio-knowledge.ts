import { fallbackArticles } from '@/data/articles'
import { portfolioData } from '@/data/portfolio'
import { portfolioProjects } from '@/data/projects'

export type Passage = {
  id: string
  title: string
  text: string
  keywords: string[]
  score: number
}

const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'are', 'was', 'what', 'how', 'did', 'does', 'about', 'tell', 'can'])

function tokens(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9+.#]+/)
    .filter((token) => token.length > 2 && !stopWords.has(token))
}

function passage(id: string, title: string, text: string, keywords: string[]): Passage {
  return { id, title, text: text.replace(/\s+/g, ' ').trim(), keywords, score: 0 }
}

export function knowledgePassages(): Passage[] {
  const personal = portfolioData.personal
  const items: Passage[] = [
    passage(
      'profile',
      personal.name,
      `${personal.name} is an ${personal.title} based in ${personal.location}. ${personal.description} ${personal.tagline}`,
      ['about', 'profile', 'uday', 'engineer', 'chennai'],
    ),
    passage(
      'skills',
      'Skills',
      Object.entries(portfolioData.skills).map(([group, values]) => `${group}: ${values.join(', ')}.`).join(' '),
      ['skills', 'stack', 'python', 'langchain', 'neo4j'],
    ),
    passage(
      'contact',
      'Contact',
      `Email ${portfolioData.contact.email}. ${portfolioData.contact.availability} Location: ${portfolioData.contact.location}. GitHub ${portfolioData.social.github}. LinkedIn ${portfolioData.social.linkedin}.`,
      ['contact', 'email', 'linkedin', 'github', 'hire'],
    ),
  ]

  for (const role of portfolioData.experience) {
    const client = role.clientAssignment
      ? ` ${role.clientAssignment.client} (${role.clientAssignment.period}, ${role.clientAssignment.location}): ${role.clientAssignment.summary}`
      : ''
    items.push(passage(
      `experience-${role.company}`,
      role.company,
      `${role.title} at ${role.company}, ${role.period}, ${role.location}. ${role.description} ${role.ownership} Highlights: ${role.highlights.join(' ')} Technologies: ${role.technologies.join(', ')}.${client}`,
      [role.company, role.title, 'experience', 'worktual', 'webfosys', 'zenx'],
    ))
  }

  for (const item of portfolioData.education) {
    items.push(passage(
      `education-${item.institution}`,
      item.degree,
      `${item.degree} at ${item.institution}, ${item.period}. CGPA ${item.cgpa}. ${item.description}`,
      ['education', 'mca', 'b.sc', 'bsc', 'statistics', 'college', 'vivekananda', 'narayana', item.institution, item.cgpa],
    ))
  }

  for (const item of portfolioData.leadership) {
    items.push(passage(
      `leadership-${item.organization}`,
      item.title,
      `${item.title} at ${item.organization}, ${item.period}. ${item.context}. ${item.summary}`,
      ['leadership', 'codetantra', 'trainer', 'teaching'],
    ))
  }

  for (const group of portfolioData.achievements) {
    for (const item of group.items) {
      items.push(passage(
        `achievement-${item.title}`,
        item.title,
        `${item.title} (${item.year}): ${item.result}. ${item.description}`,
        ['achievement', 'hackathon', 'certificate', item.title, item.result],
      ))
    }
  }

  for (const project of portfolioProjects) {
    items.push(passage(
      `project-${project.id}`,
      project.shortName,
      `${project.title} (${project.shortName}) at ${project.company}. ${project.introFocus} Problem: ${project.problem} Contribution: ${project.contribution} Ownership: ${project.ownershipLabel}. Value: ${project.businessValue} Architecture: ${project.architecture.join('; ')}. Technologies: ${project.technologies.join(', ')}. ${project.chatDetail} ${project.safeguards}`.trim(),
      [project.id, project.shortName, project.title, ...project.aliases, project.company],
    ))
  }

  for (const article of fallbackArticles) {
    items.push(passage(
      `article-${article.date}`,
      article.title,
      `Article, ${article.date}: ${article.title}. ${article.excerpt}`,
      ['article', 'medium', 'writing', article.title],
    ))
  }

  return items
}

export function retrievePassages(query: string, activeId?: string | null, limit = 6) {
  const queryTokens = new Set(tokens(query))
  const text = query.toLowerCase()
  const ranked = knowledgePassages().map((item) => {
    let score = 0
    for (const token of tokens(item.text)) {
      if (queryTokens.has(token)) score += 1
    }
    for (const keyword of item.keywords) {
      const needle = keyword.toLowerCase()
      if (needle.length > 2 && text.includes(needle)) score += Math.min(needle.length, 16)
    }
    if (activeId && item.id === `project-${activeId}`) score += 8
    return { ...item, score }
  })
  return ranked.filter((item) => item.score >= 4).sort((a, b) => b.score - a.score).slice(0, limit)
}

export function answerFromPassages(query: string, activeId?: string | null) {
  const matches = retrievePassages(query, activeId, 1)
  if (!matches[0]) return 'I have not listed that in the portfolio records. I can talk about a project, my experience, or my education.'
  return matches[0].text
}
