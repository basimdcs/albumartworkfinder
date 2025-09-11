import { MetadataRoute } from 'next'
import { getPopularAlbumPages } from '@/lib/search-tracking'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.albumartworkfinder.com'
  const currentDate = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Get album pages with enhanced SEO priority
  let albumArtworkPages: MetadataRoute.Sitemap = []
  try {
    const popularAlbums = await getPopularAlbumPages(2000) // Increased to 2000 for better coverage

    albumArtworkPages = popularAlbums.map((album, index) => ({
      url: `${baseUrl}/album/${album.albumId}/${album.slug}`,
      lastModified: new Date(album.lastSeen),
      changeFrequency: 'weekly' as const, // More frequent updates for popular albums
      // Higher priority for more popular albums (based on position)
      priority: Math.max(0.5, 0.9 - (index / popularAlbums.length) * 0.4),
    }))
  } catch (error) {
    console.error('Failed to load album pages for sitemap:', error)
    // Return empty array if tracking data is not available
    albumArtworkPages = []
  }

  const allPages = [
    ...staticPages,
    ...albumArtworkPages,
  ]

  // Remove duplicates and sort by priority
  const uniquePages = allPages
    .filter((page, index, self) =>
      index === self.findIndex(p => p.url === page.url)
    )
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))

  return uniquePages
}