import assert from 'node:assert/strict'
import test from 'node:test'
import { emptyCaseStudy, projectsSchema } from '../src/lib/content-schema'
import { portfolioProjects } from '../src/data/projects'
import { projectStory } from '../src/lib/project-presentation'

test('existing projects remain valid without a case study', () => {
  const parsed = projectsSchema.safeParse(portfolioProjects)
  assert.equal(parsed.success, true)
})

test('a case study accepts structured sections and rejects a bad image path', () => {
  const [project] = portfolioProjects
  const valid = projectsSchema.safeParse([{
    ...project,
    caseStudy: {
      ...emptyCaseStudy(),
      approach: [{ title: 'Ingestion', body: 'The public page describes the ingestion flow in plain language.' }],
      gallery: [{ src: '/images/projects/example.webp', alt: 'Architecture diagram', caption: '', kind: 'diagram' }],
    },
  }])
  const invalid = projectsSchema.safeParse([{
    ...project,
    caseStudy: { ...emptyCaseStudy(), gallery: [{ src: 'data:image/png;base64,abc', alt: 'bad', caption: '', kind: 'image' }] },
  }])
  assert.equal(valid.success, true)
  assert.equal(invalid.success, false)
})

test('a module cannot point at itself', () => {
  const [project] = portfolioProjects
  const parsed = projectsSchema.safeParse([{ ...project, visibility: 'module', parentId: project.id }])
  assert.equal(parsed.success, false)
})

test('story falls back to the existing detail when no approach is written', () => {
  const story = projectStory(portfolioProjects[0])
  assert.ok(story.some((section) => section.body.includes(portfolioProjects[0].chatDetail.slice(0, 40))))
})
