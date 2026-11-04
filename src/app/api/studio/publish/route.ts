import { auth, isOwnerLogin } from '@/auth'
import { siteContentSchema } from '@/lib/content-schema'
import { publishFiles, type ContentFile } from '@/lib/github-content'

const allowedMime = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'])

export async function POST(request: Request) {
  const session = await auth()
  if (!isOwnerLogin(session?.user?.login)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: {
    profile?: unknown
    projects?: unknown
    assets?: { path?: string; content?: string; mime?: string }[]
    message?: string
    mock?: boolean
  }
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'Publish body must be JSON.' }, { status: 400 })
  }

  const parsed = siteContentSchema.safeParse({ ...(payload.profile as object), projects: payload.projects })
  if (!parsed.success) {
    return Response.json({ error: 'Content failed validation.', issues: parsed.error.issues.slice(0, 12) }, { status: 400 })
  }

  const { projects, ...profile } = parsed.data
  const files: ContentFile[] = [
    { path: 'src/content/profile.json', content: `${JSON.stringify(profile, null, 2)}\n` },
    { path: 'src/content/projects.json', content: `${JSON.stringify(projects, null, 2)}\n` },
  ]

  for (const asset of payload.assets ?? []) {
    if (!asset.path || !asset.content || !asset.mime || !allowedMime.has(asset.mime)) {
      return Response.json({ error: 'Each upload needs a safe path, base64 content, and an image or PDF type.' }, { status: 400 })
    }
    if (asset.mime === 'application/pdf' && !asset.path.endsWith('.pdf')) {
      return Response.json({ error: 'PDF uploads must use a .pdf filename.' }, { status: 400 })
    }
    files.push({ path: asset.path, content: asset.content, encoding: 'base64' })
  }

  if (payload.mock) {
    if (process.env.STUDIO_ALLOW_MOCK !== '1') {
      return Response.json({ error: 'Mock publishing is disabled.' }, { status: 403 })
    }
    return Response.json({ ok: true, mocked: true, files: files.map((file) => file.path) })
  }

  try {
    const result = await publishFiles(files, payload.message?.slice(0, 180) || 'Update portfolio content from the owner studio')
    return Response.json({ ok: true, ...result, note: 'GitHub has the commit. The live site updates after Vercel finishes the deployment.' })
  } catch (error) {
    const status = error instanceof Error && 'status' in error && typeof error.status === 'number' ? error.status : 400
    return Response.json({ error: error instanceof Error ? error.message : 'Publish failed.' }, { status })
  }
}
