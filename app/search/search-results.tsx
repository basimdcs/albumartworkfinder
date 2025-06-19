'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchAlbums, type Album } from '@/lib/api'
import { trackEvent } from '@/components/google-analytics'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RefreshCw, Music } from 'lucide-react'

// Inline SEO slug function to avoid webpack issues
const createSEOSlug = (text: string): string => {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    // Replace special characters and symbols with hyphens
    .replace(/[^\w\s-]/g, '-')
    // Replace multiple spaces or hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 70 characters for better SEO
    .substring(0, 70)
    .replace(/-+$/, '') // Remove trailing hyphen if substring cuts mid-word
}

interface SearchResultsProps {
  query: string
}

// Track search query via API - fire and forget for performance
async function trackSearch(query: string, resultCount: number) {
  try {
    // Don't await - fire and forget to avoid blocking UI
    fetch('/api/track-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'search', query, resultCount }),
    }).catch(console.error)
  } catch (error) {
    console.error('Search tracking failed:', error)
  }
}

// Track a batch of album pages via API - fire and forget
async function trackAlbumBatch(albums: Album[]) {
  try {
    const albumData = albums.map(album => ({
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
  } catch (error) {
    console.error('Album batch tracking failed:', error)
  }
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setAlbums([])
      return
    }
      
      setLoading(true)
      setError(null)

    try {
      const results = await searchAlbums(query)
      setAlbums(results)
      
      // Track the search query with result count (fire and forget)
      trackSearch(query, results.length)
      
      // Track the entire batch of albums that appear in search results
      if (results.length > 0) {
        trackAlbumBatch(results)
      }
      
      // Track Google Analytics search event (fast, client-side)
      trackEvent('search_results', {
        search_term: query,
        result_count: results.length,
        search_type: 'album_artwork'
      })
    } catch (err) {
      console.error('Search failed:', err)
      setError('Search failed. Please check your connection and try again.')
      setAlbums([])
      
      // Track search error
      trackEvent('search_error', {
        search_term: query,
        error_message: 'Search failed'
      })
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const handleAlbumClick = (album: Album) => {
    // Track album click event (fast, client-side)
    trackEvent('album_click', {
      album_id: album.collectionId || album.id,
      album_title: album.title,
      artist_name: album.artist,
      click_source: 'search_results'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-blue-700 font-medium">Searching for albums...</span>
          </div>
            </div>
            
        {/* Loading grid with 25 items */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="group">
              <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse mb-3">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={handleSearch} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  if (albums.length === 0 && query.trim()) {
    return (
      <div className="text-center py-12">
        <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No albums found</h3>
          <p className="text-gray-600 mb-4">
          Try searching for a different artist or album name
          </p>
          <div className="text-sm text-gray-500">
          Popular searches: Taylor Swift, Drake, The Beatles, Billie Eilish
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
      {albums.map((album, index) => {
        const slug = `${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`
        const albumUrl = `/album/${album.collectionId || album.id}/${slug}`
        
        return (
          <Link 
            key={album.collectionId || album.id} 
            href={albumUrl}
            onClick={() => handleAlbumClick(album)}
            className="group block"
          >
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 shadow-sm hover:shadow-md transition-shadow">
              <Image
                src={album.imageUrl}
                alt={`${album.title} by ${album.artist}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                priority={index < 6}
                quality={65}
          />
      </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">
                {album.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-1">
                {album.artist}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{album.year || 'Unknown'}</span>
                <span>{album.trackCount || 0} tracks</span>
          </div>
        </div>
          </Link>
        )
      })}
    </div>
  )
} 