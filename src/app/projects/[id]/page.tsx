'use client'

import { useParams } from 'next/navigation'
import { portfolioData } from '@/data/portfolio'
import ToggleNavigation from '../../components/ToggleNavigation'
import ImpressiveBackground from '../../components/ImpressiveBackground'
import Link from 'next/link'

function getDemoHref(projectId: string) {
  return `/projects/${projectId}/demo`
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params?.id as string
  
  const project = portfolioData.projects.find(p => p.id === projectId)
  
  if (!project) {
    return (
      <div className="min-h-screen relative pt-24 pb-16">
        <ImpressiveBackground variant="projects" />
        <ToggleNavigation />
        
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Project Not Found</h1>
            <p className="text-white/80 mb-8">The project you're looking for doesn't exist.</p>
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-medium"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      {/* Purple gradient background with animated elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-purple-400/25 rounded-full blur-2xl animate-pulse-glow"></div>
      </div>

      <ToggleNavigation />
      
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Projects
            </Link>
          </div>

          {/* Project Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 glass-purple text-white rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {project.status === 'completed' ? 'Completed Project' : 'In Progress'}
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6">
              {project.title}
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              {project.description}
            </p>

            {project.featured && (
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold animate-pulse-glow">
                ⭐ Featured Project
              </div>
            )}
          </div>

          {/* Project Image/Demo */}
          <div className="mb-16">
            <div className="glass-enhanced interactive-glow rounded-2xl p-8 text-center">
              <div className="h-96 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="text-8xl opacity-60">
                  {project.category === 'Computer Vision' && '👁️'}
                  {project.category === 'Machine Learning' && '🧠'}
                  {project.category === 'Web Automation' && '🤖'}
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors duration-200 font-medium backdrop-blur-sm border border-white/20"
                >
                  <i className="fab fa-github mr-2"></i>
                  View Source Code
                </a>
                <a
                  href={getDemoHref(project.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Live Demo
                </a>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Technologies Used */}
            <div className="glass-purple rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Technologies Used</h2>
              <div className="grid grid-cols-2 gap-4">
                {project.technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-white/10 rounded-lg border border-white/20"
                  >
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                    <span className="text-white font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="glass-purple rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
              <ul className="space-y-4">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Project Details */}
          <div className="glass-purple rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Project Overview</h2>
            <div className="prose prose-lg max-w-none text-white/80">
              <p className="text-lg leading-relaxed mb-6">
                {project.description}
              </p>
              
              {project.id === 'color-detection' && (
                <div className="space-y-6">
                  <p>
                    This revolutionary accessibility tool was designed with a clear mission: to make the digital world more inclusive 
                    for people with color vision deficiency. Using advanced computer vision techniques and real-time processing, 
                    the application can identify colors through a live camera feed and provide immediate voice feedback.
                  </p>
                  <p>
                    The system uses OpenCV for image processing and color detection algorithms to accurately identify colors in 
                    real-time. The voice feedback feature ensures that users receive immediate audio confirmation of detected colors, 
                    making it an invaluable tool for daily activities.
                  </p>
                </div>
              )}

              {project.id === 'license-plate-recognition' && (
                <div className="space-y-6">
                  <p>
                    This Automatic Number Plate Recognition (ANPR) system represents a significant advancement in traffic management 
                    and vehicle identification technology. Using sophisticated computer vision algorithms and OCR technology, 
                    the system can automatically detect and read license plates from images and video streams.
                  </p>
                  <p>
                    The application processes images in real-time, detecting license plate regions and extracting text using 
                    advanced OCR techniques. This makes it suitable for various applications including parking management, 
                    traffic monitoring, and security systems.
                  </p>
                </div>
              )}

              {project.id === 'face-attendance' && (
                <div className="space-y-6">
                  <p>
                    This comprehensive attendance management system revolutionizes how educational institutions and organizations 
                    track attendance. By leveraging facial recognition technology, the system eliminates the need for manual 
                    attendance marking while ensuring accuracy and preventing proxy attendance.
                  </p>
                  <p>
                    Built with Flask as the backend framework, the system provides a complete web-based solution with user 
                    management, real-time face recognition, and comprehensive reporting capabilities. The system can handle 
                    multiple users simultaneously and maintains detailed attendance records.
                  </p>
                </div>
              )}

              {project.id === 'traffic-generation' && (
                <div className="space-y-6">
                  <p>
                    This sophisticated web automation tool demonstrates advanced programming concepts in Java and Selenium. 
                    The system is designed to generate controlled website traffic for testing and analytics purposes, 
                    featuring proxy management and detailed analytics tracking.
                  </p>
                  <p>
                    The application uses multi-threading to simulate realistic user behavior and can be configured to generate 
                    various traffic patterns. With integrated proxy support and comprehensive analytics, it provides valuable 
                    insights for website performance testing and optimization.
                  </p>
                </div>
              )}

              {project.id === 'plant-doctor' && (
                <div className="space-y-6">
                  <p>
                    The Plant Doctor & Fertilizer Advisor is an intelligent computer vision application that diagnoses plant 
                    health issues from leaf images. Using HSV color space segmentation, it analyzes leaf tissue composition 
                    to detect healthy green areas, chlorosis (yellowing from nutrient deficiency), necrosis (brown spots from 
                    fungal/bacterial infection), and powdery mildew (white fungal coating).
                  </p>
                  <p>
                    Beyond diagnosis, the system generates comprehensive treatment plans with specific NPK fertilizer ratios, 
                    organic alternatives (neem oil, bone meal, compost tea), chemical control options, and cultural practice 
                    adjustments. The application features a premium glassmorphic Streamlit dashboard with a dynamic 
                    constellation particle animation background for an immersive user experience.
                  </p>
                  <p>
                    Built entirely with Python, OpenCV, NumPy, and Streamlit, the source is available through the code link
                    for review and deployment. You can explore the full implementation including the color segmentation engine,
                    diagnostic logic, and custom UI components.
                  </p>
                  <a
                    href={getDemoHref(project.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-4"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Open Project Demo
                  </a>
                </div>
              )}

              {project.id === 'license-plate-reader' && (
                <div className="space-y-6">
                  <p>
                    The License Plate Reader is a production-ready Automatic Number Plate Recognition (ANPR) system that 
                    combines OpenCV contour detection with Tesseract OCR to accurately locate and read vehicle license 
                    plates from images. The system processes uploaded images through a pipeline of edge detection, 
                    contour approximation, perspective correction, and optical character recognition.
                  </p>
                  <p>
                    The application features a sleek Streamlit dashboard with real-time visual feedback, displaying the 
                    original image alongside the annotated detection with bounding boxes and extracted plate text. The 
                    cropped plate region is also shown for verification, and the system handles various image formats 
                    including JPG, PNG, BMP, and WebP.
                  </p>
                  <p>
                    Built with Python, OpenCV, Tesseract OCR, and Streamlit, this project demonstrates practical computer 
                    vision and OCR integration. The source includes the CLI version for batch processing and the Streamlit
                    web application with the premium constellation background.
                  </p>
                  <a
                    href={getDemoHref(project.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-4"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Open Project Demo
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Related Projects */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Explore More Projects</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {portfolioData.projects
                .filter(p => p.id !== project.id)
                .slice(0, 3)
                .map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.id}`}
                    className="glass-purple rounded-xl p-6 hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {relatedProject.category === 'Computer Vision' && '👁️'}
                      {relatedProject.category === 'Machine Learning' && '🧠'}
                      {relatedProject.category === 'Web Automation' && '🤖'}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {relatedProject.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {relatedProject.description.substring(0, 100)}...
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
