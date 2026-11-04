'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { portfolioData } from '@/data/portfolio'
import { Github, Linkedin, Code2, Trophy, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react'

const socialLinks = [
  { label: 'GitHub', Icon: Github, href: portfolioData.social.github },
  { label: 'LinkedIn', Icon: Linkedin, href: portfolioData.social.linkedin },
  { label: 'LeetCode', Icon: Code2, href: portfolioData.social.leetcode },
  { label: 'CodeChef', Icon: Trophy, href: portfolioData.social.codechef },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const fadeVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio message from ${formData.name}`)
    const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name} <${formData.email}>`)
    window.location.href = `mailto:${portfolioData.contact.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contact" className="relative z-10 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="flex flex-col lg:flex-row gap-8 items-stretch"
        >
          {/* Left Panel - Contact Info */}
          <motion.div variants={containerVariants} className="lg:w-80 xl:w-96 flex flex-col gap-5 shrink-0">
            <motion.div variants={fadeVariants} className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-cream backdrop-blur-xl mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.75)]" />
                Available for opportunities
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Let&apos;s talk</h2>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">
                Have a project, idea, or just want to say hi? Fill in the form or reach out directly.
              </p>
            </motion.div>

            <div className="flex-1 flex flex-col gap-3">
              {[
                { Icon: Mail, label: 'Email', value: portfolioData.contact.email, href: `mailto:${portfolioData.contact.email}` },
                { Icon: MapPin, label: 'Location', value: portfolioData.contact.location },
                { Icon: Phone, label: 'Phone', value: portfolioData.contact.phone, href: `tel:${portfolioData.contact.phone.replace(/\s/g, '')}` },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={fadeVariants}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg hover:shadow-[#2a0d0b]/20"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sage transition group-hover:bg-sage/20 group-hover:text-cream">
                    <item.Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{item.label}</p>
                    {'href' in item ? (
                      <a href={item.href} className="block truncate text-sm text-cream">{item.value}</a>
                    ) : (
                      <span className="block truncate text-sm text-white/60">{item.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeVariants} className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">Social</p>
              <div className="flex gap-2">
                {socialLinks.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/12 bg-white/10 text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sage/20 hover:text-cream hover:shadow-lg"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel - Form */}
          <motion.div variants={fadeVariants} className="flex-1 flex">
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8 shadow-xl shadow-[#2a0d0b]/10 backdrop-blur-2xl flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cream/15 to-sage/10 text-cream">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Write an email</p>
                  <p className="text-xs text-white/50">This opens your email app. Nothing is sent from the site.</p>
                </div>
                <div className="ml-auto hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs text-cream font-medium">Open</span>
                </div>
              </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1.5">Name</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all duration-200 focus:border-cream/50 focus:bg-white/[0.12] focus:outline-none focus:shadow-[0_0_20px_rgba(232,210,181,0.16)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/40 mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all duration-200 focus:border-cream/50 focus:bg-white/[0.12] focus:outline-none focus:shadow-[0_0_20px_rgba(232,210,181,0.16)]"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-white/40 mb-1.5">Message</label>
                    <textarea
                      placeholder="Tell me about your project or just say hello..."
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full h-full min-h-[140px] rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-sm transition-all duration-200 focus:border-cream/50 focus:bg-white/[0.12] focus:outline-none focus:shadow-[0_0_20px_rgba(232,210,181,0.16)] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-[#2a0d0b]/15 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-[#2a0d0b]/25"
                  >
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    Open email
                  </button>
                </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
