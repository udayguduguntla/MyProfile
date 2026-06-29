'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  title: string
  type: 'image' | 'pdf'
}

export default function ImageModal({ isOpen, onClose, imageSrc, title, type }: ImageModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <i className="fas fa-times text-2xl"></i>
        </button>
        
        <div className="glass-enhanced rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-bold text-lg">{title}</h3>
          </div>
          
          <div className="p-4">
            {type === 'pdf' ? (
              <div className="text-center">
                <div className="mb-4">
                  <i className="fas fa-file-pdf text-6xl text-red-400 mb-4"></i>
                  <p className="text-white mb-4">PDF Document</p>
                </div>
                <a
                  href={imageSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Open PDF in New Tab
                </a>
              </div>
            ) : (
              <div className="relative w-full h-96">
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}