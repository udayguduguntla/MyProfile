import ts from 'typescript'
import { readFileSync, writeFileSync } from 'node:fs'

const compiled = ts.transpileModule(readFileSync('src/lib/github-content.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
writeFileSync('/tmp/uday-github.mjs', compiled)
const { assertPublishablePath, publishFiles } = await import('/tmp/uday-github.mjs')

let rejected = false
try { assertPublishablePath('../.env', 10) } catch { rejected = true }
if (!rejected) throw new Error('unsafe path was accepted')

process.env.GITHUB_CONTENT_OWNER = 'udayguduguntla'
process.env.GITHUB_CONTENT_REPO = 'MyProfile'
process.env.GITHUB_CONTENT_BRANCH = 'main'
process.env.GITHUB_CONTENT_TOKEN = 'test-token'

const calls = []
const fetcher = async (url, options = {}) => {
  calls.push({ url, method: options.method || 'GET', body: options.body })
  if (!options.method || options.method === 'GET') return new Response(JSON.stringify({ sha: 'abc123' }), { status: 200 })
  if (String(options.body).includes('"sha":"stale"')) return new Response('conflict', { status: 409 })
  return new Response(JSON.stringify({ commit: { sha: 'def456' } }), { status: 201 })
}

const result = await publishFiles([{ path: 'src/content/profile.json', content: '{"ok":true}\n' }], 'Update portfolio', fetcher)
if (result.commits[0] !== 'def456') throw new Error('mock commit was not recorded')
const put = calls.find((call) => call.method === 'PUT')
const body = JSON.parse(put.body)
if (body.sha !== 'abc123') throw new Error('publish did not use the latest SHA')

let conflicted = false
try {
  await publishFiles([{ path: 'src/content/projects.json', content: '[]\n' }], 'Update portfolio', async (url, options = {}) => {
    if (!options.method) return new Response(JSON.stringify({ sha: 'new' }), { status: 200 })
    return new Response('conflict', { status: 409 })
  })
} catch (error) {
  conflicted = error.status === 409
}
if (!conflicted) throw new Error('SHA conflict was not reported')

console.log('publish checks passed')
