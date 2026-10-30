import { portfolioData } from '@/data/portfolio'

export default function LeadershipSection() {
  return (
    <>
      <section id="leadership" className="relative z-10 bg-cream/[0.05] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">Leadership and campus activity</p>
          <h2 className="mt-3 font-serif text-4xl text-cream">Teaching that sharpened communication</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {portfolioData.leadership.map((item) => (
              <article key={item.organization} className="rounded-[1.8rem] border border-cream/20 bg-[#4a2420] p-6">
                <p className="text-sm text-sage">{item.context}</p>
                <h3 className="mt-2 text-2xl text-white">{item.title}</h3>
                <p className="text-cream">{item.organization} · {item.period}</p>
                <p className="mt-4 leading-relaxed text-white/75">{item.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.skills.map((skill) => <span key={skill} className="rounded-full bg-sage/15 px-3 py-1 text-xs text-cream">{skill}</span>)}
                </div>
              </article>
            ))}
            <article id="education" className="rounded-[1.8rem] border border-white/10 bg-graphite p-6">
              <p className="text-sm text-sage">Education</p>
              {portfolioData.education.map((item) => (
                <div key={item.degree} className="mt-4 border-t border-white/10 pt-4 first:mt-0 first:border-0 first:pt-0">
                  <h3 className="text-lg text-white">{item.degree}</h3>
                  <p className="text-sm text-cream">{item.institution} · {item.period} · CGPA {item.cgpa}</p>
                  <p className="mt-2 text-sm text-white/70">{item.description}</p>
                </div>
              ))}
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
