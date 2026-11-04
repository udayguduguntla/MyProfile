export type ContentFile = {
  path: string
  content: string
  encoding?: 'utf-8' | 'base64'
}

type FetchLike = typeof fetch

const allowedPath = /^(src\/content\/(profile|projects)\.json|public\/(images|certificates|resume)\/[A-Za-z0-9._/-]+)$/
const imageExtension = /\.(png|jpe?g|webp|svg)$/i
const pdfExtension = /\.pdf$/i

export function assertPublishablePath(path: string, byteLength: number) {
  if (!allowedPath.test(path) || path.includes('..')) throw new Error(`Path is not publishable: ${path}`)
  const limit = pdfExtension.test(path) ? 4_000_000 : imageExtension.test(path) || path.endsWith('.json') ? 1_500_000 : 0
  if (!limit) throw new Error(`File type is not allowed: ${path}`)
  if (byteLength > limit) throw new Error(`${path} is larger than the upload limit.`)
}

export async function publishFiles(files: ContentFile[], message: string, fetcher: FetchLike = fetch) {
  const owner = process.env.GITHUB_CONTENT_OWNER
  const repo = process.env.GITHUB_CONTENT_REPO
  const branch = process.env.GITHUB_CONTENT_BRANCH || 'main'
  const token = process.env.GITHUB_CONTENT_TOKEN
  if (!owner || !repo || !token) throw new Error('GitHub content publishing is not configured.')

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const commits: string[] = []

  for (const file of files) {
    const encoding = file.encoding ?? 'utf-8'
    const bytes = encoding === 'base64' ? Buffer.from(file.content, 'base64').byteLength : Buffer.byteLength(file.content)
    assertPublishablePath(file.path, bytes)
    const apiPath = file.path.split('/').map(encodeURIComponent).join('/')
    const readUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${apiPath}?ref=${encodeURIComponent(branch)}`
    const current = await fetcher(readUrl, { headers, cache: 'no-store' })
    let sha: string | undefined
    if (current.status === 200) {
      const body = await current.json() as { sha?: string }
      sha = body.sha
    } else if (current.status !== 404) {
      throw new Error(`Could not read ${file.path} before publishing.`)
    }
    const response = await fetcher(`https://api.github.com/repos/${owner}/${repo}/contents/${apiPath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message,
        content: encoding === 'base64' ? file.content : Buffer.from(file.content).toString('base64'),
        sha,
        branch,
      }),
    })
    if (response.status === 409) {
      const error = new Error('GitHub content changed. Reload the studio and publish again.') as Error & { status?: number }
      error.status = 409
      throw error
    }
    if (!response.ok) throw new Error(`GitHub rejected ${file.path}.`)
    const saved = await response.json() as { commit?: { sha?: string } }
    if (saved.commit?.sha) commits.push(saved.commit.sha)
  }

  return { commits, branch }
}
