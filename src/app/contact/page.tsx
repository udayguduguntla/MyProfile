'use client'

import { useState } from 'react'
import { portfolioData } from '@/data/portfolio'
import ModernNavigation from '../components/ModernNavigation'
import InteractiveStarBackground from '../components/InteractiveStarBackground'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // You can integrate with email services like EmailJS, Formspree, etc.
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      <InteractiveStarBackground variant="contact" />
      <ModernNavigation />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Have a project in mind? I'd love to hear about it. Let's discuss how we can work together 
              to bring your ideas to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-8 sm:space-y-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                  Let's Connect
                </h2>
                <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8">
                  {portfolioData.contact.availability}
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-6 glass-purple rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-envelope text-lg sm:text-2xl"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Email</h3>
                    <a 
                      href={`mailto:${portfolioData.contact.email}`}
                      className="text-purple-300 hover:text-purple-200 transition-colors duration-200 text-sm sm:text-lg break-all"
                    >
                      {portfolioData.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-6 glass-purple rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-violet-600 to-pink-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-lg sm:text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Location</h3>
                    <p className="text-white/80 text-sm sm:text-lg">{portfolioData.contact.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-6 glass-purple rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <i className="fas fa-clock text-lg sm:text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Response Time</h3>
                    <p className="text-white/80 text-sm sm:text-lg">Usually within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Connect With Me</h3>
                <div className="flex space-x-3 sm:space-x-6">
                  <a
                    href={portfolioData.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 group backdrop-blur-sm border border-white/20"
                  >
                    <i className="fab fa-github text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-200"></i>
                  </a>
                  <a
                    href={portfolioData.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 group backdrop-blur-sm border border-white/20"
                  >
                    <i className="fab fa-linkedin text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-200"></i>
                  </a>
                  <a
                    href={portfolioData.social.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 group backdrop-blur-sm border border-white/20"
                  >
                    <i className="fas fa-code text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-200"></i>
                  </a>
                  <a
                    href={portfolioData.social.codechef}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 group backdrop-blur-sm border border-white/20"
                  >
                    <i className="fas fa-trophy text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-200"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-enhanced interactive-glow rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8">Send Me a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-white mb-3">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-white/60 backdrop-blur-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-white mb-3">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-white/60 backdrop-blur-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-white mb-3">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-white/60 backdrop-blur-sm"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white mb-3">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-white placeholder-white/60 backdrop-blur-sm"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Send Message
                  <i className="fas fa-paper-plane ml-3"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}