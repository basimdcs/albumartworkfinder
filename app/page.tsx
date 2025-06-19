'use client'

import { useState, useEffect } from 'react'
import { getTopAlbums, getTopSingles } from "@/lib/api"
import { createSEOSlug } from "@/lib/utils"
import type { Album } from "@/lib/api"
import { trackEvent } from '@/components/google-analytics'
import Link from "next/link"
import Image from "next/image"
import SearchForm from "@/components/search-form"

// Popular search terms for SEO and user guidance
const POPULAR_SEARCHES = [
  { term: 'Taylor Swift', category: 'Pop' },
  { term: 'Drake', category: 'Hip-Hop' },
  { term: 'The Beatles', category: 'Rock' },
  { term: 'Adele', category: 'Soul' },
  { term: 'Billie Eilish', category: 'Alternative' },
  { term: 'Ed Sheeran', category: 'Pop' },
  { term: 'Ariana Grande', category: 'Pop' },
  { term: 'Post Malone', category: 'Hip-Hop' }
]

export default function Home() {
  const [topAlbums, setTopAlbums] = useState<Album[]>([])
  const [topSingles, setTopSingles] = useState<Album[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Very short timeout for faster page loads
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 1500)
        )
        
        const [albumsResult, singlesResult] = await Promise.allSettled([
          Promise.race([getTopAlbums(), timeoutPromise]),
          Promise.race([getTopSingles(), timeoutPromise])
        ])
        
        if (albumsResult.status === 'fulfilled' && Array.isArray(albumsResult.value) && albumsResult.value.length > 0) {
          setTopAlbums(albumsResult.value)
          // Track successful data load
          trackEvent('homepage_data_loaded', {
            albums_count: albumsResult.value.length,
            content_type: 'featured_albums'
          })
        }
        
        if (singlesResult.status === 'fulfilled' && Array.isArray(singlesResult.value) && singlesResult.value.length > 0) {
          setTopSingles(singlesResult.value)
          // Track successful data load
          trackEvent('homepage_data_loaded', {
            singles_count: singlesResult.value.length,
            content_type: 'featured_singles'
          })
        }
      } catch (error) {
        // Silently handle errors - show empty state instead of fallback data
        trackEvent('homepage_data_error', {
          error_message: 'Failed to load homepage data'
        })
      } finally {
        setLoading(false)
      }
    }

    // Start loading data after page is fully rendered
    const loadTimeout = setTimeout(loadData, 200)
    return () => clearTimeout(loadTimeout)
  }, [])

  const handleGenreClick = (genre: string) => {
    trackEvent('genre_click', {
      genre: genre,
      click_source: 'homepage_categories'
    })
  }

  const handleArtistClick = (artist: string) => {
    trackEvent('artist_click', {
      artist: artist,
      click_source: 'homepage_quick_search'
    })
  }

  const handleAlbumClick = (album: Album, section: string) => {
    trackEvent('album_click', {
      album_id: album.id,
      album_title: album.title,
      artist_name: album.artist,
      click_source: `homepage_${section}`
    })
  }

  return (
    <>
      {/* JSON-LD Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AlbumArtworkFinder - Download High-Quality Album Covers",
            "description": "Discover and download high-resolution album artwork from millions of artists. Free, fast, and mobile-optimized album cover finder.",
            "url": "https://albumartworkfinder.com",
            "mainEntity": {
              "@type": "WebApplication",
              "name": "AlbumArtworkFinder",
              "applicationCategory": "MusicApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://albumartworkfinder.com"
                }
              ]
            }
          })
        }}
      />

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
            <div className="mx-auto max-w-4xl text-center text-white">
              {/* Main Heading - SEO Optimized */}
              <div className="mb-8">
                <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl xl:text-6xl">
                  Download High-Quality
                  <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    Album Artwork
                  </span>
          </h1>
                <p className="mx-auto max-w-2xl text-lg opacity-90 md:text-xl leading-relaxed">
                  Discover and download high-resolution album covers from millions of artists. 
                  Free, fast, and mobile-optimized album artwork finder with iTunes integration.
                </p>
              </div>
              
              {/* Search Form */}
              <div className="mb-8">
                <SearchForm />
              </div>
              
              {/* Popular Search Categories */}
              <div className="mb-6">
                <p className="text-slate-300 mb-4 text-sm">Popular Categories:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Pop', 'Hip-Hop', 'Rock', 'Alternative', 'Country', 'Electronic'].map((genre) => (
                    <Link
                      key={genre}
                      href={`/search?q=${encodeURIComponent(genre)}`}
                      onClick={() => handleGenreClick(genre)}
                      className="rounded-full bg-white/10 px-4 py-2 text-sm transition-all hover:bg-white/20 hover:scale-105"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Quick Search Tags */}
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="text-slate-300">Try:</span>
                {['Taylor Swift', 'Drake', 'The Beatles', 'Adele'].map((artist) => (
                  <Link
                    key={artist}
                    href={`/search?q=${encodeURIComponent(artist)}`}
                    onClick={() => handleArtistClick(artist)}
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
          {(topAlbums.length > 0 || loading) && (
            <section className="mb-16">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl mb-3">
                  Featured Album Artwork
                  {loading && <span className="ml-3 text-sm text-gray-500">Loading...</span>}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Trending high-resolution album covers from top artists. Download artwork up to 1000x1000px resolution.
                </p>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {topAlbums.slice(0, 12).map((album, index) => (
                    <Link 
                      key={album.id || index} 
                      href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                      onClick={() => handleAlbumClick(album, 'featured_albums')}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-lg transition-all group-hover:shadow-2xl group-hover:scale-105">
                <Image
                          src={album.imageUrl || "/placeholder.svg"}
                          alt={`${album.title} by ${album.artist} album artwork - high resolution download`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
                          className="object-cover"
                          priority={index < 6}
                          loading={index < 6 ? "eager" : "lazy"}
                          quality={65}
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
              )}
            </section>
          )}

          {/* Latest Songs Section */}
          {(topSingles.length > 0 || loading) && (
            <section className="mb-16">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl mb-3">
                  Latest Music Artwork
                  {loading && <span className="ml-3 text-sm text-gray-500">Loading...</span>}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Fresh tracks and their stunning artwork. Find the latest single covers and music art.
                </p>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {topSingles.slice(0, 12).map((album, index) => (
                    <Link 
                      key={album.id || index} 
                      href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                      onClick={() => handleAlbumClick(album, 'latest_songs')}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-lg transition-all group-hover:shadow-2xl group-hover:scale-105">
                        <Image
                          src={album.imageUrl || "/placeholder.svg"}
                          alt={`${album.title} by ${album.artist} single artwork - high resolution download`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
                          className="object-cover"
                          loading="lazy"
                          quality={65}
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
              )}
            </section>
          )}

          {/* Popular Artists Section for SEO */}
          <section className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl mb-3">
                Popular Artist Album Covers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse album artwork from the most searched artists. Find covers from your favorite musicians.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
              {POPULAR_SEARCHES.map((item) => (
                <Link 
                  key={item.term} 
                  href={`/search?q=${encodeURIComponent(item.term)}`} 
                  className="group text-center p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <div className="mx-auto mb-3 h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
                    <div className="flex h-full w-full items-center justify-center text-white font-bold text-sm">
                      {item.term.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{item.term}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
            </Link>
          ))}
        </div>
      </section>
        </div>

        {/* Features Section - SEO Enhanced */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Why Choose AlbumArtworkFinder?</h2>
              <p className="mb-12 text-gray-600">The ultimate destination for high-quality album artwork and music covers</p>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: '🎨',
                    title: 'High-Resolution Artwork',
                    description: 'Download album covers up to 1000x1000px resolution for crystal-clear quality. Perfect for music libraries and collections.'
                  },
                  {
                    icon: '📱',
                    title: 'Mobile-Optimized',
                    description: 'Fully responsive design works perfectly on all devices. Touch-friendly interface optimized for mobile browsing.'
                  },
                  {
                    icon: '🚀',
                    title: 'Lightning Fast Search',
                    description: 'Instant search results from millions of albums with advanced CORS handling and mobile fallback systems.'
                  },
                  {
                    icon: '🆓',
                    title: 'Completely Free',
                    description: 'No registration required, no fees, no limits. Just pure album artwork discovery and download.'
                  },
                  {
                    icon: '🌍',
                    title: 'Global Music Library',
                    description: 'Access artwork from artists worldwide across all genres and eras. Powered by iTunes catalog.'
                  },
                  {
                    icon: '🔧',
                    title: 'Advanced Technology',
                    description: 'Built with Next.js 15, optimized for performance with edge functions and smart caching.'
                  }
                ].map((feature, index) => (
                  <div key={index} className="rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center transition-all hover:shadow-lg hover:scale-105">
                    <div className="mb-4 text-4xl">{feature.icon}</div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
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
              <h2 className="mb-4 text-3xl font-bold">Start Discovering Album Artwork Today</h2>
              <p className="mb-8 text-blue-100">
                Join thousands of music lovers who trust AlbumArtworkFinder for their album artwork needs. 
                Search, discover, and download high-quality album covers instantly.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:scale-105"
              >
                Start Searching Album Covers
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
          </div>
      </section>
    </div>
    </>
  )
}
