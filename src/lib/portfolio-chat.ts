import { fallbackArticles } from '@/data/articles'
import { portfolioData } from '@/data/portfolio'
import { portfolioProjects, projectById, type PortfolioProject } from '@/data/projects'
import { answerFromPassages } from '@/lib/portfolio-knowledge'

export type Intent = 'me' | 'projects' | 'experience' | 'skills' | 'education' | 'achievements' | 'leadership' | 'articles' | 'contact' | 'general'

const followUp = /(what did you own|your contribution|who built|how does|how did|architecture|business problem|what tools|tell me more|what was your|go deeper|more detail)/i

export function detectIntent(query: string): Intent {
  const text = query.toLowerCase()
  if (/(contact|email|phone|linkedin|github profile|hire|reach)/.test(text)) return 'contact'
  if (/(article|medium|writing|blog)/.test(text)) return 'articles'
  if (/(achievement|award|hackathon|certification|certificate|rank|prize|codevita|aincat|nexus)/.test(text)) return 'achievements'
  if (/(education|college|degree|university|cgpa|mca|bachelor|b\.?sc|statistics|vivekananda|narayana|studied|study)/.test(text)) return 'education'
  if (/(skill|stack|technolog)/.test(text) && !followUp.test(text)) return 'skills'
  if (/(codetantra|teaching|trainer|leadership|public speaking)/.test(text)) return 'leadership'
  if (matchProject(query)) return 'projects'
  if (/(webfosys|worktual|zenx|experience|career)/.test(text)) return 'experience'
  if (/(about|yourself|who are you|location)/.test(text)) return 'me'
  return 'general'
}

export function matchProject(query: string, activeId?: string | null) {
  const text = query.toLowerCase()
  if (/ragchat|rag chat|basicrag/.test(text)) return projectById('rag-chat')
  if (/zenx|dubai/.test(text)) return undefined

  const ranked = portfolioProjects
    .map((project) => {
      let score = 0
      const names = [project.shortName, project.title, ...project.aliases]
      for (const name of names) {
        const needle = name.toLowerCase()
        if (needle.length > 2 && text.includes(needle)) score += Math.min(needle.length, 12)
      }
      return { project, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (ranked[0] && (!ranked[1] || ranked[0].score > ranked[1].score)) return ranked[0].project
  if (followUp.test(text) && activeId) return projectById(activeId)
  return ranked[0]?.project
}

export function projectIntroduction(project: PortfolioProject) {
  return `Hey — you want a fact about ${project.shortName}. ${project.introFocus} I can walk through how it works, what I owned, or the business problem.`
}

export function projectPrompts(project: PortfolioProject) {
  return [
    `How does the ${project.shortName} architecture work?`,
    `What did you own in ${project.shortName}?`,
    `What business problem did ${project.shortName} solve?`,
  ]
}

function projectAnswer(project: PortfolioProject, query: string) {
  const text = query.toLowerCase()
  if (/(own|contribution|who built|colleague|independ)/.test(text)) {
    return `${project.contribution} Ownership: ${project.ownershipLabel}. ${project.safeguards}`.trim()
  }
  if (/(architect|how does|how did|workflow|pipeline|layer)/.test(text)) {
    return project.chatDetail
  }
  if (/(business|why|problem|value|useful)/.test(text)) {
    return `${project.problem} ${project.businessValue}`
  }
  if (/(tool|stack|technolog)/.test(text)) {
    return `On ${project.shortName} I used ${project.technologies.join(', ')}. ${project.contribution}`
  }
  return `${project.introFocus} ${project.contribution} ${project.safeguards}`.trim()
}

export function fallbackAnswer(intent: Intent, query = '', activeId?: string | null) {
  const text = query.toLowerCase()
  const project = matchProject(query, activeId)

  if (/^(hi|hello|hey)\b/.test(text)) {
    return `Hi, I'm Uday Guduguntla. I build Python systems for retrieval, chatbots, and analytics at Worktual, and I previously automated content publishing at Webfosys. This is an AI representation of my portfolio.`
  }
  if (project && !/(skill|certif|education|article)/.test(text)) return projectAnswer(project, query)
  if (/zenx|dubai/.test(text)) {
    return `ZenX was a Webfosys client assignment in Dubai from July to September 2025, on backend tooling for a payments application. It was not one of the three SEO platform modules and not a separate employer.`
  }
  if (/codevita/.test(text)) return `In TCS CodeVita Season 12 I secured a global rank of 7574.`
  if (/nexus|reverse coding/.test(text)) return `I placed second in Reverse Coding at NEXUSVERSE 2.0, with a cash award of 1000 INR.`
  if (/aincat/.test(text)) return `In AINCAT 2025 I ranked 3567 nationwide. I treat that as supporting evidence, not my main engineering result.`

  const featured = portfolioProjects.filter((item) => item.visibility === 'featured')
  switch (intent) {
    case 'me':
    return `I'm Uday Guduguntla, an AI engineer in ${portfolioData.personal.location}. I have 2+ years of Python experience, including 1+ year on generative AI. At Worktual I architected the multi-tenant RAG system, the CDC pipeline, and the Cypher agent. Before that I built Webfosys' publishing, quality-check, and search-reporting tools.`
  case 'projects':
      return `The work I can walk through is ${featured.map((item) => item.shortName).join(', ')}, plus the Webfosys publishing, quality, and search modules, and a personal Instagram bot. Ask about one and I will stay on it.`
    case 'skills':
      return `Python is the through-line: retrieval and agents at Worktual, and FastAPI, WordPress, and Search Console at Webfosys. The interface work uses React and Next.js.`
    case 'experience':
      return `I am a Trainee Software Engineer in Python at Worktual. I architected the multi-tenant RAG system, the CDC pipeline, and the Cypher agent. Chatbots, the agent kit, ticketing, and synthetic data were shared work. At Webfosys, from June 2024 to September 2025, I implemented the SEO publishing, review, and reporting workflows. ZenX was a Webfosys partnership, not a separate employer.`
    case 'leadership':
      return `From February to July 2025 I trained 1,000+ students in Python, C, and data structures through CodeTantra, a college-linked internship. I also led trainer teams and a 70+ student web workshop. I count that as teaching experience, not my core engineering role.`
    case 'education':
      return `I completed an MCA at Narayana Engineering College, Nellore, with a CGPA of 8.8, and a B.Sc. in Statistics at Vivekananda Degree College, Nellore, with a CGPA of 9.2.`
    case 'achievements':
      return `CodeVita Season 12, global rank 7574. NEXUSVERSE Reverse Coding, second place. AINCAT 2025, rank 3567. I also have an MCP certification.`
    case 'articles':
      return `My recent writing covers RAG, context-blended embeddings, and chunking: ${fallbackArticles.map((article) => article.title).join('; ')}.`
    case 'contact':
      return `You can reach me at ${portfolioData.contact.email}. I am ${portfolioData.contact.availability.toLowerCase()}.`
    default:
      return answerFromPassages(query, activeId)
  }
}

export function publicProjectContext() {
  return portfolioProjects.map((project) => ({
    id: project.id,
    title: project.title,
    shortName: project.shortName,
    company: project.company,
    ownership: project.ownershipLabel,
    contribution: project.contribution,
    problem: project.problem,
    businessValue: project.businessValue,
    architecture: project.architecture,
    detail: project.chatDetail,
    technologies: project.technologies,
    safeguards: project.safeguards,
  }))
}
