import { z } from 'zod'

const httpUrl = z.string().refine((value) => value === '' || /^https?:\/\//.test(value), 'Use a full http(s) URL or leave it empty.')
const localOrHttp = z.string().refine((value) => value === '' || value.startsWith('/') || /^https?:\/\//.test(value), 'Use a site path, a full URL, or leave it empty.')
const assetPath = z.string().regex(/^\/[A-Za-z0-9_./-]+$/, 'Use a site path such as /images/example.jpg.')

export const visualTypes = ['rag', 'conversation', 'graph', 'semantic', 'agent', 'data', 'automation', 'vision', 'ocr'] as const
export const projectVisibilities = ['featured', 'supporting', 'module', 'personal'] as const
export const mediaKinds = ['screenshot', 'diagram', 'image'] as const

const boundedText = (min: number, max: number) => z.string().trim().min(min).max(max)

export const caseStudySectionSchema = z.object({
  title: boundedText(2, 80),
  body: boundedText(12, 1500),
})

export const caseStudyOutcomeSchema = z.object({
  title: boundedText(2, 80),
  detail: boundedText(8, 500),
})

export const projectMediaSchema = z.object({
  src: assetPath,
  alt: boundedText(4, 180),
  caption: z.string().trim().max(300),
  kind: z.enum(mediaKinds),
})

export const caseStudySchema = z.object({
  constraints: z.array(boundedText(2, 300)).max(12),
  approach: z.array(caseStudySectionSchema).max(8),
  outcomes: z.array(caseStudyOutcomeSchema).max(8),
  learnings: z.array(boundedText(8, 500)).max(8),
  gallery: z.array(projectMediaSchema).max(12),
})

export const emptyCaseStudy = (): z.infer<typeof caseStudySchema> => ({
  constraints: [],
  approach: [],
  outcomes: [],
  learnings: [],
  gallery: [],
})

export const projectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  shortName: z.string().min(2),
  company: z.enum(['Worktual', 'Webfosys', 'Personal']),
  context: z.enum(['Professional', 'Personal']),
  employer: z.string(),
  description: z.string().min(12),
  problem: z.string().min(12),
  contribution: z.string().min(12),
  ownership: z.enum(['independent', 'collaborative', 'mixed']),
  ownershipLabel: z.string().min(2),
  businessValue: z.string().min(12),
  introFocus: z.string().min(12),
  architecture: z.array(z.string().min(2)).min(1),
  chatDetail: z.string().min(12),
  image: assetPath,
  technologies: z.array(z.string().min(1)).min(1),
  workflow: z.array(z.string().min(2)).min(1),
  modules: z.array(z.object({ name: z.string().min(2), detail: z.string().min(8) })),
  features: z.array(z.string().min(2)),
  safeguards: z.string(),
  planned: z.array(z.string()),
  aliases: z.array(z.string().min(2)),
  github: httpUrl,
  readmeUrl: httpUrl,
  workingUrl: httpUrl,
  category: z.string().min(2),
  isPublic: z.boolean(),
  featured: z.boolean(),
  status: z.string().min(2),
  visibility: z.enum(projectVisibilities),
  visualType: z.enum(visualTypes),
  parentId: z.string().optional(),
  caseStudy: caseStudySchema.optional(),
})

export const projectsSchema = z.array(projectSchema).min(1).superRefine((projects, context) => {
  const ids = new Set(projects.map((project) => project.id))
  projects.forEach((project, index) => {
    if (project.visibility === 'module' && !project.parentId) {
      context.addIssue({ code: 'custom', path: [index, 'parentId'], message: 'A module needs a parent project.' })
    }
    if (!project.parentId) return
    if (project.parentId === project.id) {
      context.addIssue({ code: 'custom', path: [index, 'parentId'], message: 'A project cannot be its own parent.' })
    } else if (!ids.has(project.parentId)) {
      context.addIssue({ code: 'custom', path: [index, 'parentId'], message: 'Choose an existing parent project.' })
    }
  })
})

const achievementItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(2),
  description: z.string().min(8),
  year: z.string(),
  result: z.string().min(2),
  featured: z.boolean(),
  postUrl: httpUrl,
  credentialUrl: localOrHttp,
})

export const portfolioContentSchema = z.object({
  personal: z.object({
    name: z.string().min(2),
    title: z.string().min(2),
    role: z.string().min(2),
    tagline: z.string().min(8),
    description: z.string().min(12),
    email: z.string().email(),
    phone: z.string().min(8),
    location: z.string().min(2),
    avatar: assetPath,
    resume: assetPath,
  }),
  social: z.object({
    github: httpUrl,
    linkedin: httpUrl,
    leetcode: httpUrl,
    codechef: httpUrl,
  }),
  skills: z.record(z.string().min(2), z.array(z.string().min(1)).min(1)),
  experience: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).optional(),
    title: z.string().min(2),
    company: z.string().min(2),
    period: z.string().min(3),
    location: z.string().min(2),
    current: z.boolean(),
    ownership: z.string().min(8),
    description: z.string().min(12),
    highlights: z.array(z.string().min(8)).min(1),
    technologies: z.array(z.string().min(1)).min(1),
    clientAssignment: z.object({
      client: z.string().min(2),
      period: z.string().min(3),
      location: z.string().min(2),
      summary: z.string().min(12),
      highlights: z.array(z.string().min(4)),
    }).nullable(),
  })).min(1),
  leadership: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).optional(),
    title: z.string().min(2),
    organization: z.string().min(2),
    period: z.string().min(3),
    context: z.string().min(2),
    summary: z.string().min(12),
    skills: z.array(z.string().min(1)).min(1),
  })),
  achievements: z.array(z.object({
    category: z.string().min(2),
    items: z.array(achievementItemSchema),
  })),
  education: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/).optional(),
    degree: z.string().min(2),
    institution: z.string().min(2),
    period: z.string().min(3),
    description: z.string().min(8),
    cgpa: z.string().min(1),
    status: z.string().min(2),
  })).min(1),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(8),
    location: z.string().min(2),
    availability: z.string().min(8),
  }),
})

export const siteContentSchema = portfolioContentSchema.extend({
  projects: projectsSchema,
})

export type SiteContent = z.infer<typeof siteContentSchema>
