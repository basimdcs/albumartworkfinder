'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTopSingles, type Album } from "@/lib/api"
import { createSEOSlug } from "@/lib/utils"
import OptimizedImage from "@/components/optimized-image"
import { trackEvent } from '@/components/google-analytics'

export default function TopSinglesGrid() {
  const [singles, setSingles] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSingles = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTopSingles()
        setSingles(data)
      } catch (err) {
        console.error('Error loading top singles:', err)
        setError(err instanceof Error ? err.message : 'Failed to load singles')
      } finally {
        setLoading(false)
      }
    }

    loadSingles()
  }, [])

  const handleSingleClick = (single: Album) => {
    trackEvent('single_click', {
      single_title: single.title,
      artist: single.artist,
      source: 'top_singles_grid'
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 30 }).map((_, index) => (
          <div key={index} className="animate-pulse space-y-3">
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-medium">Unable to load singles</p>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (singles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No singles available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {singles.map((single, index) => (
        <Link 
          key={single.id || index} 
          href={`/album/${single.collectionId || single.id}/${createSEOSlug(single.artist)}-${createSEOSlug(single.title)}`}
          onClick={() => handleSingleClick(single)}
          className="group block"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 group-hover:border-purple-200">
            <OptimizedImage
              src={single.imageUrl || "/placeholder.svg"}
              alt={`${single.title} by ${single.artist} single artwork - high resolution download`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
              className="object-cover transition-all duration-300 group-hover:scale-110"
              priority={index < 6}
              loading={index < 6 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
                <h3 className="text-sm font-semibold text-white truncate drop-shadow-sm">{single.title}</h3>
                <p className="text-xs text-gray-200 truncate drop-shadow-sm">{single.artist}</p>
                {single.primaryGenreName && (
                  <p className="text-xs text-purple-200 truncate drop-shadow-sm">{single.primaryGenreName}</p>
                )}
              </div>
            </div>
            {/* Chart position badge for top 10 */}
            {index < 10 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                #{index + 1}
              </div>
            )}
            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>
      ))}
    </div>
  )
}



