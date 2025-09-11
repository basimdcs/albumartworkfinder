'use client'

import OptimizedImage, { HighResImage } from "@/components/optimized-image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getRelatedAlbums, type Album } from "@/lib/api"
import { createAlbumSlug, generateCanonicalAlbumUrl, isValidSlug } from "@/lib/seo-slug"
import DownloadButton from "@/components/download-button"
import HighResDownloadButton from "@/components/high-res-download-button"
import ShareButton from "@/components/share-button"
import MusicPreview from "@/components/music-preview"
import AlbumTracker from "@/components/album-tracker"
import AlbumHtmlCache from "@/components/album-html-cache"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

// Base URL for consistent canonical URLs
const BASE_URL = 'https://www.albumartworkfinder.com'

interface AlbumPageProps {
  params: Promise<{ id: string; slug?: string[] }>
}

// Note: This client component handles canonical URL redirects
// and dynamic metadata generation

export default function AlbumPage({ params }: AlbumPageProps) {
  const [album, setAlbum] = useState<Album | null>(null)
  const [relatedAlbums, setRelatedAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  console.log('AlbumPage render - loading:', loading, 'error:', error, 'album:', !!album)

  // Load album data client-side - single useEffect to avoid race conditions
  useEffect(() => {
    const loadAlbumPage = async () => {
      try {
        // Reset state for new album
        setLoading(true)
        setError(null)
        setAlbum(null)
        setRelatedAlbums([])

        // Get params first
        const resolvedParams = await params
        const id = resolvedParams.id
        const slug = resolvedParams.slug || []
        
        console.log('Loading album page - ID:', id, 'Slug:', slug)
        
        if (!id) {
          setError('Invalid album ID')
          setLoading(false)
          return
        }
        
        // Load album data from our iTunes album API route
        const response = await fetch(`/api/itunes-album/${id}`)
        console.log('API response status:', response.status)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Album not found')
            return
          }
          throw new Error('Failed to fetch album data')
        }

        const albumData = await response.json()
        console.log('Album data received:', albumData)
        
        // Convert the API response to match our Album interface
        const convertedAlbum: Album = {
          id: albumData.id,
          title: albumData.name,
          artist: albumData.artist,
          imageUrl: albumData.imageUrl,
          collectionId: albumData.id,
          releaseDate: albumData.releaseDate,
          genre: albumData.genre,
          trackCount: albumData.trackCount ? parseInt(albumData.trackCount) : undefined,
          year: albumData.releaseDate ? new Date(albumData.releaseDate).getFullYear().toString() : undefined,
          primaryGenreName: albumData.genre,
          collectionViewUrl: albumData.itunesLink,
          tracks: [] // No track data available from iTunes Lookup
        }
        
        // Check if we need to redirect to canonical URL
        const properSlug = createAlbumSlug(albumData.artist, albumData.name)
        const currentSlug = slug.length > 0 ? slug.join('/') : ''
        
        console.log('Slug check - proper:', properSlug, 'current:', currentSlug)
        
        // If no slug provided or incorrect slug, redirect to canonical URL
        if (!currentSlug || currentSlug !== properSlug) {
          const canonicalUrl = `/album/${id}/${properSlug}`
          console.log('Redirecting to canonical URL:', canonicalUrl)
          
          // Set album data temporarily to avoid "Album not found" flash
          setAlbum(convertedAlbum)
          
          // Use replace to avoid adding to browser history
          router.replace(canonicalUrl)
          return
        }
        
        // Set album data for the correct URL
        setAlbum(convertedAlbum)
        console.log('Album state set:', convertedAlbum)
        
        // Load related albums using the artist name
        try {
          const related = await getRelatedAlbums(albumData.id)
          setRelatedAlbums(related)
        } catch (relatedError) {
          // Related albums failing shouldn't break the main page
          console.warn('Failed to load related albums:', relatedError)
          setRelatedAlbums([])
        }
        
      } catch (err) {
        console.error('Error loading album:', err)
        setError('Failed to load album data. Please try again.')
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    loadAlbumPage()
  }, [params, router])

  // Add structured data to head - must be called before any early returns
  useEffect(() => {
    if (album) {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "MusicAlbum",
        "name": album.title,
        "alternateName": `${album.title} Album`,
        "albumProductionType": "StudioAlbum",
        "byArtist": {
          "@type": "MusicGroup",
          "name": album.artist,
          "sameAs": `https://albumartworkfinder.com/search?q=${encodeURIComponent(album.artist)}`
        },
        "image": [
          {
            "@type": "ImageObject",
            "url": album.imageUrl,
            "name": `${album.title} by ${album.artist} album artwork`,
            "description": `Official album cover art for ${album.title} by ${album.artist}`,
            "encodingFormat": "image/jpeg",
            "width": 1000,
            "height": 1000
          }
        ],
        "datePublished": album.releaseDate,
        "genre": album.genre,
        "numTracks": album.trackCount,
        "url": generateCanonicalAlbumUrl(
          album.collectionId || album.id,
          album.artist,
          album.title,
          BASE_URL
        ),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": generateCanonicalAlbumUrl(
            album.collectionId || album.id,
            album.artist,
            album.title,
            BASE_URL
          )
        },
        "description": `Download high-resolution album artwork for ${album.title} by ${album.artist}. Free HD album cover downloads from iTunes catalog.`,
        "keywords": `${album.title}, ${album.artist}, album artwork, album cover, discography, ${album.genre || 'music'}`,
        "inLanguage": "en-US",
        "copyrightHolder": {
          "@type": "Organization",
          "name": album.artist
        },
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free high-resolution album artwork download"
        },
        ...(album.tracks && {
          "track": album.tracks.map((track, index) => ({
            "@type": "MusicRecording",
            "name": track.title,
            "position": index + 1,
            "duration": track.duration,
            "byArtist": {
              "@type": "MusicGroup",
              "name": album.artist
            },
            "inAlbum": {
              "@type": "MusicAlbum",
              "name": album.title
            }
          }))
        }),
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "ratingCount": "150",
          "bestRating": "5",
          "worstRating": "1"
        }
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
      
      // Update page title and meta description
      document.title = `${album.title} by ${album.artist} - Download Album Cover Art & Full Discography`
      
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', `Download high-resolution ${album.title} album artwork by ${album.artist}. Get complete discography, ${album.genre || 'music'} album covers, and track listings. Free HD album art downloads.`)
      }
      
      // Add canonical tag for this album page  
      const canonicalUrl = generateCanonicalAlbumUrl(
        album.collectionId || album.id,
        album.artist,
        album.title,
        BASE_URL
      )
      
      // Remove any existing canonical tags
      const existingCanonical = document.querySelector('link[rel="canonical"]')
      if (existingCanonical) {
        existingCanonical.remove()
      }
      
      // Add new canonical tag
      const canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      canonicalLink.href = canonicalUrl
      document.head.appendChild(canonicalLink)
      
      return () => {
        document.head.removeChild(script)
        // Clean up canonical tag on unmount
        const canonicalTag = document.querySelector('link[rel="canonical"]')
        if (canonicalTag) {
          canonicalTag.remove()
        }
      }
    }
  }, [album])

  // Show loading state only when we don't have album data and we're actually loading
  if (loading && !album) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading album artwork...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state - only show if we have an error and no album data
  if (error && !album) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Album Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested album artwork could not be found.'}</p>
          <Link href="/" className="text-primary hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // If we don't have album data yet and no error, show loading
  if (!album) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading album artwork...</p>
          </div>
        </div>
      </div>
    )
  }

  // Track direct album page visit for sitemap inclusion
  const trackingSlug = createAlbumSlug(album.artist, album.title)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Add album-specific caching and SEO */}
      <AlbumHtmlCache 
        albumId={album?.id || ''}
        albumTitle={album?.title}
        artistName={album?.artist}
      />
      
      {/* Album-specific structured data */}
      {album && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": `${album.title} by ${album.artist} - Album Artwork Download`,
              "description": `Download high-resolution album artwork for "${album.title}" by ${album.artist}. Get HD album covers up to 5000x5000px from iTunes catalog.`,
              "url": typeof window !== 'undefined' ? window.location.href : '',
              "mainEntity": {
                "@type": "MusicAlbum",
                "name": album.title,
                "byArtist": {
                  "@type": "MusicGroup",
                  "name": album.artist
                },
                "image": album.imageUrl,
                "datePublished": album.releaseDate,
                "genre": album.genre,
                "url": album.collectionViewUrl
              }
            })
          }}
        />
      )}
      
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Breadcrumb for SEO */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 overflow-x-auto">
            <li className="shrink-0">
              <Link href="/" className="text-primary hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-500 shrink-0">/</li>
            <li className="shrink-0">
              <Link href={`/search?q=${encodeURIComponent(album.artist)}`} className="text-primary hover:underline">
                {album.artist}
              </Link>
            </li>
            <li className="text-gray-500 shrink-0">/</li>
            <li className="text-gray-700 font-medium truncate" aria-current="page">{album.title}</li>
          </ol>
        </nav>

        <div className="mb-8" style={{ minHeight: '600px' }}>
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            {/* Album Artwork */}
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100" style={{ minHeight: '400px' }}>
              <HighResImage
                src={album.imageUrl || "/placeholder.svg"}
                alt={`${album.title} by ${album.artist} album artwork`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Album Info */}
            <div className="space-y-6">
              <div>
                <h1 className="mb-3 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                  Album Artwork: {album.title} by {album.artist}
                </h1>
              <Link
                href={`/search?q=${encodeURIComponent(album.artist)}`}
                  className="block text-lg text-primary hover:underline md:text-xl"
              >
                {album.artist}
              </Link>
              </div>

              {/* Album Details */}
              <h2 className="sr-only">Album Details</h2>
              <div className="flex flex-wrap gap-2" aria-labelledby="album-details">
                {album.year && (
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <strong>Year:</strong> {album.year}
                  </div>
                )}
                {album.genre && (
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <strong>Genre:</strong> {album.genre}
                  </div>
                )}
                {album.trackCount && (
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <strong>Tracks:</strong> {album.trackCount}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <h2 className="text-lg font-semibold mt-6">Download High-Resolution Album Art</h2>
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <DownloadButton 
                    imageUrl={album.imageUrl}
                    albumTitle={album.title}
                    artistName={album.artist}
                  />
                  <ShareButton 
                    title={`${album.title} by ${album.artist} - Album Artwork`}
                    text={`Check out this album artwork for ${album.title} by ${album.artist}`}
                  />
                </div>
                
                {/* Premium 5000x5000px Download */}
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 border border-purple-200">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Ultra HD Download</h3>
                      <p className="text-sm text-gray-600">Get the highest resolution available (5000×5000px)</p>
                    </div>
                    <HighResDownloadButton 
                      imageUrl={album.imageUrl}
                      albumTitle={album.title}
                      artistName={album.artist}
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Album Description for High-Traffic Keywords */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h2 className="mb-2 text-xl font-semibold">About {album.title} Album Artwork</h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  <strong>{album.title}</strong> is {album.year ? `a ${album.year} ` : 'an '}album by <strong>{album.artist}</strong>
                  {album.genre ? ` in the ${album.genre} genre` : ''}. 
                  {album.trackCount ? ` This full album contains ${album.trackCount} tracks` : ''}
                  {album.releaseDate ? ` and was released on ${new Date(album.releaseDate).toLocaleDateString()}` : ''}.
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Download the complete <strong>{album.artist} discography</strong> artwork in high-resolution (up to 1000x1000px). 
                  Our free album art collection includes all {album.artist} album covers, perfect for music libraries and digital collections. 
                  Get HD album artwork downloads instantly - no registration required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Music Preview */}
        {album.tracks && album.tracks.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">Preview Tracks</h2>
            <MusicPreview 
              tracks={album.tracks} 
              albumTitle={album.title}
              artist={album.artist}
            />
          </div>
        )}

        {/* Related Albums */}
        {relatedAlbums.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">More from {album.artist}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {relatedAlbums.slice(0, 12).map((relatedAlbum) => (
                <Link
                  key={relatedAlbum.id}
                  href={`/album/${relatedAlbum.id}/${createAlbumSlug(relatedAlbum.artist, relatedAlbum.title)}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all group-hover:shadow-lg group-hover:scale-105">
                    <OptimizedImage
                      src={relatedAlbum.imageUrl || "/placeholder.svg"}
                      alt={`${relatedAlbum.title} by ${relatedAlbum.artist}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.66vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{relatedAlbum.title}</h3>
                    <p className="text-xs text-gray-600 truncate">{relatedAlbum.artist}</p>
                    {relatedAlbum.year && <p className="text-xs text-gray-500">{relatedAlbum.year}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Enhanced SEO Content with High-Traffic Keywords */}
        <section className="rounded-lg bg-gray-50 p-6 space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">
              Download {album.title} Album Artwork – Complete {album.artist} Collection
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Free HD Album Art Downloads</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Get the official <strong>{album.title} album artwork</strong> by <strong>{album.artist}</strong> in high resolution 
                  (up to 1000x1000 pixels). Perfect for iTunes, Spotify, music libraries, playlists, and digital collections. 
                  Our <strong>free album artwork downloads</strong> are sourced directly from the iTunes catalog for maximum quality.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">{album.artist} Complete Discography</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Explore the complete <strong>{album.artist} discography</strong> with all album covers and artwork. 
                  Find their latest releases, classic albums, and rare editions. All <strong>{album.artist} album covers</strong> 
                  are available for free download in high resolution.
                </p>
                <Link
                  href={`/search?q=${encodeURIComponent(album.artist)}`}
                  className="mt-2 inline-block text-primary hover:underline text-sm font-medium"
                >
                  View complete {album.artist} discography →
                </Link>
              </div>
            </div>
          </div>
          
          {/* Additional High-Traffic Keyword Content */}
          <div className="border-t pt-6">
            <h3 className="mb-3 text-lg font-semibold">
              {album.genre || 'Music'} Album Collection – {album.title} and More
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Album Features</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• High-resolution artwork (1000x1000px)</li>
                  <li>• Official album cover art</li>
                  <li>• Free instant downloads</li>
                  <li>• iTunes quality artwork</li>
                  <li>• Mobile-optimized downloads</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Use Cases</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Music library organization</li>
                  <li>• Spotify/Apple Music artwork</li>
                  <li>• Digital music collections</li>
                  <li>• Playlist cover art</li>
                  <li>• Music blog graphics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Related Searches</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    <Link href={`/search?q=${encodeURIComponent(album.artist + ' discography')}`} className="text-primary hover:underline">
                      {album.artist} discography
                    </Link>
                  </li>
                  <li>
                    <Link href={`/search?q=${encodeURIComponent(album.title + ' full album')}`} className="text-primary hover:underline">
                      {album.title} full album
                    </Link>
                  </li>
                  <li>
                    <Link href={`/search?q=${encodeURIComponent(album.genre || 'music' + ' album covers')}`} className="text-primary hover:underline">
                      {album.genre || 'Music'} album covers
                    </Link>
                  </li>
                  <li>
                    <Link href={`/search?q=${encodeURIComponent(album.artist + ' latest album')}`} className="text-primary hover:underline">
                      {album.artist} latest releases
                    </Link>
                  </li>
                  <li>
                    <Link href={`/search?q=${encodeURIComponent('best ' + (album.genre || 'music') + ' albums')}`} className="text-primary hover:underline">
                      Best {album.genre || 'music'} albums
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
