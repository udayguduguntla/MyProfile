# Uday Kumar Guduguntla

Personal portfolio for an AI engineer working on retrieval, conversational systems, and Python automation. The public site is a Next.js app. Content lives in validated JSON, and an unlisted studio can publish updates through GitHub.

Live site: [uday-guduguntla.vercel.app](https://uday-guduguntla.vercel.app)

## Stack

- Next.js 16, React 19, and Tailwind CSS
- Portfolio content in `src/content`, checked with Zod
- Auth.js for the owner studio
- A portfolio assistant that answers from the site records

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The studio is at `/studio` and is not linked from the public pages.

## Environment

Set these in Vercel, not in the repository. Do not commit API keys or tokens.

| Name | Purpose |
| --- | --- |
| `NVIDIA_API_KEY` | Server-side model for the portfolio assistant |
| `NVIDIA_MODEL` | Optional model override |
| `AUTH_SECRET` | Random string Auth.js uses to sign cookies |
| `AUTH_GITHUB_ID` | GitHub OAuth app client id |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `ADMIN_GITHUB_LOGIN` | The only GitHub username allowed to edit |
| `GITHUB_CONTENT_OWNER` | Repository owner Vercel deploys |
| `GITHUB_CONTENT_REPO` | Repository name |
| `GITHUB_CONTENT_BRANCH` | Branch the studio commits to |
| `GITHUB_CONTENT_TOKEN` | Fine-grained token with contents write on that repository only |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID, such as `G-XXXXXXXX` |

The OAuth callback is `https://<your-domain>/api/auth/callback/github`.

The chat route runs on the server, times out after 12 seconds, and falls back to the portfolio records when the model is missing, unauthorized, or slow. Project links pass a project id. Articles stay on the cached `/api/articles` route.

## Owner studio

`/studio` and `POST /api/studio/publish` both require a GitHub sign-in whose login matches `ADMIN_GITHUB_LOGIN`. Publishing writes `src/content/profile.json`, `src/content/projects.json`, and approved image or PDF uploads, one commit at a time. The studio reads the latest file SHA before each write. Vercel rebuilds from that commit. To roll back, revert the commit and let Vercel deploy the previous revision.

`STUDIO_ALLOW_MOCK=1` lets an automated check call the publish route with `"mock": true` and skip GitHub. Leave it unset in production.

## Google Search Console

Use a URL-prefix property for `https://uday-guduguntla.vercel.app/`. Verification stays in place through both the homepage meta tag and `public/google6db81e69d0cb427f.html`.

After deployment, submit `https://uday-guduguntla.vercel.app/sitemap.xml` and request indexing for `/`, `/resume`, and a project page such as `/projects/worktual-rag`. The sitemap includes the homepage, resume, and project pages. It does not include `/studio`, API routes, the verification file, child modules, or the resume PDF.

Search Console should show `/studio`, `/api/*`, the verification file, and `/resume/Uday.pdf` as excluded. Those exclusions are intentional. Use Page indexing, Search performance, Core Web Vitals, HTTPS, and Enhancements for practice. Recrawling can take several days.

The older host `my-profile-ten-brown.vercel.app` must permanently redirect to the new host. If the Vercel domain setting still sends a temporary `307`, change that domain redirect to permanent so it does not override the application redirect.

## Google Analytics

Create a GA4 property for the canonical site and add its measurement ID as `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel. The site loads Analytics only when that variable exists. Page views are automatic. Custom events are `resume_download`, `project_open` with a project id, `outbound_click` with a destination name, and `chat_message` without the message text.

In GA4 Admin, link the property to the Search Console property. Use Reports → Acquisition and Engagement for visits, and Search Console for queries, indexed pages, and crawl issues.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
