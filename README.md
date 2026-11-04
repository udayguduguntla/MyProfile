# PortfolioNextJs

## Vercel

Set `NVIDIA_API_KEY` and `NVIDIA_MODEL` in the Vercel project environment. The chat route runs on the server, times out after 12 seconds, and falls back to the portfolio records when the model is missing, unauthorized, retired, or slow. Do not commit API keys. Project links only pass a project id, and article fetching stays on the cached `/api/articles` route.

## Owner studio

`/studio` is an unlisted editor. It is not linked from the public pages, and obscurity is not the protection. The page and `POST /api/studio/publish` both require a GitHub sign-in whose login exactly matches `ADMIN_GITHUB_LOGIN`.

Set these in Vercel, never in the repository:

- `AUTH_SECRET` — random string used by Auth.js
- `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` — GitHub OAuth app credentials. The callback URL is `https://<your-domain>/api/auth/callback/github`
- `ADMIN_GITHUB_LOGIN` — the exact GitHub username allowed to edit
- `GITHUB_CONTENT_OWNER`, `GITHUB_CONTENT_REPO`, and `GITHUB_CONTENT_BRANCH` — repository that Vercel already deploys
- `GITHUB_CONTENT_TOKEN` — fine-grained token with contents write on that repository only

Publishing writes `src/content/profile.json`, `src/content/projects.json`, and approved image or PDF uploads, one commit at a time. The studio reads the latest file SHA before each write. Vercel rebuilds from that commit, so the public site changes when the deployment finishes. To roll back, revert the commit in Git history and let Vercel deploy the previous revision.

`STUDIO_ALLOW_MOCK=1` lets an automated check call the publish route with `"mock": true` and skip GitHub. Leave it unset in production.

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/github-mbnumkba)
