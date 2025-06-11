'use client'

import { useState, useEffect } from 'react'
import { getTopAlbums, getTopSingles, createSEOSlug } from "@/lib/api"
import type { Album } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"
import SearchForm from "@/components/search-form"

// Pre-defined popular content for instant loading
const POPULAR_ARTISTS = [
  { id: 'taylor-swift', name: 'Taylor Swift' },
  { id: 'drake', name: 'Drake' },
  { id: 'the-beatles', name: 'The Beatles' },
  { id: 'adele', name:'Adele' },
  { id: 'ed-sheeran', name: 'Ed Sheeran' },
  { id: 'billie-eilish', name: 'Billie Eilish' },
  { id: 'post-malone', name: 'Post Malone' },
  { id: 'ariana-grande', name: 'Ariana Grande' },
]

// Static fallback data for immediate display
const FALLBACK_ALBUMS: Album[] = [
  {
    id: '1',
    title: 'Midnights',
    artist: 'Taylor Swift',
    imageUrl: '/placeholder.svg',
    year: '2022'
  },
  {
    id: '2', 
    title: 'Anti',
    artist: 'Rihanna',
    imageUrl: '/placeholder.svg',
    year: '2016'
  },
  {
    id: '3',
    title: 'Abbey Road',
    artist: 'The Beatles', 
    imageUrl: '/placeholder.svg',
    year: '1969'
  }
]

export default function Home() {
  const [topAlbums, setTopAlbums] = useState<Album[]>(FALLBACK_ALBUMS)
  const [topSingles, setTopSingles] = useState<Album[]>(FALLBACK_ALBUMS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data in parallel
        const [albumsResult, singlesResult] = await Promise.allSettled([
          getTopAlbums(),
          getTopSingles()
        ])
        
        if (albumsResult.status === 'fulfilled' && albumsResult.value.length > 0) {
          setTopAlbums(albumsResult.value)
        }
        
        if (singlesResult.status === 'fulfilled' && singlesResult.value.length > 0) {
          setTopSingles(singlesResult.value)
        }
      } catch (error) {
        console.error('Error loading homepage data:', error)
        // Keep fallback data
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center text-white">
            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Find High-Quality
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Album Artwork
              </span>
            </h1>
            <p className="mb-8 text-lg opacity-90 md:text-xl">
              Search millions of album covers from the iTunes catalog. Download high-resolution artwork for free.
            </p>
            
            {/* Search Form Component */}
            <SearchForm />
            
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm opacity-75">
              <span>Popular:</span>
              {['Taylor Swift', 'Drake', 'The Beatles', 'Adele'].map((artist) => (
                <Link
                  key={artist}
                  href={`/search?q=${encodeURIComponent(artist)}`}
                  className="rounded-full bg-white/20 px-3 py-1 transition-colors hover:bg-white/30"
                >
                  {artist}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Top Albums */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Top Albums
                {loading && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
              </h2>
              <Link 
                href="/search?q=2024 albums" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {topAlbums.slice(0, 12).map((album, index) => (
                <Link 
                  key={album.id || index} 
                  href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all group-hover:shadow-xl group-hover:scale-105">
                    <Image
                      src={album.imageUrl || "/placeholder.svg"}
                      alt={`${album.title} by ${album.artist}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 space-y-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{album.title}</h3>
                    <p className="text-xs text-gray-600 truncate">{album.artist}</p>
                    {album.year && <p className="text-xs text-gray-500">{album.year}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Singles */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Top Songs
                {loading && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
              </h2>
              <Link 
                href="/search?q=2024 hits" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {topSingles.slice(0, 12).map((album, index) => (
                <Link 
                  key={album.id || index} 
                  href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all group-hover:shadow-xl group-hover:scale-105">
                    <Image
                      src={album.imageUrl || "/placeholder.svg"}
                      alt={`${album.title} by ${album.artist}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 space-y-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{album.title}</h3>
                    <p className="text-xs text-gray-600 truncate">{album.artist}</p>
                    {album.year && <p className="text-xs text-gray-500">{album.year}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Popular Artists */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Popular Artists</h2>
              <Link 
                href="/search" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Explore All →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
              {POPULAR_ARTISTS.map((artist) => (
                <Link 
                  key={artist.id} 
                  href={`/search?q=${encodeURIComponent(artist.name)}`} 
                  className="group text-center"
                >
                  <div className="mx-auto mb-3 h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
                    <div className="flex h-full w-full items-center justify-center text-white font-bold text-lg">
                      {artist.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{artist.name}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Features Section */}
        <section className="mt-16 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Why Choose AlbumArtworkFinder?</h2>
              <div className="space-y-3">
                {[
                  'High-resolution album covers (up to 1000x1000px)',
                  'Millions of albums from all genres and eras',
                  'Fast and accurate search results',
                  'Free to use - no registration required',
                  'Mobile-friendly responsive design'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
                <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-900">Start Searching Now</p>
              <p className="text-gray-600">Find the perfect album artwork for your collection</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
