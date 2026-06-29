'use client'

import { portfolioData } from '@/data/portfolio'
import ModernNavigation from '../components/ModernNavigation'
import InteractiveStarBackground from '../components/InteractiveStarBackground'

export default function AboutPage() {
  const highlights = [
    {
      icon: '🎯',
      title: 'Goal-Oriented',
      description: 'Focused on delivering results and achieving objectives with precision and dedication'
    },
    {
      icon: '💻',
      title: 'Technical Expertise', 
      description: 'Proficient in modern web technologies, programming languages, and development frameworks'
    },
    {
      icon: '💡',
      title: 'Problem Solver',
      description: 'Creative approach to solving complex technical challenges with innovative solutions'
    },
    {
      icon: '👥',
      title: 'Team Player',
      description: 'Excellent collaboration and communication skills in diverse team environments'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <InteractiveStarBackground variant="about" />
      <ModernNavigation />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 pt-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              About Me
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-purple-200 max-w-3xl mx-auto">
              Get to know more about my journey, passion, and dedication to technology and innovation.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start mb-16 sm:mb-20">
            {/* Profile Image */}
            <div className="relative order-first lg:order-none">
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
                {/* Purple Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-2xl opacity-30"></div>
                
                {/* Profile Frame */}
                <div className="relative purple-card p-4 sm:p-6 lg:p-8 shadow-2xl">
                  <div className="w-full h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <div className="w-20 sm:w-24 lg:w-32 h-20 sm:h-24 lg:h-32 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
                        {portfolioData.personal.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 glass-purple rounded-lg flex items-center justify-center text-purple-200 shadow-lg animate-bounce">
                    <span className="text-sm sm:text-base lg:text-xl">💻</span>
                  </div>
                  <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 glass-purple rounded-lg flex items-center justify-center text-purple-200 shadow-lg animate-bounce animation-delay-1000">
                    <span className="text-sm sm:text-base lg:text-xl">🚀</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  {portfolioData.personal.title}
                </h2>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  {portfolioData.personal.description}
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  My passion lies in creating innovative solutions that make technology more accessible and impactful. 
                  From developing AI-powered accessibility tools to building comprehensive web applications, 
                  I strive to bridge the gap between complex technology and real-world problems.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="purple-card p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
                  <div className="group">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-300 group-hover:scale-110 transition-transform duration-300">4+</div>
                    <div className="text-xs sm:text-sm text-white">Major Projects</div>
                  </div>
                  <div className="group">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-300 group-hover:scale-110 transition-transform duration-300">2+</div>
                    <div className="text-xs sm:text-sm text-white">Years Learning</div>
                  </div>
                  <div className="group">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-300 group-hover:scale-110 transition-transform duration-300">10+</div>
                    <div className="text-xs sm:text-sm text-white">Technologies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">What Drives Me</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="purple-card p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group text-center"
                >
                  <div className="text-4xl sm:text-5xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-200">
                    {highlight.icon}
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                    {highlight.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Philosophy */}
          <div className="purple-card p-8 sm:p-12 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">My Philosophy</h3>
            <p className="text-lg sm:text-xl leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 text-purple-200">
              "{portfolioData.personal.tagline}"
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              I believe that technology should be a force for good, making life easier, more accessible, 
              and more connected. Every project I work on is an opportunity to create something meaningful 
              that can positively impact people's lives.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}