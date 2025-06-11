'use client'

import { useState, useEffect } from 'react'
import { searchAll, type Album } from '@/lib/api'
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
      console.log('🔍 SearchResults: Starting search for:', {
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
        const results = await searchAll(query.trim())
        const searchEndTime = performance.now()
        const duration = Math.round(searchEndTime - searchStartTime)
        
        console.log('✅ SearchResults: Search completed successfully:', {
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
          console.log('⚠️ SearchResults: No results found but search succeeded:', query)
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
        
        console.error('❌ SearchResults: Search failed:', errorDetails)
        
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Searching iTunes API...</p>
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
          <h3 className="font-bold text-red-800 mb-4">Search Error</h3>
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

            {/* Show detailed search breakdown if available */}
            {error.details?.error?.searchDetails && (
              <div>
                <p className="text-red-700 font-medium mb-2">Search Breakdown:</p>
                <div className="bg-red-100 p-3 rounded text-sm text-red-600 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Albums Search:</p>
                      <p className="text-xs">Status: <span className="font-mono">{error.details.error.searchDetails.albumsSearchStatus}</span></p>
                      {error.details.error.searchDetails.albumsError && (
                        <div className="mt-1">
                          <p className="text-xs font-medium">Error:</p>
                          <p className="text-xs font-mono bg-red-200 p-1 rounded">{error.details.error.searchDetails.albumsError.message}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Songs Search:</p>
                      <p className="text-xs">Status: <span className="font-mono">{error.details.error.searchDetails.songsSearchStatus}</span></p>
                      {error.details.error.searchDetails.songsError && (
                        <div className="mt-1">
                          <p className="text-xs font-medium">Error:</p>
                          <p className="text-xs font-mono bg-red-200 p-1 rounded">{error.details.error.searchDetails.songsError.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {debugInfo && (
              <div>
                <p className="text-red-700 font-medium mb-2">Debug Information:</p>
                <div className="bg-red-100 p-3 rounded text-xs font-mono text-red-600">
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Reload Page
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify({
                  error: error.message,
                  query: error.query,
                  timestamp: error.timestamp,
                  details: error.details,
                  debugInfo
                }, null, 2))} 
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Copy Error Details
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!query?.trim()) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Enter a search term to find album artwork</p>
      </div>
    )
  }

  if (albums.length === 0) {
    return (
      <div className="py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="font-bold text-yellow-800 mb-4">No Results Found</h3>
          <p className="text-yellow-700 mb-4">No albums found for "{query}"</p>
          
          {debugInfo && (
            <div className="mb-4">
              <h4 className="font-medium text-yellow-800 mb-2">Search Information:</h4>
              <div className="bg-yellow-100 p-3 rounded text-sm text-yellow-700">
                <p><strong>Search completed successfully</strong> but returned 0 results</p>
                <p><strong>Duration:</strong> {debugInfo.duration}</p>
                <p><strong>Query:</strong> "{debugInfo.query}"</p>
                <p><strong>Timestamp:</strong> {debugInfo.searchCompleted}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-2 text-sm text-yellow-700 mb-4">
            <p><strong>This means:</strong></p>
            <p>• The iTunes API was reached successfully</p>
            <p>• No albums matched your search query</p>
            <p>• This is not an error - just no matching content</p>
          </div>
          
          <div className="space-y-2 text-sm text-yellow-600">
            <p><strong>Try:</strong></p>
            <p>• Different spelling or artist name</p>
            <p>• Fewer or more specific keywords</p>
            <p>• Popular artists like "Taylor Swift", "Drake", or "Adele"</p>
          </div>

          {debugInfo && (
            <div className="mt-4">
              <p className="text-yellow-700 font-medium mb-2">Debug Information:</p>
              <div className="bg-yellow-100 p-3 rounded text-xs font-mono text-yellow-600 max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">
          Found {albums.length} results for "{query}"
        </p>
        {debugInfo && (
          <div className="mt-2 text-sm text-gray-500">
            Search completed in {debugInfo.duration} • Client-side: {debugInfo.clientSide ? 'Yes' : 'No'}
          </div>
        )}
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
      
      {/* Debug info for development */}
      {debugInfo && process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
          <h3 className="font-medium mb-2">Development Debug Info:</h3>
          <div className="text-xs font-mono">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
} 