'use client'

import { useState, useEffect } from 'react'
import { getTopAlbums, getTopSingles } from "@/lib/api"
import { createSEOSlug } from "@/lib/utils"
import type { Album } from "@/lib/api"
import { trackEvent } from '@/components/google-analytics'
import Link from "next/link"
import OptimizedImage from "@/components/optimized-image"
import SearchForm from "@/components/search-form"
import HomepageHtmlCache from "@/components/homepage-html-cache"
import { Album as AlbumIcon, Disc, GanttChart, Gem, Sparkles, Download, Shield, Zap, Globe, Heart, Music, ExternalLink, TrendingUp, ArrowRight } from "lucide-react"

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
    // Add canonical tag for homepage
    const existingCanonical = document.querySelector('link[rel="canonical"]')
    if (existingCanonical) {
      existingCanonical.remove()
    }
    
    const canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    canonicalLink.href = 'https://albumartworkfinder.com'
    document.head.appendChild(canonicalLink)

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
      {/* Cache homepage HTML for SEO */}
      <HomepageHtmlCache />
      
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

      <div className="min-h-screen bg-white">
        {/* Clean Hero Section */}
        <section className="relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
          
          <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
              {/* Heading */}
              <div className="mb-8">
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  Album Artwork Finder
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    Download High-Resolution Album Covers
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
                  Search millions of albums and download HD album artwork instantly. Free album artwork finder with iTunes integration - get covers up to 5000×5000px.
                </p>
              </div>
              
              {/* Search Form with Glow Effect */}
              <div className="mb-8 relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 -z-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <SearchForm />
                </div>
              </div>
              
              {/* Quick Search Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-slate-400 hidden sm:inline mr-2">Popular:</span>
                {['Taylor Swift', 'Drake', 'The Beatles', 'Adele'].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    onClick={() => handleArtistClick(term)}
                    className="rounded-full bg-slate-700/50 px-3 py-1 text-slate-200 transition-colors hover:bg-slate-600/50"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Top 100 Collections Banner - Compact */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:24px_24px]"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="mx-auto max-w-5xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-medium mb-3">
                  <TrendingUp className="w-3 h-3" />
                  Updated Weekly
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Current Chart Collections
                </h2>
                <p className="text-base text-blue-100 max-w-2xl mx-auto">
                  Explore the most popular album artwork from today's iTunes charts
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
                <Link 
                  href="/top-100-album-covers"
                  className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/15"
                >
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-lg bg-white/20 p-2">
                        <GanttChart className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium">
                        #1-100 Albums
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold">Top 100 Album Covers</h3>
                    <p className="mb-4 text-blue-100 text-sm leading-relaxed">
                      Current iTunes top albums with high-resolution artwork
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-medium bg-white/20 px-3 py-1 rounded-lg">
                      View Collection
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
                
                <Link 
                  href="/top-100-single-covers"
                  className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/15"
                >
                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-lg bg-white/20 p-2">
                        <Music className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium">
                        #1-100 Singles
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold">Top 100 Single Covers</h3>
                    <p className="mb-4 text-purple-100 text-sm leading-relaxed">
                      Current iTunes hit songs with artwork from today's most popular tracks
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-medium bg-white/20 px-3 py-1 rounded-lg">
                      View Collection
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Premium 5000x5000px Artwork Section - Compact */}
        <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 py-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:32px_32px]"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="mx-auto max-w-4xl">
              {/* Section Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/30 text-purple-200 text-xs font-medium mb-4">
                  <Gem className="w-3 h-3" />
                  Ultra High Resolution
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  5000×5000px Album Artwork
                </h2>
                <p className="text-base text-purple-100 max-w-2xl mx-auto leading-relaxed">
                  Download the highest quality album covers available. Professional-grade resolution perfect for print and design projects.
                </p>
              </div>
              
              {/* Features Showcase */}
              <div className="grid gap-6 md:grid-cols-3 mb-10">
                <div className="text-center group">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Maximum Resolution</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    5000×5000px - the highest quality available, perfect for professional use.
                  </p>
                </div>
                
                <div className="text-center group">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Instant Access</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    One-click downloads with no registration required.
                  </p>
                </div>
                
                <div className="text-center group">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">100% Free</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Access ultra high-resolution artwork completely free.
                  </p>
                </div>
              </div>
              
              {/* Quality Comparison */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Resolution Comparison
                </h3>
                <div className="grid gap-4 md:grid-cols-5 text-center">
                  {[
                    { size: '300px', quality: 'Web', color: 'from-gray-500 to-gray-600' },
                    { size: '600px', quality: 'Social', color: 'from-blue-500 to-blue-600' },
                    { size: '1000px', quality: 'Digital', color: 'from-green-500 to-green-600' },
                    { size: '3000px', quality: 'Print', color: 'from-orange-500 to-orange-600' },
                    { size: '5000px', quality: 'Ultra HD', color: 'from-purple-500 to-pink-500', premium: true }
                  ].map((res, index) => (
                    <div key={index} className={`relative p-4 rounded-xl ${res.premium ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50' : 'bg-white/5'}`}>
                      {res.premium && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            PREMIUM
                          </span>
                        </div>
                      )}
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${res.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {res.size}
                      </div>
                      <div className="text-white font-medium text-sm">{res.quality}</div>
                      <div className="text-purple-200 text-xs mt-1">
                        {res.premium ? '~5 MB' : index === 0 ? '~50 KB' : index === 1 ? '~200 KB' : index === 2 ? '~500 KB' : '~2 MB'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center mt-8">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    Download 5000px Artwork
                  </Link>
                  <Link 
                    href="/top-100-album-covers"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/30 backdrop-blur-sm transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Top 100 Albums
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Linking Section - Album Artwork Categories */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Popular Album Artwork Categories
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Discover high-resolution album artwork from your favorite genres. Each collection features hand-picked albums with stunning cover art.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Hip-Hop Album Artwork",
                    description: "Iconic album covers from rap and hip-hop artists featuring bold designs and artistic expressions.",
                    searchTerm: "hip hop",
                    gradient: "from-orange-500 to-red-500",
                    examples: ["Drake", "Kendrick Lamar", "Travis Scott"]
                  },
                  {
                    title: "Pop Album Covers",
                    description: "Colorful and vibrant album artwork from top pop artists with eye-catching visual designs.",
                    searchTerm: "pop",
                    gradient: "from-pink-500 to-purple-500", 
                    examples: ["Taylor Swift", "Ariana Grande", "Billie Eilish"]
                  },
                  {
                    title: "Rock Album Art",
                    description: "Classic and modern rock album covers featuring legendary artwork and creative designs.",
                    searchTerm: "rock",
                    gradient: "from-gray-700 to-gray-900",
                    examples: ["The Beatles", "Led Zeppelin", "Pink Floyd"]
                  },
                  {
                    title: "Electronic Music Covers",
                    description: "Futuristic and abstract album artwork from electronic and dance music artists.",
                    searchTerm: "electronic",
                    gradient: "from-cyan-500 to-blue-500",
                    examples: ["Daft Punk", "Skrillex", "Calvin Harris"]
                  },
                  {
                    title: "Jazz Album Artwork",
                    description: "Sophisticated and artistic album covers from jazz legends and contemporary artists.",
                    searchTerm: "jazz",
                    gradient: "from-yellow-600 to-orange-600",
                    examples: ["Miles Davis", "John Coltrane", "Billie Holiday"]
                  },
                  {
                    title: "Country Music Covers",
                    description: "Authentic and storytelling album artwork from country and folk music artists.",
                    searchTerm: "country",
                    gradient: "from-green-600 to-green-800",
                    examples: ["Taylor Swift", "Chris Stapleton", "Kacey Musgraves"]
                  }
                ].map((category, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    
                    <div className="relative p-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${category.gradient} text-white text-xs font-medium mb-4`}>
                        <Music className="w-3 h-3" />
                        {category.title}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {category.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Popular Artists:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.examples.map((artist, artistIndex) => (
                            <Link
                              key={artistIndex}
                              href={`/search?q=${encodeURIComponent(artist)}`}
                              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors"
                              onClick={() => handleArtistClick(artist)}
                            >
                              {artist}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      <Link 
                        href={`/search?q=${encodeURIComponent(category.searchTerm)}`}
                        onClick={() => handleGenreClick(category.searchTerm)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors group"
                      >
                        Browse {category.title}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Featured Album Artwork Links */}
              <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Featured Album Artwork Collections
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link 
                    href="/top-100-album-covers"
                    className="group p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:scale-105"
                  >
                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      Top 100 Album Covers
                    </h4>
                    <p className="text-sm text-gray-600">
                      Current iTunes top albums with high-resolution album artwork updated weekly.
                    </p>
                  </Link>
                  
                  <Link 
                    href="/top-100-single-covers"
                    className="group p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:scale-105"
                  >
                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      Top 100 Single Covers
                    </h4>
                    <p className="text-sm text-gray-600">
                      Hit singles with stunning album artwork from today's most popular tracks.
                    </p>
                  </Link>
                  
                  <Link 
                    href="/best-album-covers"
                    className="group p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:border-green-200 transition-all duration-300 hover:scale-105"
                  >
                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      Best Album Covers
                    </h4>
                    <p className="text-sm text-gray-600">
                      Curated collection of the most iconic and beautiful album artwork of all time.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              {/* Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Why Choose Us
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  The Ultimate Album Art
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Experience
                  </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover, download, and enjoy high-quality album artwork with cutting-edge technology and design
                </p>
              </div>
              
              {/* Features Grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                                     {
                     icon: Gem,
                     title: 'Ultra HD Quality',
                     description: 'Download crystal-clear album covers up to 5000×5000px resolution. From web thumbnails to professional print quality - we have every resolution you need.',
                     color: 'from-pink-500 to-rose-500'
                   },
                  {
                    icon: Zap,
                    title: 'Lightning Speed',
                    description: 'Instant search results from millions of albums with advanced caching and optimized delivery. No waiting, just pure speed.',
                    color: 'from-yellow-500 to-orange-500'
                  },
                  {
                    icon: Shield,
                    title: '100% Free Forever',
                    description: 'No hidden fees, premium plans, or download limits. Complete access to our entire catalog without spending a penny.',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    icon: Globe,
                    title: 'Global Catalog',
                    description: 'Access artwork from artists worldwide across every genre and era. Powered by the comprehensive iTunes music database.',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    icon: Download,
                    title: 'Instant Downloads',
                    description: 'One-click downloads with no registration required. Get your artwork immediately in the highest available quality.',
                    color: 'from-purple-500 to-violet-500'
                  },
                  {
                    icon: Heart,
                    title: 'Mobile Perfect',
                    description: 'Fully responsive design optimized for every device. Touch-friendly interface that works beautifully on phones and tablets.',
                    color: 'from-red-500 to-pink-500'
                  }
                ].map((feature, index) => (
                  <div key={index} className="group relative">
                    <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                      {/* Icon with gradient background */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      
                      {/* Hover gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="bg-slate-50">
          <div className="container mx-auto px-4 py-12">
            
            {/* Clean Stats Section */}
            <section className="mb-16 -mt-16 md:-mt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { icon: GanttChart, label: 'Album Covers', value: '10M+', color: 'blue' },
                  { icon: Gem, label: 'Max Resolution', value: '1000px', color: 'purple' },
                  { icon: 'Free', label: 'Cost', value: '100%', color: 'green' }
                ].map((stat, index) => (
                  <div key={index} className="rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                    {typeof stat.icon === 'string' ? 
                      <div className={`text-2xl font-bold mb-3 ${
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`}>{stat.icon}</div> :
                      <stat.icon className={`w-8 h-8 mx-auto mb-3 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        'text-orange-600'
                      }`} />
                    }
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
        </div>
      </section>

            {/* Featured Albums Section */}
            {(topAlbums.length > 0 || loading) && (
              <section className="mb-16">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-3">
                    Trending Album Artwork
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover the most popular album covers right now. High-resolution downloads up to 1000x1000px.
                  </p>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="animate-pulse space-y-3">
                        <div className="aspect-square bg-gray-200 rounded-xl"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {topAlbums.slice(0, 12).map((album, index) => (
                      <Link 
                        key={album.id || index} 
                        href={`/album/${album.collectionId || album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                        onClick={() => handleAlbumClick(album, 'featured_albums')}
                        className="group block"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-blue-200">
                          <OptimizedImage
                            src={album.imageUrl || "/placeholder.svg"}
                            alt={`${album.title} by ${album.artist} album artwork - high resolution download`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.67vw"
                            className="object-cover transition-all duration-300 group-hover:scale-110"
                            priority={index < 3}
                            loading={index < 3 ? "eager" : "lazy"}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-sm font-semibold text-white truncate drop-shadow-sm">{album.title}</h3>
                            <p className="text-xs text-gray-200 truncate drop-shadow-sm">{album.artist}</p>
                          </div>
                          {/* Subtle shine effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-3">
                    Latest Music Artwork
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Fresh tracks and their stunning artwork. Find the latest single covers and music art.
                  </p>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="animate-pulse space-y-3">
                        <div className="aspect-square bg-gray-200 rounded-xl"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {topSingles.slice(0, 12).map((album, index) => (
                      <Link 
                        key={album.id || index} 
                        href={`/album/${album.collectionId || album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                        onClick={() => handleAlbumClick(album, 'latest_songs')}
                        className="group block"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-purple-200">
                           <OptimizedImage
                            src={album.imageUrl || "/placeholder.svg"}
                            alt={`${album.title} by ${album.artist} single artwork - high resolution download`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.67vw"
                            className="object-cover transition-all duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-sm font-semibold text-white truncate drop-shadow-sm">{album.title}</h3>
                            <p className="text-xs text-gray-200 truncate drop-shadow-sm">{album.artist}</p>
                          </div>
                          {/* Subtle shine effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-3">
                  Popular Artists & Genres
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Quick access to the most searched artists and music genres.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                {POPULAR_SEARCHES.map((item, index) => (
                  <Link 
                    key={item.term} 
                    href={`/search?q=${encodeURIComponent(item.term)}`} 
                    className="group text-center p-4 rounded-xl bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all hover:scale-105"
                  >
                    <div className="mx-auto mb-3 h-16 w-16 rounded-full flex items-center justify-center bg-blue-100 border border-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                      <div className="font-bold text-lg text-blue-600">
                        {item.term.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.term}</p>
                      <p className="text-xs text-gray-600">{item.category}</p>
                    </div>
            </Link>
          ))}
        </div>
      </section>
          </div>
        </div>

        {/* Modern Blog Section */}
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              {/* Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                  <AlbumIcon className="w-4 h-4" />
                  From Our Blog
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Stories Behind the
                  <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Iconic Covers
                  </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Explore music history, design trends, and the fascinating stories behind the most memorable album artwork
                </p>
              </div>
              
              {/* Blog Posts Grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    slug: '10-most-iconic-album-covers',
                    title: 'The 10 Most Iconic Album Covers of the 21st Century',
                    description: 'From Radiohead\'s "Kid A" to Kendrick Lamar\'s "To Pimp a Butterfly", discover the stories behind the era\'s most iconic artwork.',
                    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4c/94/9b/4c949b3d-a853-4605-e557-413158957597/886446536227.jpg/600x600bb.jpg',
                    category: 'Design History',
                    readTime: '8 min read'
                  },
                  {
                    slug: 'design-trends-in-hip-hop',
                    title: 'Design Trends in Modern Hip-Hop Album Art',
                    description: 'Analyzing the visual language of today\'s biggest hip-hop artists and how album art reflects cultural evolution.',
                    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/a4/ab/12/a4ab12a4-2589-3540-a381-551259076afa/196871630138.jpg/600x600bb.jpg',
                    category: 'Trends',
                    readTime: '6 min read'
                  },
                  {
                    slug: 'the-art-of-the-mixtape-cover',
                    title: 'The Lost Art of the Mixtape Cover',
                    description: 'A nostalgic journey through the wild, creative world of mixtape cover art from the early 2000s underground scene.',
                    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/e5/23/9c/e5239c87-a2f7-21a7-2016-4447c2349079/075679899324.jpg/600x600bb.jpg',
                    category: 'Culture',
                    readTime: '10 min read'
                  }
                ].map((post, index) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <article className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                          src={post.imageUrl}
                          alt={`Blog post image for ${post.title}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33.33vw"
                          className="object-cover transition-all duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-purple-700 backdrop-blur-sm">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
              
              {/* Call to Action */}
              <div className="text-center mt-12">
                <Link 
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Read More Stories
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}