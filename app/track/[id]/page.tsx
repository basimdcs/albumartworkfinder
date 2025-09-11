'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Music, Download, Calendar, User, ArrowLeft, Loader2 } from 'lucide-react'
import OptimizedImage from '@/components/optimized-image'
import DownloadButton from '@/components/download-button'
import ShareButton from '@/components/share-button'
import PremiumDownloadOptions from '@/components/premium-download-options'

interface TrackData {
  'im:name': { label: string }
  'im:artist': { label: string }
  'im:image': Array<{ label: string; attributes?: { height: string } }>
  'im:releaseDate': { label: string; attributes: { label: string } }
  category: { attributes: { term: string; label: string } }
  id: { attributes: { 'im:id': string } }
  'im:contentType': { attributes: { term: string; label: string } }
  rights?: { label: string }
  title: { label: string }
  link: { attributes: { href: string } }
}

interface TrackPageProps {
  params: Promise<{ id: string }>
}

export default function TrackPage({ params }: TrackPageProps) {
  const [track, setTrack] = useState<TrackData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trackId, setTrackId] = useState<string>('')
  const router = useRouter()

  // Get params client-side
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setTrackId(resolvedParams.id)
    }
    getParams()
  }, [params])

  // Load track data
  useEffect(() => {
    if (!trackId) return

    const loadTrackData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch track data from iTunes RSS API
        const response = await fetch('/api/itunes-rss?type=songs')
        
        if (!response.ok) {
          throw new Error('Failed to fetch track data')
        }

        const data = await response.json()
        const trackData = data.data.find((item: TrackData) => 
          item.id.attributes['im:id'] === trackId
        )
        
        if (!trackData) {
          setError('Track not found')
          return
        }
        
        setTrack(trackData)
        
        // Update page metadata
        document.title = `${trackData['im:name'].label} by ${trackData['im:artist'].label} - Download Single Cover Art`
        
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', 
            `Download high-resolution single artwork for "${trackData['im:name'].label}" by ${trackData['im:artist'].label}. Free HD single cover art download.`
          )
        }
        
      } catch (err) {
        console.error('Error loading track:', err)
        setError('Failed to load track data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadTrackData()
  }, [trackId])

  const getHighestResolutionImage = (images: TrackData['im:image']) => {
    const sortedImages = images.sort((a, b) => {
      const heightA = parseInt(a.attributes?.height || '0')
      const heightB = parseInt(b.attributes?.height || '0')
      return heightB - heightA
    })
    return sortedImages[0]?.label || images[images.length - 1]?.label
  }

  const formatReleaseDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-gray-600">Loading single artwork...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !track) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Single Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested single artwork could not be found.'}</p>
          <div className="space-x-4">
            <Link href="/top-100-single-covers" className="text-purple-600 hover:underline">
              ← Back to Top 100 Singles
            </Link>
            <Link href="/" className="text-purple-600 hover:underline">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const imageUrl = getHighestResolutionImage(track['im:image'])
  const trackName = track['im:name'].label
  const artistName = track['im:artist'].label
  const releaseDate = track['im:releaseDate'].label
  const genre = track.category.attributes.label
  const itunesLink = track.link.attributes.href

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-purple-600 hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/top-100-single-covers" className="text-purple-600 hover:underline">
                Top 100 Singles
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700 font-medium truncate">{trackName}</li>
          </ol>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/top-100-single-covers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg text-purple-700 hover:bg-white hover:border-purple-300 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Top 100 Singles
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Single Artwork */}
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl bg-white">
            <OptimizedImage
              src={imageUrl}
              alt={`${trackName} by ${artistName} single artwork`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Single Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{trackName}</h1>
              <Link
                href={`/search?q=${encodeURIComponent(artistName)}`}
                className="text-xl md:text-2xl text-purple-600 hover:underline font-medium"
              >
                {artistName}
              </Link>
            </div>

            {/* Single Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Release Date</p>
                    <p className="font-medium text-gray-900">{formatReleaseDate(releaseDate)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Genre</p>
                    <p className="font-medium text-gray-900">{genre}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DownloadButton
                  imageUrl={imageUrl}
                  albumTitle={trackName}
                  artistName={artistName}
                />
                
                <a
                  href={itunesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 font-medium rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on iTunes
                </a>
              </div>

              <ShareButton
                title={`${trackName} by ${artistName} - Single Cover Art`}
                text={`Check out this single cover art for ${trackName} by ${artistName}`}
              />
            </div>

            {/* Premium Download Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Premium Download Options
              </h3>
              <PremiumDownloadOptions
                artworkUrl={imageUrl}
                albumTitle={trackName}
                artistName={artistName}
              />
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About "{trackName}" Single Artwork
          </h2>
          <p className="text-gray-600 mb-6">
            Download high-quality single artwork for "{trackName}" by {artistName}. This single cover art 
            is available in multiple resolutions perfect for playlists, music collections, and digital displays. 
            Released on {formatReleaseDate(releaseDate)} in the {genre} genre, this track is currently 
            trending on iTunes charts.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Single Information</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Track:</strong> {trackName}</li>
                <li><strong>Artist:</strong> {artistName}</li>
                <li><strong>Genre:</strong> {genre}</li>
                <li><strong>Release Date:</strong> {formatReleaseDate(releaseDate)}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Download Options</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Multiple resolution options available</li>
                <li>• Perfect for playlist covers</li>
                <li>• High-quality PNG format</li>
                <li>• Free for personal use</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Actions */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">Discover More Single Artwork</h3>
            <p className="mb-6 text-purple-100">
              Explore more trending single covers from today's top charts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/top-100-single-covers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-all"
              >
                <Music className="h-4 w-4" />
                Browse All Top Singles
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-all"
              >
                <Download className="h-4 w-4" />
                Search More Artwork
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 