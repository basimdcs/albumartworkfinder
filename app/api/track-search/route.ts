import { NextRequest, NextResponse } from 'next/server'
import { trackSearchQuery, trackAlbumPage, trackAlbumPages } from '@/lib/search-tracking'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { type, query, resultCount, albumId, artist, title, slug, isDirectVisit, albums } = data

    if (type === 'search' && query) {
      // Fire and forget - don't await to avoid blocking the response
      trackSearchQuery(query, resultCount).catch(error => {
        console.error('Search tracking failed:', error)
      })
      
      return NextResponse.json({ success: true, message: 'Search query tracking initiated' })
    }
    
    if (type === 'album' && albumId && artist && title && slug) {
      // Fire and forget - don't await to avoid blocking the response
      trackAlbumPage(albumId, artist, title, slug, isDirectVisit).catch(error => {
        console.error('Album tracking failed:', error)
      })
      
      return NextResponse.json({ success: true, message: 'Album page tracking initiated' })
    }

    // New handler for batch album tracking
    if (type === 'album-batch' && Array.isArray(albums)) {
      trackAlbumPages(albums).catch(error => {
        console.error('Album batch tracking failed:', error)
      })
      return NextResponse.json({ success: true, message: 'Album batch tracking initiated' })
    }

    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  } catch (error) {
    console.error('Error in track-search API:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 