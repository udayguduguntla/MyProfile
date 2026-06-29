'use client'

import { useState } from 'react'
import { portfolioData } from '@/data/portfolio'
import ModernNavigation from '../components/ModernNavigation'
import InteractiveStarBackground from '../components/InteractiveStarBackground'
import EnhancedImageModal from '../components/EnhancedImageModal'
import achievementsData from '@/data/achievements.json'
import Image from 'next/image'

export default function AchievementsPage() {
  const realAchievements = achievementsData.achievements
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    title: string
    type: 'image' | 'pdf'
  } | null>(null)

  const openImageModal = (imageSrc: string, title: string, type: 'image' | 'pdf') => {
    setSelectedImage({ src: imageSrc, title, type })
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      <InteractiveStarBackground variant="achievements" />
      <ModernNavigation />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Modern Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Achievements & Recognition
            </h1>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              A showcase of accomplishments, certifications, and milestones in my journey
            </p>
          </div>

          {/* Education Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Educational Journey</h2>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-violet-600 mx-auto rounded-full"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {portfolioData.education.map((edu, index) => (
                  <div key={index} className="glass-purple rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-white">{edu.degree}</h4>
                          <span className="px-4 py-2 bg-purple-500/30 text-purple-100 rounded-full text-sm font-medium border border-purple-400/30">
                            {edu.period}
                          </span>
                        </div>
                        <p className="text-lg text-purple-300 font-semibold mb-3">{edu.institution}</p>
                        <p className="text-white/80 leading-relaxed">{edu.description}</p>
                        {edu.status === 'current' && (
                          <div className="mt-4 flex items-center text-green-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-sm font-medium">Currently Pursuing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real Achievements Section */}
          <div className="mb-16 sm:mb-20">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Featured Achievements</h2>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-purple-600 to-purple-700 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {realAchievements.map((achievement: any, index: number) => (
                <div 
                  key={achievement.id}
                  className="purple-card overflow-hidden group cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  onClick={() => openImageModal(`/achievements/${achievement.image}`, achievement.title, achievement.type)}
                >
                  {/* Image/PDF Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-purple-700/20 overflow-hidden">
                    {achievement.type === 'pdf' ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl text-red-400 mb-2">📄</div>
                          <p className="text-white font-medium">PDF Document</p>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={`/achievements/${achievement.image}`}
                        alt={achievement.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600 text-white text-sm font-bold rounded-full">
                      {achievement.rank}
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                      {achievement.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {achievement.description.length > 150 ? `${achievement.description.substring(0, 150)}...` : achievement.description}
                    </p>
                    
                    {/* Highlights */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-purple-200 mb-2">Key Highlights:</h4>
                      <ul className="space-y-1">
                        {achievement.highlights.slice(0, 2).map((highlight: string, idx: number) => (
                          <li key={idx} className="text-xs text-gray-400 flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <span className="text-xs text-gray-400 flex items-center">
                        <i className="fas fa-calendar mr-1"></i>
                        {achievement.date}
                      </span>
                      <div className="flex items-center text-purple-300 text-sm">
                        <span>Click to view</span>
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {achievement.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20">
            <div className="glass-purple rounded-2xl p-12 text-white text-center">
              <h3 className="text-3xl font-bold mb-6">Ready to Collaborate?</h3>
              <p className="text-xl mb-8 opacity-90">
                Let's work together to create something amazing and impactful.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 backdrop-blur-sm border border-white/20"
              >
                <span>Get In Touch</span>
                <i className="fas fa-arrow-right ml-3"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {selectedImage && (
        <EnhancedImageModal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          imageSrc={selectedImage.src}
          title={selectedImage.title}
          type={selectedImage.type}
        />
      )}
    </div>
  )
}