'use client'

import { useEffect, useMemo, useState } from 'react'
import SystemGlyph from '@/app/components/SystemGlyph'
import { portfolioContentSchema, projectSchema, visualTypes, type SiteContent } from '@/lib/content-schema'

type Profile = Omit<SiteContent, 'projects'>
type Project = SiteContent['projects'][number]
type Experience = Profile['experience'][number]
type Asset = { path: string; content: string; mime: string }

const draftKey = 'uday-studio-draft'

const sections = ['Profile', 'Experience', 'Projects', 'Achievements', 'Skills', 'Education', 'Leadership'] as const

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export default function StudioEditor({ initialProfile, initialProjects }: { initialProfile: Profile; initialProjects: Project[] }) {
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [assets, setAssets] = useState<Asset[]>([])
  const [section, setSection] = useState<(typeof sections)[number]>('Profile')
  const [selectedProject, setSelectedProject] = useState(0)
  const [dirty, setDirty] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const saved = window.localStorage.getItem(draftKey)
    if (!saved) return
    try {
      const draft = JSON.parse(saved) as { profile: Profile; projects: Project[]; assets: Asset[] }
      const timer = window.setTimeout(() => {
        setProfile(draft.profile)
        setProjects(draft.projects)
        setAssets(draft.assets ?? [])
        setDirty(true)
      }, 0)
      return () => window.clearTimeout(timer)
    } catch {
      window.localStorage.removeItem(draftKey)
    }
  }, [])

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [dirty])

  const issues = useMemo(() => {
    const profileCheck = portfolioContentSchema.safeParse(profile)
    const projectCheck = projectSchema.array().safeParse(projects)
    return [
      ...(profileCheck.success ? [] : profileCheck.error.issues),
      ...(projectCheck.success ? [] : projectCheck.error.issues),
    ].slice(0, 8)
  }, [profile, projects])

  const saveDraft = (nextProfile: Profile, nextProjects: Project[], nextAssets = assets) => {
    setProfile(nextProfile)
    setProjects(nextProjects)
    setAssets(nextAssets)
    setDirty(true)
    window.localStorage.setItem(draftKey, JSON.stringify({ profile: nextProfile, projects: nextProjects, assets: nextAssets }))
  }

  const updateExperience = (index: number, patch: Partial<Experience>) => {
    const next = clone(profile)
    next.experience[index] = { ...next.experience[index], ...patch }
    saveDraft(next, projects)
  }

  const move = <T,>(items: T[], index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return items
    const next = items.slice()
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    return next
  }

  const addAsset = async (file: File, folder: string) => {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '')
    const path = `${folder}/${safeName}`
    const content = await file.arrayBuffer()
    const bytes = new Uint8Array(content)
    let binary = ''
    bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
    saveDraft(profile, projects, [...assets.filter((asset) => asset.path !== path), { path, content: btoa(binary), mime: file.type }])
  }

  const publish = async () => {
    setStatus('Publishing to GitHub…')
    const response = await fetch('/api/studio/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, projects, assets, message: 'Update portfolio content from the owner studio' }),
    })
    const body = await response.json()
    setConfirming(false)
    if (!response.ok) {
      setStatus(body.error || 'Publish failed.')
      return
    }
    window.localStorage.removeItem(draftKey)
    setDirty(false)
    setAssets([])
    setStatus('Committed to GitHub. The public site updates after the Vercel deployment finishes, which usually takes a minute.')
  }

  const project = projects[selectedProject]

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[220px_1fr]">
      <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
        {sections.map((item) => (
          <button key={item} type="button" onClick={() => setSection(item)} className={`rounded-full px-4 py-2 text-sm lg:w-full lg:text-left ${section === item ? 'bg-cream text-ink' : 'border border-white/10'}`}>{item}</button>
        ))}
      </div>
      <div className="space-y-6">
        {dirty && <p className="rounded-2xl border border-sage/30 bg-sage/10 px-4 py-3 text-sm">These edits stay in this browser until you publish. They are not saved on the server.</p>}
        {issues.length > 0 && (
          <ul className="rounded-2xl border border-burgundy bg-burgundy/30 px-4 py-3 text-sm">
            {issues.map((issue) => <li key={`${issue.path.join('.')}-${issue.message}`}>{issue.path.join('.')} — {issue.message}</li>)}
          </ul>
        )}

        {section === 'Profile' && (
          <fieldset className="grid gap-3">
            <legend className="font-serif text-3xl">Profile and contact</legend>
            {(['name', 'title', 'role', 'location', 'email', 'phone', 'tagline', 'description'] as const).map((field) => (
              <label key={field} className="text-sm capitalize text-sage">
                {field}
                <input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-cream" value={field in profile.personal ? profile.personal[field] : profile.contact[field as 'email']} onChange={(event) => {
                  const next = clone(profile)
                  if (field in next.personal) next.personal[field] = event.target.value
                  if (field in next.contact) next.contact[field as 'email'] = event.target.value
                  saveDraft(next, projects)
                }} />
              </label>
            ))}
            <label className="text-sm text-sage">Availability
              <input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-cream" value={profile.contact.availability} onChange={(event) => { const next = clone(profile); next.contact.availability = event.target.value; saveDraft(next, projects) }} />
            </label>
            <label className="text-sm text-sage">Resume PDF
              <input className="mt-1 block" type="file" accept="application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) void addAsset(file, 'public/resume') }} />
            </label>
          </fieldset>
        )}

        {section === 'Experience' && profile.experience.map((role, index) => (
          <fieldset key={`${role.company}-${index}`} className="grid gap-3 rounded-3xl border border-white/10 p-4">
            <legend className="px-2 text-lg">{role.company}</legend>
            <div className="flex gap-2">
              <button type="button" onClick={() => { const next = clone(profile); next.experience = move(next.experience, index, -1); saveDraft(next, projects) }}>Move up</button>
              <button type="button" onClick={() => { const next = clone(profile); next.experience = move(next.experience, index, 1); saveDraft(next, projects) }}>Move down</button>
              <button type="button" onClick={() => { const next = clone(profile); next.experience.splice(index, 1); saveDraft(next, projects) }}>Delete</button>
            </div>
            <label className="text-sm">Role<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={role.title} onChange={(event) => updateExperience(index, { title: event.target.value })} /></label>
            <label className="text-sm">Employer<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={role.company} onChange={(event) => updateExperience(index, { company: event.target.value })} /></label>
            <label className="text-sm">Dates<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={role.period} onChange={(event) => updateExperience(index, { period: event.target.value })} /></label>
            <label className="text-sm">Location<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={role.location} onChange={(event) => updateExperience(index, { location: event.target.value })} /></label>
            <label className="text-sm">Summary<textarea className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={role.description} onChange={(event) => updateExperience(index, { description: event.target.value })} /></label>
            <label className="text-sm">Ownership<textarea className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={role.ownership} onChange={(event) => updateExperience(index, { ownership: event.target.value })} /></label>
            <label className="text-sm">Highlights, one per line<textarea className="mt-1 min-h-28 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={role.highlights.join('\n')} onChange={(event) => updateExperience(index, { highlights: event.target.value.split('\n').filter(Boolean) })} /></label>
            <label className="text-sm">Technologies, comma separated<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={role.technologies.join(', ')} onChange={(event) => updateExperience(index, { technologies: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} /></label>
          </fieldset>
        ))}
        {section === 'Experience' && (
          <button type="button" className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink" onClick={() => {
            const next = clone(profile)
            next.experience.push({ title: 'New role', company: 'Company', period: '2026 – Present', location: 'Chennai, India', current: false, ownership: 'Describe what you owned and what was shared.', description: 'Describe the work in one or two sentences.', highlights: ['Add a concrete highlight.'], technologies: ['Python'], clientAssignment: null })
            saveDraft(next, projects)
          }}>Add experience</button>
        )}

        {section === 'Projects' && project && (
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <fieldset className="grid gap-3">
              <legend className="font-serif text-3xl">Project</legend>
              <label className="text-sm">Choose
                <select className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={selectedProject} onChange={(event) => setSelectedProject(Number(event.target.value))}>
                  {projects.map((item, index) => <option key={item.id} value={index}>{item.shortName}</option>)}
                </select>
              </label>
              {([
                ['title', 'Title'], ['shortName', 'Short name'], ['problem', 'Problem'], ['contribution', 'Your contribution'],
                ['ownershipLabel', 'Ownership label'], ['businessValue', 'Value'], ['chatDetail', 'Chat detail'],
              ] as const).map(([field, label]) => (
                <label key={field} className="text-sm">{label}
                  <textarea className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={project[field]} onChange={(event) => {
                    const next = clone(projects)
                    next[selectedProject] = { ...next[selectedProject], [field]: event.target.value }
                    saveDraft(profile, next)
                  }} />
                </label>
              ))}
              <label className="text-sm">Ownership
                <select className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={project.ownership} onChange={(event) => {
                  const next = clone(projects)
                  next[selectedProject] = { ...next[selectedProject], ownership: event.target.value as Project['ownership'] }
                  saveDraft(profile, next)
                }}>
                  <option value="independent">Independent</option>
                  <option value="collaborative">Collaborative</option>
                  <option value="mixed">Mixed</option>
                </select>
              </label>
              <label className="text-sm">System visual
                <select className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={project.visualType} onChange={(event) => {
                  const next = clone(projects)
                  next[selectedProject] = { ...next[selectedProject], visualType: event.target.value as Project['visualType'] }
                  saveDraft(profile, next)
                }}>
                  {visualTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="text-sm">Aliases, comma separated
                <input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={project.aliases.join(', ')} onChange={(event) => {
                  const next = clone(projects)
                  next[selectedProject] = { ...next[selectedProject], aliases: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }
                  saveDraft(profile, next)
                }} />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { const next = move(projects, selectedProject, -1); saveDraft(profile, next); setSelectedProject(Math.max(0, selectedProject - 1)) }}>Move up</button>
                <button type="button" onClick={() => { const next = move(projects, selectedProject, 1); saveDraft(profile, next); setSelectedProject(Math.min(projects.length - 1, selectedProject + 1)) }}>Move down</button>
                <button type="button" onClick={() => {
                  const next = clone(projects)
                  const source = next[selectedProject]
                  next.push({ ...source, id: `project-${next.length + 1}`, title: 'New project', shortName: 'New project', parentId: undefined })
                  saveDraft(profile, next)
                  setSelectedProject(next.length - 1)
                }}>Add project</button>
                <button type="button" onClick={() => {
                  if (projects.length < 2) return
                  const next = projects.filter((_, index) => index !== selectedProject)
                  saveDraft(profile, next)
                  setSelectedProject(0)
                }}>Delete</button>
              </div>
            </fieldset>
            <aside className="rounded-[1.8rem] border border-sage/35 bg-gradient-to-br from-[#3a1210] to-[#31372c] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-sage">Preview</p>
              <div className="mt-3 h-24 overflow-hidden rounded-2xl"><SystemGlyph type={project.visualType} /></div>
              <h2 className="mt-3 font-serif text-2xl">{project.title}</h2>
              <p className="mt-2 text-sm text-white/80">{project.problem}</p>
              <p className="mt-3 text-sm text-cream">{project.contribution}</p>
            </aside>
          </div>
        )}

        {section === 'Achievements' && profile.achievements.map((group, groupIndex) => (
          <fieldset key={group.category} className="grid gap-3 rounded-3xl border border-white/10 p-4">
            <legend className="px-2">{group.category}</legend>
            {group.items.map((item, itemIndex) => (
              <div key={`${item.title}-${itemIndex}`} className="grid gap-2 border-t border-white/10 pt-3">
                <label className="text-sm">Result<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.result} onChange={(event) => { const next = clone(profile); next.achievements[groupIndex].items[itemIndex].result = event.target.value; saveDraft(next, projects) }} /></label>
                <label className="text-sm">Date or year<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.year} onChange={(event) => { const next = clone(profile); next.achievements[groupIndex].items[itemIndex].year = event.target.value; saveDraft(next, projects) }} /></label>
                <label className="text-sm">Description<textarea className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.description} onChange={(event) => { const next = clone(profile); next.achievements[groupIndex].items[itemIndex].description = event.target.value; saveDraft(next, projects) }} /></label>
                <label className="text-sm">Post link<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.postUrl} onChange={(event) => { const next = clone(profile); next.achievements[groupIndex].items[itemIndex].postUrl = event.target.value; saveDraft(next, projects) }} /></label>
                <label className="text-sm">Certificate PDF or image<input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void addAsset(file, 'public/certificates') }} /></label>
              </div>
            ))}
          </fieldset>
        ))}

        {section === 'Skills' && Object.entries(profile.skills).map(([group, items]) => (
          <label key={group} className="block text-sm">{group}
            <input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={items.join(', ')} onChange={(event) => {
              const next = clone(profile)
              next.skills[group] = event.target.value.split(',').map((item) => item.trim()).filter(Boolean)
              saveDraft(next, projects)
            }} />
          </label>
        ))}

        {section === 'Leadership' && profile.leadership.map((item, index) => (
          <fieldset key={item.organization} className="grid gap-2 rounded-3xl border border-white/10 p-4">
            <label className="text-sm">Role<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.title} onChange={(event) => { const next = clone(profile); next.leadership[index].title = event.target.value; saveDraft(next, projects) }} /></label>
            <label className="text-sm">Organization<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.organization} onChange={(event) => { const next = clone(profile); next.leadership[index].organization = event.target.value; saveDraft(next, projects) }} /></label>
            <label className="text-sm">Period<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.period} onChange={(event) => { const next = clone(profile); next.leadership[index].period = event.target.value; saveDraft(next, projects) }} /></label>
            <label className="text-sm">Summary<textarea className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.summary} onChange={(event) => { const next = clone(profile); next.leadership[index].summary = event.target.value; saveDraft(next, projects) }} /></label>
          </fieldset>
        ))}

        {section === 'Education' && profile.education.map((item, index) => (
          <fieldset key={item.degree} className="grid gap-2 rounded-3xl border border-white/10 p-4">
            <label className="text-sm">Degree<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.degree} onChange={(event) => { const next = clone(profile); next.education[index].degree = event.target.value; saveDraft(next, projects) }} /></label>
            <label className="text-sm">Institution<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.institution} onChange={(event) => { const next = clone(profile); next.education[index].institution = event.target.value; saveDraft(next, projects) }} /></label>
            <label className="text-sm">Period<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.period} onChange={(event) => { const next = clone(profile); next.education[index].period = event.target.value; saveDraft(next, projects) }} /></label>
            <label className="text-sm">Score<input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" value={item.cgpa} onChange={(event) => { const next = clone(profile); next.education[index].cgpa = event.target.value; saveDraft(next, projects) }} /></label>
          </fieldset>
        ))}

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
          <button type="button" disabled={issues.length > 0} className="rounded-full bg-cream px-5 py-3 text-sm font-semibold text-ink disabled:opacity-40" onClick={() => setConfirming(true)}>Review and publish</button>
          <p className="max-w-xl text-sm text-cream/70">Publishing creates one GitHub commit. Vercel then rebuilds the site, so the change is not instant.</p>
        </div>
        {status && <p className="text-sm text-sage">{status}</p>}
        {confirming && (
          <div className="rounded-3xl border border-cream/30 bg-black/30 p-4">
            <p className="text-sm">Publish the current profile, {projects.length} projects, and {assets.length} uploaded files?</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink" onClick={() => void publish()}>Publish</button>
              <button type="button" className="rounded-full border border-cream/30 px-4 py-2 text-sm" onClick={() => setConfirming(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
