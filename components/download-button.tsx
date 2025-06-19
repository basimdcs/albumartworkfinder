'use client'

import React, { useState } from 'react'
import { trackDownload } from '@/components/google-analytics'

interface DownloadButtonProps {
  imageUrl: string
  albumTitle: string
  artistName: string
}

export default function DownloadButton({ imageUrl, albumTitle, artistName }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadImage = async () => {
    if (!imageUrl || isDownloading) return

    setIsDownloading(true)
    
    try {
      // Track download event
      trackDownload('download_artwork', albumTitle, imageUrl)
      
      // Fetch the image
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename
      const filename = `${artistName} - ${albumTitle}.jpg`
        .replace(/[^a-z0-9\s\-\.]/gi, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
      
      link.download = filename
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('Download completed:', filename)
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Failed to download image. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={downloadImage}
      disabled={isDownloading}
      className="inline-flex items-center rounded-lg bg-primary px-6 py-2 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {isDownloading ? 'Downloading...' : 'Download Artwork'}
    </button>
  )
} 