'use client'

import { useState, useEffect } from 'react'
import { getTopAlbums, getTopSingles, createSEOSlug } from "@/lib/api"
import type { Album } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"
import SearchForm from "@/components/search-form"

// Pre-defined popular content for instant loading
const POPULAR_ARTISTS = [
  { id: 'taylor-swift', name: 'Taylor Swift', genre: 'Pop' },
  { id: 'drake', name: 'Drake', genre: 'Hip-Hop' },
  { id: 'the-beatles', name: 'The Beatles', genre: 'Rock' },
  { id: 'adele', name:'Adele', genre: 'Soul' },
  { id: 'ed-sheeran', name: 'Ed Sheeran', genre: 'Pop' },
  { id: 'billie-eilish', name: 'Billie Eilish', genre: 'Alternative' },
  { id: 'post-malone', name: 'Post Malone', genre: 'Hip-Hop' },
  { id: 'ariana-grande', name: 'Ariana Grande', genre: 'Pop' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section - Compact PlacesPro inspired */}
      <section className="relative overflow-hidden">
        {/* Background Pattern - matching PlacesPro colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-20 right-20 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center text-white">
            {/* Main Heading - More compact */}
            <div className="mb-6">
              <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Discover Amazing
                <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  Album Artwork
                </span>
              </h1>
              <p className="mx-auto max-w-xl text-base opacity-90 md:text-lg">
                Search millions of high-quality album covers from your favorite artists
              </p>
            </div>
            
            {/* Search Form */}
            <div className="mb-6">
              <SearchForm />
            </div>
            
            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-slate-300">Try:</span>
              {['Taylor Swift', 'Drake', 'The Beatles', 'Adele'].map((artist) => (
                <Link
                  key={artist}
                  href={`/search?q=${encodeURIComponent(artist)}`}
                  className="rounded-full bg-white/10 px-3 py-1 transition-all hover:bg-white/20 hover:scale-105"
                >
                  {artist}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">

        {/* Featured Albums Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Featured Albums
                {loading && <span className="ml-3 text-sm text-gray-500">Loading...</span>}
              </h2>
              <p className="mt-2 text-gray-600">Trending album artwork from top artists</p>
            </div>
            <Link 
              href="/search?q=2024 albums" 
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              View All
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {topAlbums.slice(0, 12).map((album, index) => (
              <Link 
                key={album.id || index} 
                href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-lg transition-all group-hover:shadow-2xl group-hover:scale-105">
                  <Image
                    src={album.imageUrl || "/placeholder.svg"}
                    alt={`${album.title} by ${album.artist}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-medium truncate">{album.title}</p>
                    <p className="text-xs opacity-80 truncate">{album.artist}</p>
                  </div>
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

        {/* Popular Artists Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Popular Artists</h2>
            <p className="mt-2 text-gray-600">Discover artwork from the most searched artists</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
            {POPULAR_ARTISTS.map((artist) => (
              <Link 
                key={artist.id} 
                href={`/search?q=${encodeURIComponent(artist.name)}`} 
                className="group text-center"
              >
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
                  <div className="flex h-full w-full items-center justify-center text-white font-bold text-lg">
                    {artist.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">{artist.name}</p>
                  <p className="text-xs text-gray-500">{artist.genre}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Songs Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Latest Songs
                {loading && <span className="ml-3 text-sm text-gray-500">Loading...</span>}
              </h2>
              <p className="mt-2 text-gray-600">Fresh tracks and their stunning artwork</p>
            </div>
            <Link 
              href="/search?q=2024 hits" 
              className="flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
            >
              View All
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {topSingles.slice(0, 12).map((album, index) => (
              <Link 
                key={album.id || index} 
                href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-lg transition-all group-hover:shadow-2xl group-hover:scale-105">
                  <Image
                    src={album.imageUrl || "/placeholder.svg"}
                    alt={`${album.title} by ${album.artist}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-xs font-medium truncate">{album.title}</p>
                    <p className="text-xs opacity-80 truncate">{album.artist}</p>
                  </div>
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
      </div>

      {/* Features Section - PlacesPro inspired */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Why Choose AlbumArtworkFinder?</h2>
            <p className="mb-12 text-gray-600">Everything you need to discover and download high-quality album artwork</p>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: '🎨',
                  title: 'High-Resolution Artwork',
                  description: 'Access album covers up to 1000x1000px resolution for crystal-clear quality'
                },
                {
                  icon: '📱',
                  title: 'Mobile-First Design',
                  description: 'Optimized for all devices with touch-friendly interfaces and fast loading'
                },
                {
                  icon: '🚀',
                  title: 'Lightning Fast Search',
                  description: 'Instant search results from millions of albums with advanced CORS handling'
                },
                {
                  icon: '🆓',
                  title: 'Completely Free',
                  description: 'No registration, no fees, no limits. Just pure album artwork discovery'
                },
                {
                  icon: '🌍',
                  title: 'Global Music Library',
                  description: 'Access artwork from artists worldwide across all genres and eras'
                },
                {
                  icon: '🔧',
                  title: 'Advanced Technology',
                  description: 'Built with Next.js 15 and Vercel Edge Functions for optimal performance'
                }
              ].map((feature, index) => (
                <div key={index} className="rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center transition-all hover:shadow-lg hover:scale-105">
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl text-white">
            <h2 className="mb-4 text-3xl font-bold">Start Discovering Today</h2>
            <p className="mb-8 text-blue-100">
              Join thousands of music lovers who trust AlbumArtworkFinder for their album artwork needs
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:scale-105"
            >
              Start Searching
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
