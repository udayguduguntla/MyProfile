import { portfolioData } from '@/data/portfolio'

const sections = [
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Skills', '#skills'],
  ['Writing', '#writing'],
  ['Contact', '#contact'],
] as const

export default function Footer() {
  const year = new Date().getFullYear()
  const { personal, contact, social } = portfolioData

  return (
    <footer className="border-t border-white/10 bg-[#2a0d0b]/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 py-5 pl-4 pr-24 sm:pl-6 sm:pr-28 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-cream">{personal.name}</p>
          <p className="text-xs text-sage">{personal.title}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-cream/80">
          <a href={`mailto:${contact.email}`}>Email</a>
          <a href={social.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={personal.resume}>Resume</a>
          {sections.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <p className="text-xs text-cream/60">© {year} {personal.name}</p>
      </div>
    </footer>
  )
}
