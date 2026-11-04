import { NextResponse } from 'next/server'
import { fallbackArticles, selectRelevantArticles, type Article } from '@/data/articles'

export const revalidate = 3600

function decode(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseFeed(xml: string): Article[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/g) ?? []
  return items.map((item) => {
    const title = decode(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
    const url = decode(item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? '')
    const date = decode(item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? '')
    const excerpt = decode(item.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)?.[1] ?? item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? '').slice(0, 220)
    return { title, url, date, excerpt }
  }).filter((article) => article.title && article.url.startsWith('http'))
}

export async function GET() {
  try {
    const response = await fetch('https://medium.com/feed/@udayguduguntla', {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
    })
    if (!response.ok) throw new Error(`Medium feed returned ${response.status}`)
    const articles = selectRelevantArticles(parseFeed(await response.text()))
    if (!articles.length) throw new Error('Medium feed had no relevant articles')
    return NextResponse.json({ articles, source: 'medium' })
  } catch (error) {
    console.error('Medium feed failed:', error)
    return NextResponse.json({ articles: fallbackArticles, source: 'fallback' })
  }
}
