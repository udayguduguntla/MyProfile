export type Article = {
  title: string
  url: string
  date: string
  excerpt: string
}

export const fallbackArticles: Article[] = [
  {
    title: 'Want your AI Agent to Talk About Exactly What You Want? You Need Right RAG.',
    url: 'https://medium.com/@udayguduguntla/want-your-ai-agent-to-talk-about-exactly-what-you-want-you-need-right-rag-ba3591b7fba7',
    date: '2026-08-06',
    excerpt: 'How prompting, fine-tuning, RAG, and guardrails shape an agent, and when standard retrieval is not enough.',
  },
  {
    title: 'The Context-Blended Embedding: How AI Organizes Thoughts Before It Remembers',
    url: 'https://medium.com/@udayguduguntla/the-context-blended-embedding-how-ai-organizes-thoughts-before-it-remembers-4a49786758e6',
    date: '2026-07-28',
    excerpt: 'A practical explanation of tokenization, attention, pooling, and why related ideas sit near each other in vector space.',
  },
  {
    title: 'The Chunking Principle: How Humans, Software, and AI Conquer Complexity',
    url: 'https://medium.com/@udayguduguntla/the-chunking-principle-how-humans-software-and-ai-conquer-complexity-2d23c63c7a02',
    date: '2026-07-21',
    excerpt: 'Why breaking large problems and documents into manageable pieces matters for both people and retrieval systems.',
  },
]

const relevant = /rag|embed|chunk|agent|retriev|knowledge graph|python|llm|guardrail|vector|semantic/i

export function selectRelevantArticles(articles: Article[], limit = 3) {
  const matching = articles.filter((article) => relevant.test(`${article.title} ${article.excerpt}`))
  const chosen = (matching.length ? matching : articles).slice(0, limit)
  return chosen.length ? chosen : fallbackArticles.slice(0, limit)
}
