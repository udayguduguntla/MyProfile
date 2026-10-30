import Link from 'next/link'
import { Github, Linkedin, Code2, Trophy, MapPin, Mail, Phone, Download } from 'lucide-react'
import { hasPublicUrl, portfolioData } from '@/data/portfolio'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass-purple text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-burgundy to-[#3a0504] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">UK</span>
              </div>
              <span className="text-xl font-bold">{portfolioData.personal.name.split(' ')[0]}</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              {portfolioData.personal.description}
            </p>
            <div className="flex space-x-4">
              <a 
                href={portfolioData.social.github} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-burgundy transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={portfolioData.social.linkedin} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-burgundy transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={portfolioData.social.leetcode} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-burgundy transition-colors duration-200"
              >
                <Code2 className="w-5 h-5" />
              </a>
              <a 
                href={portfolioData.social.codechef} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-burgundy transition-colors duration-200"
              >
                <Trophy className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="#experience" className="text-white/70 hover:text-white transition-colors duration-200">Experience</Link></li>
              <li><Link href="#projects" className="text-white/70 hover:text-white transition-colors duration-200">Projects</Link></li>
              <li><Link href="#skills" className="text-white/70 hover:text-white transition-colors duration-200">Skills</Link></li>
              <li><Link href="#education" className="text-white/70 hover:text-white transition-colors duration-200">Education</Link></li>
              <li><Link href="#achievements" className="text-white/70 hover:text-white transition-colors duration-200">Achievements</Link></li>
              <li><Link href="#contact" className="text-white/70 hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Technologies</h3>
            <ul className="space-y-4">
              {Object.keys(portfolioData.skills).slice(0, 5).map((group) => (
                <li key={group}><span className="text-white/70">{group}</span></li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-sage mt-1 flex-shrink-0" />
                <p className="text-white/70">
                  {portfolioData.personal.location}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sage flex-shrink-0" />
                <a 
                  href={`mailto:${portfolioData.personal.email}`}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  {portfolioData.personal.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sage flex-shrink-0" />
                <p className="text-white/70">{portfolioData.personal.phone}</p>
              </div>
            </div>

            {/* Resume Download */}
            {hasPublicUrl(portfolioData.personal.resume) && (
              <div className="mt-8">
                <Link
                  href={portfolioData.personal.resume}
                  target="_blank"
                  className="inline-flex items-center space-x-2 bg-cream px-6 py-3 rounded-lg font-medium text-ink transition hover:bg-[#f3e4cf]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/70 text-sm">
              © {currentYear} {portfolioData.personal.name}. All rights reserved.
            </p>
            <p className="text-white/70 text-sm">
              {portfolioData.personal.tagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}