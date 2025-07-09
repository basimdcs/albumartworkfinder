'use client'

import { useEffect } from 'react'

// Helper function to create SEO-friendly slugs
function createSEOSlug(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface AlbumTrackerProps {
  albumId: string
  artist: string
  title: string
  slug: string
  isDirectVisit?: boolean
  relatedAlbums?: any[] // Accept related albums
}

// Client-side component to track album page visits without blocking rendering
export default function AlbumTracker({
  albumId,
  artist,
  title,
  slug,
  isDirectVisit = true,
  relatedAlbums = [], // Default to empty array
}: AlbumTrackerProps) {
  useEffect(() => {
    // Track the main album page visit via API
    fetch('/api/track-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'album', 
        albumId, 
        artist, 
        title, 
        slug, 
        isDirectVisit 
      }),
    }).catch(console.error)

    // Track related albums that are displayed on the page
    if (relatedAlbums.length > 0) {
      const albumData = relatedAlbums.map(album => ({
        albumId: album.collectionId || album.id,
        artist: album.artist,
        title: album.title,
        slug: `${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`,
      }))

      fetch('/api/track-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'album-batch', albums: albumData }),
      }).catch(console.error)
    }
  }, [albumId, artist, title, slug, isDirectVisit, relatedAlbums])

  return null // This component does not render anything
}