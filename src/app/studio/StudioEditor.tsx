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

const field = 'mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-cream outline-none focus:border-cream/50'

function blankProject(index: number): Project {
  return {
    id: `project-${index + 1}`,
    title: 'New project',
    shortName: 'New project',
    company: 'Personal',
    context: 'Personal',
    employer: '',
    description: 'Describe the project in one or two sentences.',
    problem: 'Describe the problem this project addresses.',
    contribution: 'Describe what you built or owned.',
    ownership: 'independent',
    ownershipLabel: 'Independent',
    businessValue: 'Describe the value of the work.',
    introFocus: 'Describe the one idea to introduce first.',
    architecture: ['Step one'],
    chatDetail: 'Longer detail the chat can use, without private code.',
    image: '/images/projects/rag-chat.svg',
    technologies: ['Python'],
    workflow: ['Start', 'Finish'],
    modules: [],
    features: [],
    safeguards: '',
    planned: [],
    aliases: ['new'],
    github: '',
    readmeUrl: '',
    workingUrl: '',
    category: 'Project',
    isPublic: false,
    featured: false,
    status: 'draft',
    visibility: 'personal',
    visualType: 'automation',
  }
}

function RecordRail({ title, items, selected, onSelect, onCreate }: { title: string; items: { key: string; label: string; detail: string }[]; selected: number; onSelect: (index: number) => void; onCreate: () => void }) {
  return (
    <div className="rounded-[1.5rem] border border-white/15 p-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-xs uppercase tracking-[0.16em] text-sage">{title}</p>
        <button type="button" onClick={onCreate} className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink">New</button>
      </div>
      <div data-lenis-prevent className="mt-3 grid max-h-[28rem] gap-2 overflow-y-auto overscroll-contain">
        {items.map((item, index) => (
          <button key={item.key} type="button" onClick={() => onSelect(index)} className={`rounded-2xl border px-3 py-2 text-left ${index === selected ? 'border-cream bg-cream text-ink' : 'border-white/15 text-cream hover:border-cream/40'}`}>
            <span className="block text-sm font-semibold">{item.label}</span>
            <span className={`block truncate text-xs ${index === selected ? 'text-ink/70' : 'text-cream/60'}`}>{item.detail}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function StudioEditor({ initialProfile, initialProjects }: { initialProfile: Profile; initialProjects: Project[] }) {
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [assets, setAssets] = useState<Asset[]>([])
  const [section, setSection] = useState<(typeof sections)[number]>('Profile')
  const [selectedProject, setSelectedProject] = useState(0)
  const [selectedExperience, setSelectedExperience] = useState(0)
  const [selectedAchievement, setSelectedAchievement] = useState(0)
  const [selectedEducation, setSelectedEducation] = useState(0)
  const [selectedLeadership, setSelectedLeadership] = useState(0)
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

        {section === 'Experience' && profile.experience[selectedExperience] && (
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <fieldset className="grid gap-3">
              <legend className="font-serif text-3xl">Experience</legend>
              <label className="text-sm text-sage">Role<input className={field} value={profile.experience[selectedExperience].title} onChange={(event) => updateExperience(selectedExperience, { title: event.target.value })} /></label>
              <label className="text-sm text-sage">Employer<input className={field} value={profile.experience[selectedExperience].company} onChange={(event) => updateExperience(selectedExperience, { company: event.target.value })} /></label>
              <label className="text-sm text-sage">Dates<input className={field} value={profile.experience[selectedExperience].period} onChange={(event) => updateExperience(selectedExperience, { period: event.target.value })} /></label>
              <label className="text-sm text-sage">Location<input className={field} value={profile.experience[selectedExperience].location} onChange={(event) => updateExperience(selectedExperience, { location: event.target.value })} /></label>
              <label className="text-sm text-sage">Summary<textarea className={field} value={profile.experience[selectedExperience].description} onChange={(event) => updateExperience(selectedExperience, { description: event.target.value })} /></label>
              <label className="text-sm text-sage">Ownership<textarea className={field} value={profile.experience[selectedExperience].ownership} onChange={(event) => updateExperience(selectedExperience, { ownership: event.target.value })} /></label>
              <label className="text-sm text-sage">Highlights, one per line<textarea className={`${field} min-h-28`} value={profile.experience[selectedExperience].highlights.join('\n')} onChange={(event) => updateExperience(selectedExperience, { highlights: event.target.value.split('\n').filter(Boolean) })} /></label>
              <label className="text-sm text-sage">Technologies<input className={field} value={profile.experience[selectedExperience].technologies.join(', ')} onChange={(event) => updateExperience(selectedExperience, { technologies: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} /></label>
              <div className="flex gap-2 text-sm">
                <button type="button" onClick={() => { const next = clone(profile); next.experience = move(next.experience, selectedExperience, -1); saveDraft(next, projects); setSelectedExperience(Math.max(0, selectedExperience - 1)) }}>Move up</button>
                <button type="button" onClick={() => { const next = clone(profile); next.experience = move(next.experience, selectedExperience, 1); saveDraft(next, projects); setSelectedExperience(Math.min(profile.experience.length - 1, selectedExperience + 1)) }}>Move down</button>
                <button type="button" onClick={() => { if (profile.experience.length < 2) return; const next = clone(profile); next.experience.splice(selectedExperience, 1); saveDraft(next, projects); setSelectedExperience(0) }}>Delete</button>
              </div>
            </fieldset>
            <RecordRail title="Roles" selected={selectedExperience} onSelect={setSelectedExperience} onCreate={() => {
              const next = clone(profile)
              next.experience.push({ title: 'New role', company: 'Company', period: '2026 – Present', location: 'Chennai, India', current: false, ownership: 'Describe what you owned and what was shared.', description: 'Describe the work in one or two sentences.', highlights: ['Add a concrete highlight.'], technologies: ['Python'], clientAssignment: null })
              saveDraft(next, projects)
              setSelectedExperience(next.experience.length - 1)
            }} items={profile.experience.map((role, index) => ({ key: `${role.company}-${index}`, label: role.company, detail: role.title }))} />
          </div>
        )}

        {section === 'Projects' && project && (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <fieldset className="grid gap-3">
              <legend className="font-serif text-3xl">Project</legend>
              {([
                ['title', 'Title'], ['shortName', 'Short name'], ['problem', 'Problem'], ['contribution', 'Your contribution'],
                ['ownershipLabel', 'Ownership label'], ['businessValue', 'Value'], ['chatDetail', 'Chat detail'],
              ] as const).map(([field, label]) => (
                <label key={field} className="text-sm">{label}
                  <textarea className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-cream" value={project[field]} onChange={(event) => {
                    const next = clone(projects)
                    next[selectedProject] = { ...next[selectedProject], [field]: event.target.value }
                    saveDraft(profile, next)
                  }} />
                </label>
              ))}
              <label className="text-sm">Ownership
                <select className="mt-1 w-full rounded-xl border border-white/15 bg-[#2a0d0b] px-3 py-2 text-cream" value={project.ownership} onChange={(event) => {
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
                <select className="mt-1 w-full rounded-xl border border-white/15 bg-[#2a0d0b] px-3 py-2 text-cream" value={project.visualType} onChange={(event) => {
                  const next = clone(projects)
                  next[selectedProject] = { ...next[selectedProject], visualType: event.target.value as Project['visualType'] }
                  saveDraft(profile, next)
                }}>
                  {visualTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="text-sm">Aliases, comma separated
                <input className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-cream" value={project.aliases.join(', ')} onChange={(event) => {
                  const next = clone(projects)
                  next[selectedProject] = { ...next[selectedProject], aliases: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }
                  saveDraft(profile, next)
                }} />
              </label>
              <div className="flex flex-wrap gap-2 text-sm">
                <button type="button" onClick={() => { const next = move(projects, selectedProject, -1); saveDraft(profile, next); setSelectedProject(Math.max(0, selectedProject - 1)) }}>Move up</button>
                <button type="button" onClick={() => { const next = move(projects, selectedProject, 1); saveDraft(profile, next); setSelectedProject(Math.min(projects.length - 1, selectedProject + 1)) }}>Move down</button>
                <button type="button" onClick={() => {
                  if (projects.length < 2) return
                  const next = projects.filter((_, index) => index !== selectedProject)
                  saveDraft(profile, next)
                  setSelectedProject(0)
                }}>Delete</button>
              </div>
            </fieldset>
            <aside className="space-y-4">
              <RecordRail title="Projects" selected={selectedProject} onSelect={setSelectedProject} onCreate={() => {
                const next = [...projects, blankProject(projects.length)]
                saveDraft(profile, next)
                setSelectedProject(next.length - 1)
              }} items={projects.map((item) => ({ key: item.id, label: item.shortName, detail: item.title }))} />
            <div className="rounded-[1.8rem] border border-sage/35 bg-gradient-to-br from-[#3a1210] to-[#31372c] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-sage">Preview</p>
              <div className="mt-3 h-24 overflow-hidden rounded-2xl"><SystemGlyph type={project.visualType} /></div>
              <h2 className="mt-3 font-serif text-2xl">{project.title}</h2>
              <p className="mt-2 text-sm text-white/80">{project.problem}</p>
              <p className="mt-3 text-sm text-cream">{project.contribution}</p>
            </div>
            </aside>
          </div>
        )}

        {section === 'Achievements' && (() => {
          const entries = profile.achievements.flatMap((group, groupIndex) => group.items.map((item, itemIndex) => ({ groupIndex, itemIndex, item, category: group.category })))
          const current = entries[selectedAchievement]
          if (!current) return null
          const updateItem = (patch: Partial<typeof current.item>) => {
            const next = clone(profile)
            next.achievements[current.groupIndex].items[current.itemIndex] = { ...current.item, ...patch }
            saveDraft(next, projects)
          }
          return (
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <fieldset className="grid gap-3">
                <legend className="font-serif text-3xl">Achievement</legend>
                <label className="text-sm text-sage">Title<input className={field} value={current.item.title} onChange={(event) => updateItem({ title: event.target.value })} /></label>
                <label className="text-sm text-sage">Result<input className={field} value={current.item.result} onChange={(event) => updateItem({ result: event.target.value })} /></label>
                <label className="text-sm text-sage">Year<input className={field} value={current.item.year} onChange={(event) => updateItem({ year: event.target.value })} /></label>
                <label className="text-sm text-sage">Description<textarea className={field} value={current.item.description} onChange={(event) => updateItem({ description: event.target.value })} /></label>
                <label className="text-sm text-sage">Post link<input className={field} value={current.item.postUrl} onChange={(event) => updateItem({ postUrl: event.target.value })} /></label>
                <label className="text-sm text-sage">Certificate PDF or image<input className="mt-1 block text-cream" type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-'); updateItem({ credentialUrl: `/certificates/${safeName}` }); void addAsset(file, 'public/certificates') }} /></label>
                <button type="button" className="w-fit text-sm" onClick={() => {
                  const next = clone(profile)
                  next.achievements[current.groupIndex].items.splice(current.itemIndex, 1)
                  saveDraft(next, projects)
                  setSelectedAchievement(0)
                }}>Delete</button>
              </fieldset>
              <RecordRail title="Credentials" selected={selectedAchievement} onSelect={setSelectedAchievement} onCreate={() => {
                const next = clone(profile)
                const group = next.achievements[0] ?? { category: 'Recognition', items: [] }
                if (!next.achievements[0]) next.achievements.push(group)
                group.items.push({ title: 'New achievement', description: 'Describe the result in a sentence.', year: '', result: 'Result', featured: false, postUrl: '', credentialUrl: '' })
                saveDraft(next, projects)
                setSelectedAchievement(next.achievements.flatMap((entry) => entry.items).length - 1)
              }} items={entries.map((entry) => ({ key: `${entry.category}-${entry.item.title}-${entry.itemIndex}`, label: entry.item.title, detail: entry.category }))} />
            </div>
          )
        })()}

        {section === 'Skills' && Object.entries(profile.skills).map(([group, items]) => (
          <label key={group} className="block text-sm">{group}
            <input className={field} value={items.join(', ')} onChange={(event) => {
              const next = clone(profile)
              next.skills[group] = event.target.value.split(',').map((item) => item.trim()).filter(Boolean)
              saveDraft(next, projects)
            }} />
          </label>
        ))}

        {section === 'Leadership' && profile.leadership[selectedLeadership] && (
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <fieldset className="grid gap-3">
              <legend className="font-serif text-3xl">Leadership</legend>
              <label className="text-sm text-sage">Role<input className={field} value={profile.leadership[selectedLeadership].title} onChange={(event) => { const next = clone(profile); next.leadership[selectedLeadership].title = event.target.value; saveDraft(next, projects) }} /></label>
              <label className="text-sm text-sage">Organization<input className={field} value={profile.leadership[selectedLeadership].organization} onChange={(event) => { const next = clone(profile); next.leadership[selectedLeadership].organization = event.target.value; saveDraft(next, projects) }} /></label>
              <label className="text-sm text-sage">Period<input className={field} value={profile.leadership[selectedLeadership].period} onChange={(event) => { const next = clone(profile); next.leadership[selectedLeadership].period = event.target.value; saveDraft(next, projects) }} /></label>
              <label className="text-sm text-sage">Summary<textarea className={field} value={profile.leadership[selectedLeadership].summary} onChange={(event) => { const next = clone(profile); next.leadership[selectedLeadership].summary = event.target.value; saveDraft(next, projects) }} /></label>
            </fieldset>
            <RecordRail title="Roles" selected={selectedLeadership} onSelect={setSelectedLeadership} onCreate={() => {
              const next = clone(profile)
              next.leadership.push({ title: 'New role', organization: 'Organization', period: '2026', context: 'Context', summary: 'Describe what this role involved.', skills: ['Communication'] })
              saveDraft(next, projects)
              setSelectedLeadership(next.leadership.length - 1)
            }} items={profile.leadership.map((item, index) => ({ key: `${item.organization}-${index}`, label: item.title, detail: item.organization }))} />
          </div>
        )}

        {section === 'Education' && profile.education[selectedEducation] && (
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <fieldset className="grid gap-3">
              <legend className="font-serif text-3xl">Education</legend>
              <label className="text-sm text-sage">Degree<input className={field} value={profile.education[selectedEducation].degree} onChange={(event) => { const next = clone(profile); next.education[selectedEducation].degree = event.target.value; saveDraft(next, projects) }} /></label>
              <label className="text-sm text-sage">Institution<input className={field} value={profile.education[selectedEducation].institution} onChange={(event) => { const next = clone(profile); next.education[selectedEducation].institution = event.target.value; saveDraft(next, projects) }} /></label>
              <label className="text-sm text-sage">Period<input className={field} value={profile.education[selectedEducation].period} onChange={(event) => { const next = clone(profile); next.education[selectedEducation].period = event.target.value; saveDraft(next, projects) }} /></label>
              <label className="text-sm text-sage">Score<input className={field} value={profile.education[selectedEducation].cgpa} onChange={(event) => { const next = clone(profile); next.education[selectedEducation].cgpa = event.target.value; saveDraft(next, projects) }} /></label>
            </fieldset>
            <RecordRail title="Schools" selected={selectedEducation} onSelect={setSelectedEducation} onCreate={() => {
              const next = clone(profile)
              next.education.push({ degree: 'New degree', institution: 'Institution', period: '2026 – 2028', description: 'Describe the focus of this program.', cgpa: '', status: 'completed' })
              saveDraft(next, projects)
              setSelectedEducation(next.education.length - 1)
            }} items={profile.education.map((item, index) => ({ key: `${item.degree}-${index}`, label: item.degree, detail: item.institution }))} />
          </div>
        )}

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
