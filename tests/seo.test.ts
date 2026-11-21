import assert from 'node:assert/strict'
import test from 'node:test'
import { parseHTML } from 'linkedom'
import { portfolioProjects } from '../src/data/projects'
import { publicRoutes } from '../src/lib/public-routes'
import { siteGraph } from '../src/lib/structured-data'
import { siteConfig } from '../src/lib/site-config'

test('public routes cover the homepage, resume, and non-module projects', () => {
  const paths = publicRoutes().map((route) => route.path) as string[]
  assert.equal(paths[0], '/')
  assert.equal(paths[1], '/resume')
  assert.equal(paths.includes('/studio'), false)
  const modules = portfolioProjects.filter((project) => project.visibility === 'module')
  for (const project of modules) assert.equal(paths.includes(`/projects/${project.id}`), false)
  const indexable = portfolioProjects.filter((project) => project.visibility !== 'module')
  assert.equal(paths.length, 2 + indexable.length)
})

test('site graph uses the canonical host and omits the phone number', () => {
  const graph = siteGraph()
  const serialized = JSON.stringify(graph)
  assert.equal(serialized.includes(siteConfig.url), true)
  assert.equal(serialized.includes('udayguduguntla.com'), false)
  assert.equal(serialized.includes('+91'), false)
  assert.equal(serialized.includes('6302111386'), false)
})

const baseUrl = process.env.SEO_BASE_URL

test('rendered site exposes crawl files, canonical URLs, and real 404s', { skip: baseUrl ? false : 'Set SEO_BASE_URL to check a running production server' }, async () => {
  const origin = baseUrl!
  const robots = await fetch(`${origin}/robots.txt`)
  assert.equal(robots.status, 200)
  const robotsText = await robots.text()
  assert.equal(robotsText.includes('Sitemap:'), true)
  assert.equal(robotsText.includes('/api/'), true)

  const sitemap = await fetch(`${origin}/sitemap.xml`)
  assert.equal(sitemap.status, 200)
  const sitemapText = await sitemap.text()
  const sitemapDocument = new DOMParserShim(sitemapText)
  const locations = sitemapDocument.locations()
  assert.equal(locations.includes(`${siteConfig.url}/`), true)
  assert.equal(locations.includes(`${siteConfig.url}/resume`), true)
  assert.equal(locations.some((url) => url.includes('/studio')), false)

  const home = await fetch(`${origin}/`)
  assert.equal(home.status, 200)
  const homeDocument = parseHTML(await home.text()).document
  assert.equal(homeDocument.querySelectorAll('h1').length, 1)
  assert.equal(homeDocument.querySelector('link[rel="canonical"]')?.getAttribute('href'), siteConfig.url)
  assert.equal(homeDocument.querySelector('meta[name="google-site-verification"]')?.getAttribute('content'), siteConfig.googleVerification)
  assert.equal(homeDocument.querySelectorAll('script[type="application/ld+json"]').length > 0, true)

  const missing = await fetch(`${origin}/not-a-real-page`)
  assert.equal(missing.status, 404)

  const pdf = await fetch(`${origin}/resume/Uday.pdf`)
  assert.equal(pdf.headers.get('x-robots-tag'), 'noindex')
})

class DOMParserShim {
  constructor(private readonly xml: string) {}
  locations() {
    const { document } = parseHTML(this.xml)
    return [...document.querySelectorAll('loc')].map((node) => node.textContent ?? '')
  }
}
