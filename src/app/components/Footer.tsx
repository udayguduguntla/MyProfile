import Link from 'next/link'
// Using Font Awesome icons instead
import { portfolioData } from '@/data/portfolio'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass-purple text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
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
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
              >
                <i className="fab fa-github text-lg"></i>
              </a>
              <a 
                href={portfolioData.social.linkedin} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
              >
                <i className="fab fa-linkedin text-lg"></i>
              </a>
              <a 
                href={portfolioData.social.leetcode} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
              >
                <i className="fas fa-code text-lg"></i>
              </a>
              <a 
                href={portfolioData.social.codechef} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
              >
                <i className="fas fa-trophy text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="#about" className="text-white/70 hover:text-white transition-colors duration-200">About Me</Link></li>
              <li><Link href="#projects" className="text-white/70 hover:text-white transition-colors duration-200">Projects</Link></li>
              <li><Link href="#skills" className="text-white/70 hover:text-white transition-colors duration-200">Skills</Link></li>
              <li><Link href="#achievements" className="text-white/70 hover:text-white transition-colors duration-200">Achievements</Link></li>
              <li><Link href="#contact" className="text-white/70 hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Technologies</h3>
            <ul className="space-y-4">
              <li><span className="text-white/70">React & Next.js</span></li>
              <li><span className="text-white/70">Python & Flask</span></li>
              <li><span className="text-white/70">Machine Learning</span></li>
              <li><span className="text-white/70">Computer Vision</span></li>
              <li><span className="text-white/70">Full Stack Development</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt w-5 h-5 text-purple-300 mt-1 flex-shrink-0"></i>
                <p className="text-white/70">
                  {portfolioData.contact.location}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope w-5 h-5 text-purple-300 flex-shrink-0"></i>
                <a 
                  href={`mailto:${portfolioData.contact.email}`}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  {portfolioData.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone w-5 h-5 text-purple-300 flex-shrink-0"></i>
                <p className="text-white/70">{portfolioData.contact.availability}</p>
              </div>
            </div>

            {/* Resume Download */}
            <div className="mt-8">
              <Link
                href={portfolioData.personal.resume}
                target="_blank"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                <i className="fas fa-download"></i>
                <span>Download Resume</span>
              </Link>
            </div>
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