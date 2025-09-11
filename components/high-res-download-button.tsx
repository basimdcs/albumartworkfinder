'use client'

import React, { useState } from 'react'
import { trackDownload } from '@/components/google-analytics'
import { Download } from 'lucide-react'

interface HighResDownloadButtonProps {
  imageUrl: string
  albumTitle: string
  artistName: string
  className?: string
}

export default function HighResDownloadButton({ 
  imageUrl, 
  albumTitle, 
  artistName, 
  className = "" 
}: HighResDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const getHighResUrl = (url: string): string => {
    // Convert iTunes artwork URL to highest possible resolution (5000x5000px)
    return url
      .replace(/100x100bb/, '5000x5000bb')
      .replace(/300x300bb/, '5000x5000bb')
      .replace(/600x600bb/, '5000x5000bb')
      .replace(/1000x1000bb/, '5000x5000bb')
      .replace(/60x60bb/, '5000x5000bb')
      .replace(/30x30bb/, '5000x5000bb')
      .replace(/170x170bb/, '5000x5000bb')
  }

  const downloadHighResImage = async () => {
    if (!imageUrl || isDownloading) return

    setIsDownloading(true)
    
    try {
      const highResUrl = getHighResUrl(imageUrl)
      
      // Track download event
      trackDownload('download_5000px_artwork', albumTitle, highResUrl)
      
      // Fetch the high-res image
      const response = await fetch(highResUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch high-res image: ${response.status}`)
      }
      
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with 5000px indicator
      const filename = `${artistName} - ${albumTitle} [5000x5000].jpg`
        .replace(/[^a-z0-9\s\-\.\[\]]/gi, '') // Remove special characters except brackets
        .replace(/\s+/g, '_') // Replace spaces with underscores
      
      link.download = filename
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('High-res download completed:', filename)
    } catch (error) {
      console.error('Error downloading high-res image:', error)
      alert('Failed to download 5000px image. This resolution may not be available for this album.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={downloadHighResImage}
      disabled={isDownloading}
      className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg ${className}`}
    >
      <Download className="w-4 h-4" />
      {isDownloading ? 'Downloading 5000px...' : 'Download 5000×5000px'}
    </button>
  )
}