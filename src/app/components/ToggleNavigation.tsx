'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ToggleNavigation() {
  const pathname = usePathname()
  const getActiveTab = () => {
    if (pathname === '/') return 'home'
    if (pathname === '/about') return 'about'
    if (pathname === '/projects') return 'projects'
    if (pathname === '/achievements') return 'achievements'
    if (pathname === '/contact') return 'contact'
    return 'home'
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTab())

  const tabs = [
    { id: 'home', label: 'Home', href: '/', icon: 'fas fa-home' },
    { id: 'about', label: 'About', href: '/about', icon: 'fas fa-user' },
    { id: 'projects', label: 'Projects', href: '/projects', icon: 'fas fa-code' },
    { id: 'achievements', label: 'Achievements', href: '/achievements', icon: 'fas fa-trophy' },
    { id: 'contact', label: 'Contact', href: '/contact', icon: 'fas fa-envelope' }
  ]

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm sm:max-w-2xl px-4">
      <div className="toggle-bubble glass-enhanced rounded-full p-2 flex items-center justify-center overflow-x-auto animated-border">
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={`toggle-option px-2 sm:px-4 py-2 rounded-full flex items-center space-x-1 sm:space-x-2 font-medium text-xs whitespace-nowrap ${
                pathname === tab.href
                  ? 'active'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <i className={`${tab.icon} text-sm`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}