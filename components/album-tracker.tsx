'use client'

import { useEffect } from 'react'
import { trackAlbumPage } from '@/lib/search-tracking'
import type { Album } from '@/lib/api'

interface AlbumTrackerProps {
  albumId: string
  artist: string
  title: string
  slug: string
  isDirectVisit?: boolean
  relatedAlbums?: Album[] // Accept related albums
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
    // Track the main album page visit
    trackAlbumPage(albumId, artist, title, slug, isDirectVisit)
      .catch(console.error)

    // Track related albums that are displayed on the page
    if (relatedAlbums.length > 0) {
      relatedAlbums.forEach(album => {
        if (album.collectionId && album.artist && album.title) {
          const relatedSlug = `${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`
          // Track as non-direct visit since they appear as recommendations
          trackAlbumPage(album.collectionId, album.artist, album.title, relatedSlug, false)
            .catch(console.error)
        }
      })
    }
  }, [albumId, artist, title, slug, isDirectVisit, relatedAlbums])

  return null // This component does not render anything
}

// Helper function to create SEO-friendly slugs, duplicated to be self-contained
function createSEOSlug(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
} 