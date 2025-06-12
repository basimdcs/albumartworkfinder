import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const term = searchParams.get('term')
    const media = searchParams.get('media') || 'music'
    const entity = searchParams.get('entity') || 'album'
    const limit = searchParams.get('limit') || '50'
    const country = searchParams.get('country') || 'US'

    if (!term) {
      return NextResponse.json({ error: 'Missing term parameter' }, { status: 400 })
    }

    // Construct iTunes API URL
    const itunesUrl = new URL('https://itunes.apple.com/search')
    itunesUrl.searchParams.set('term', term)
    itunesUrl.searchParams.set('media', media)
    itunesUrl.searchParams.set('entity', entity)
    itunesUrl.searchParams.set('limit', limit)
    itunesUrl.searchParams.set('country', country)

    console.log('🔍 iTunes Proxy Request:', {
      term,
      media,
      entity,
      limit,
      country,
      url: itunesUrl.toString(),
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || 'Unknown'
    })

    // Make request to iTunes API
    const response = await fetch(itunesUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AlbumArtworkFinder/1.0'
      }
    })

    if (!response.ok) {
      console.error('❌ iTunes API Error:', {
        status: response.status,
        statusText: response.statusText,
        term,
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        { error: `iTunes API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    console.log('✅ iTunes Proxy Success:', {
      term,
      resultCount: data.resultCount || 0,
      actualResults: data.results?.length || 0,
      timestamp: new Date().toISOString()
    })

    // Return data with CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    })

  } catch (error) {
    console.error('❌ iTunes Proxy Error:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 