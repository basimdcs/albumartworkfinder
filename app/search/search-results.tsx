'use client'

import { useState, useEffect } from 'react'
import { searchAlbums, type Album } from '@/lib/api'
import AlbumCard from '@/components/album-card'

interface SearchResultsProps {
  query?: string
}

interface SearchError {
  message: string
  details?: any
  timestamp: string
  query: string
}

interface DebugInfo {
  searchStarted?: string
  query?: string
  clientSide?: boolean
  online?: boolean
  userAgent?: string
  searchCompleted?: string
  searchFailed?: string
  duration?: string
  resultsCount?: number
  success?: boolean
  error?: any
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<SearchError | null>(null)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)

  useEffect(() => {
    if (!query?.trim()) {
      setAlbums([])
      setError(null)
      setDebugInfo(null)
      return
    }

    const performSearch = async () => {
      const searchStartTime = performance.now()
      console.log('🔍 SearchResults: Starting album search for:', {
        query,
        timestamp: new Date().toISOString(),
        userAgent: navigator?.userAgent || 'Unknown',
        online: navigator?.onLine || 'Unknown'
      })
      
      setLoading(true)
      setError(null)
      setDebugInfo({
        searchStarted: new Date().toISOString(),
        query: query.trim(),
        clientSide: typeof window !== 'undefined',
        online: navigator?.onLine,
        userAgent: navigator?.userAgent?.substring(0, 100) + '...'
      })
      
      try {
        const results = await searchAlbums(query.trim())
        const searchEndTime = performance.now()
        const duration = Math.round(searchEndTime - searchStartTime)
        
        console.log('✅ SearchResults: Album search completed successfully:', {
          query,
          resultsCount: results.length,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        })
        
        setAlbums(results)
        setDebugInfo(prev => ({
          ...prev,
          searchCompleted: new Date().toISOString(),
          duration: `${duration}ms`,
          resultsCount: results.length,
          success: true
        }))
        
        if (results.length === 0) {
          console.log('⚠️ SearchResults: No albums found but search succeeded:', query)
        }
      } catch (err) {
        const searchEndTime = performance.now()
        const duration = Math.round(searchEndTime - searchStartTime)
        
        const errorDetails = {
          query,
          error: err,
          errorMessage: err instanceof Error ? err.message : 'Unknown error',
          errorName: err instanceof Error ? err.name : 'Unknown',
          errorStack: err instanceof Error ? err.stack : 'No stack trace',
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
          clientInfo: {
            online: navigator?.onLine,
            userAgent: navigator?.userAgent,
            location: window?.location?.href,
            connection: (navigator as any)?.connection ? {
              effectiveType: (navigator as any).connection.effectiveType,
              downlink: (navigator as any).connection.downlink,
              rtt: (navigator as any).connection.rtt
            } : 'Not available'
          }
        }
        
        console.error('❌ SearchResults: Album search failed:', errorDetails)
        
        setError({
          message: err instanceof Error ? err.message : 'Unknown search error',
          details: errorDetails,
          timestamp: new Date().toISOString(),
          query: query.trim()
        })
        
        setDebugInfo(prev => ({
          ...prev,
          searchFailed: new Date().toISOString(),
          duration: `${duration}ms`,
          error: errorDetails,
          success: false
        }))
        
        setAlbums([])
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to debounce rapid queries
    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Searching iTunes for albums...</p>
        <p className="text-sm text-gray-500 mb-4">Query: "{query}"</p>
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-left">
            <h4 className="font-medium text-blue-800 mb-2">Debug Info:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>Started: {debugInfo.searchStarted}</p>
              <p>Client-side: {debugInfo.clientSide ? 'Yes' : 'No'}</p>
              <p>Online: {debugInfo.online ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="font-bold text-red-800 mb-4">Album Search Error</h3>
          <div className="space-y-4">
            <div>
              <p className="text-red-700 font-medium mb-2">Error Message:</p>
              <p className="text-red-600 bg-red-100 p-3 rounded font-mono text-sm">{error.message}</p>
            </div>
            
            <div>
              <p className="text-red-700 font-medium mb-2">Search Details:</p>
              <div className="text-sm text-red-600 space-y-1">
                <p><strong>Query:</strong> "{error.query}"</p>
                <p><strong>Timestamp:</strong> {error.timestamp}</p>
                {error.details?.duration && <p><strong>Duration:</strong> {error.details.duration}</p>}
              </div>
            </div>

            {error.details && (
              <div>
                <p className="text-red-700 font-medium mb-2">Technical Details:</p>
                <div className="bg-red-100 p-3 rounded text-xs font-mono text-red-600 max-h-96 overflow-y-auto">
                  <pre>{JSON.stringify(error.details, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Copy Error Details:</strong>
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(error.details, null, 2))}
                className="mt-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded text-xs hover:bg-yellow-300"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!query?.trim()) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Album Artwork</h3>
          <p className="text-gray-600">Enter an artist name, album title, or song to find high-quality album covers.</p>
        </div>
      </div>
    )
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Albums Found</h3>
          <p className="text-gray-600 mb-4">
            No albums found for "{query}". Try searching with different keywords or check the spelling.
          </p>
          <div className="text-sm text-gray-500">
            <p>Search tips:</p>
            <ul className="mt-2 space-y-1">
              <li>• Try the artist name only</li>
              <li>• Check spelling and try variations</li>
              <li>• Use simpler search terms</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Found {albums.length} album{albums.length !== 1 ? 's' : ''} for "{query}"
          </h2>
          {debugInfo?.duration && (
            <p className="text-sm text-gray-500 mt-1">
              Search completed in {debugInfo.duration}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {albums.map((album) => (
          <AlbumCard 
            key={album.id} 
            id={album.id}
            title={album.title}
            artist={album.artist}
            imageUrl={album.imageUrl}
            year={album.year}
          />
        ))}
      </div>

      {debugInfo && debugInfo.success && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Search Success</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p>Query: "{debugInfo.query}"</p>
            <p>Results: {debugInfo.resultsCount} albums</p>
            <p>Duration: {debugInfo.duration}</p>
            <p>Completed: {debugInfo.searchCompleted}</p>
          </div>
        </div>
      )}
    </div>
  )
} 