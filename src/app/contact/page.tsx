'use client'

import { useState } from 'react'
import { portfolioData } from '@/data/portfolio'
import ModernNavigation from '../components/ModernNavigation'
import InteractiveStarBackground from '../components/InteractiveStarBackground'
import { Github, Linkedin, Code2, Trophy, Mail, MapPin, Phone, Send } from 'lucide-react'

const socialLinks = [
  { label: 'GitHub', Icon: Github, href: portfolioData.social.github, color: 'hover:bg-[#333]' },
  { label: 'LinkedIn', Icon: Linkedin, href: portfolioData.social.linkedin, color: 'hover:bg-[#0A66C2]' },
  { label: 'LeetCode', Icon: Code2, href: portfolioData.social.leetcode, color: 'hover:bg-[#FFA116]' },
  { label: 'CodeChef', Icon: Trophy, href: portfolioData.social.codechef, color: 'hover:bg-[#6B4226]' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form:', formData)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      <InteractiveStarBackground variant="contact" />
      <ModernNavigation />

      <main className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Get In Touch</h1>
          <p className="mt-4 text-lg text-white/70">{portfolioData.contact.availability}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <Mail className="h-5 w-5 text-purple-300" />
              <p className="mt-3 text-sm font-medium text-white">Email</p>
              <a href={`mailto:${portfolioData.contact.email}`} className="mt-1 block text-sm text-purple-200 transition hover:text-purple-100">
                {portfolioData.contact.email}
              </a>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <MapPin className="h-5 w-5 text-purple-300" />
              <p className="mt-3 text-sm font-medium text-white">Location</p>
              <p className="mt-1 text-sm text-white/60">{portfolioData.contact.location}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <Phone className="h-5 w-5 text-purple-300" />
              <p className="mt-3 text-sm font-medium text-white">Phone</p>
              <p className="mt-1 text-sm text-white/60">{portfolioData.contact.phone}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <p className="mb-4 text-sm font-semibold text-white">Social</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, Icon, href, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 rounded-lg border border-white/12 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition ${color}`}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl lg:col-span-3">
            <h2 className="mb-6 text-lg font-bold text-white">Send a Message</h2>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Mail className="h-12 w-12 text-emerald-400" />
                <p className="mt-4 text-lg font-semibold text-white">Message Sent!</p>
                <p className="mt-2 text-sm text-white/60">Thank you. I&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" name="name" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 backdrop-blur-sm transition focus:border-purple-500 focus:outline-none" />
                  <input type="email" name="email" placeholder="Your Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 backdrop-blur-sm transition focus:border-purple-500 focus:outline-none" />
                </div>
                <textarea name="message" placeholder="Your Message" rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 backdrop-blur-sm transition focus:border-purple-500 focus:outline-none resize-none" />
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-purple-950 transition hover:bg-white/90">
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
