'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { searchAll, createSEOSlug, type Album } from '@/lib/api'
import AlbumCard from '@/components/album-card'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setAlbums([])
        return
      }

      setLoading(true)
      setError(null)
      
      try {
        const results = await searchAll(query)
        setAlbums(results)
      } catch (err) {
        setError('Failed to search albums. Please try again.')
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query])

  // Update document title and meta description dynamically
  useEffect(() => {
    if (query) {
      document.title = `Search Results for "${query}" | AlbumArtworkFinder.com`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Browse album artwork search results for "${query}". Find album covers and artwork for your favorite music.`
        )
      }
    } else {
      document.title = 'Search Album Artwork | AlbumArtworkFinder.com'
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          'Search our database for album artwork and covers from thousands of artists and albums.'
        )
      }
    }
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb for SEO */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">Search</li>
          {query && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700 font-medium">"{query}"</li>
            </>
          )}
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          {query ? `Album Artwork Search Results for "${query}"` : 'Search Album Artwork'}
        </h1>
        {query && !loading && (
          <p className="text-gray-600">
            {albums.length > 0 
              ? `Found ${albums.length} ${albums.length === 1 ? 'result' : 'results'} for "${query}"`
              : `No results found for "${query}"`
            }
          </p>
        )}
        {loading && (
          <p className="text-gray-600">Searching for album artwork...</p>
        )}
      </div>

      {/* Search Form */}
      <div className="mb-8 rounded-lg bg-gray-50 p-6">
        <form className="flex max-w-2xl flex-col gap-2 sm:flex-row" action="/search" method="GET">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by artist, album, or song name..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:rounded-r-none"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:rounded-l-none"
          >
            Search
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-600">
          Search for album artwork from millions of songs and albums in the iTunes catalog
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {query ? (
        loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {/* Loading skeleton */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : albums.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all group-hover:shadow-lg group-hover:scale-105">
                    <img
                      src={album.imageUrl || "/placeholder.svg"}
                      alt={`${album.title} by ${album.artist}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{album.title}</h3>
                    <p className="text-xs text-gray-600 truncate">{album.artist}</p>
                    {album.year && <p className="text-xs text-gray-500">{album.year}</p>}
                  </div>
                </Link>
              ))}
            </div>
            
            {/* SEO Content */}
            <section className="mt-12 rounded-lg bg-gray-50 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                About Album Artwork Search Results for "{query}"
              </h2>
              <p className="mb-4 text-gray-700">
                Discover high-quality album artwork and covers for "{query}". Our search results include 
                album covers from the iTunes catalog, featuring both popular and rare releases. Each album 
                artwork is available in high resolution (up to 1000x1000px), perfect for music enthusiasts and collectors.
              </p>
              <p className="text-gray-700">
                Browse through {albums.length} album{albums.length !== 1 ? 's' : ''} matching your search 
                for "{query}" and find the perfect album artwork for your music collection.
              </p>
            </section>
          </>
        ) : (
          <div className="rounded-lg bg-background-alt p-8 text-center">
            <h2 className="mb-4 text-xl font-semibold">No album artwork found</h2>
            <p className="mb-6 text-gray-600">
              We couldn't find any album artwork matching "{query}". Try searching with different keywords 
              or check the spelling of the artist or album name.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Search tips:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Try searching with just the artist name</li>
                <li>Use the full album title</li>
                <li>Check for alternative spellings</li>
                <li>Try searching for individual song names</li>
              </ul>
            </div>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-primary px-6 py-2 font-medium text-white transition-colors hover:bg-primary/90"
            >
              Return to Home
            </Link>
          </div>
        )
      ) : (
        <div className="rounded-lg bg-background-alt p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold">Search for Album Artwork</h2>
          <p className="mb-6 text-gray-600">
            Enter an artist name, album title, or song name to find high-quality album artwork 
            from millions of albums in our database.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Taylor Swift',
              'Drake',
              'The Beatles',
              'Adele',
              'Ed Sheeran',
              'Billie Eilish',
              'Post Malone',
              'Ariana Grande'
            ].map((artist) => (
              <Link
                key={artist}
                href={`/search?q=${encodeURIComponent(artist)}`}
                className="rounded-lg bg-white p-4 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <div className="text-center">
                  <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {artist.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="font-medium">{artist}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 