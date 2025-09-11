import { NextResponse } from 'next/server'
import { getPopularAlbumPages } from '@/lib/search-tracking'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CACHE_WARM_SECRET_KEY}`

  if (!process.env.CACHE_WARM_SECRET_KEY || authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const popularAlbums = await getPopularAlbumPages(50) // Warm up the top 50 most popular pages
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://albumartworkfinder.com'
    let successCount = 0
    let failedCount = 0

    const warmupPromises = popularAlbums.map(async (album) => {
      const url = `${baseUrl}/album/${album.albumId}/${album.slug}`
      try {
        // Use a HEAD request to trigger the caching mechanism without downloading the body
        const response = await fetch(url, { method: 'HEAD', next: { revalidate: 0 } })
        if (response.ok) {
          successCount++
        } else {
          failedCount++
          console.warn(`Failed to warm cache for ${url}: Status ${response.status}`)
        }
      } catch (error) {
        failedCount++
        console.error(`Error warming cache for ${url}:`, error)
      }
    })

    await Promise.all(warmupPromises)

    const message = `Cache warming complete. Successfully warmed ${successCount} pages. Failed to warm ${failedCount} pages.`
    console.log(message)
    return NextResponse.json({ success: true, message, successCount, failedCount })

  } catch (error) {
    console.error('Cache warming process failed:', error)
    return NextResponse.json({ error: 'Failed to execute cache warming' }, { status: 500 })
  }
} 