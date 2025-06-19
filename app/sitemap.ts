import { MetadataRoute } from 'next'
import { getPopularSearchQueries, getPopularAlbumPages } from '@/lib/search-tracking'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://albumartworkfinder.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  let dynamicSearchPages: MetadataRoute.Sitemap = []
  try {
    const popularQueries = await getPopularSearchQueries(100) // Get top 100 tracked queries
    const uniqueQueries = [...new Set(popularQueries.map(q => q.toLowerCase().trim()))]
      .filter(q => q.length > 2)

    dynamicSearchPages = uniqueQueries.map(query => ({
      url: `${baseUrl}/search?q=${encodeURIComponent(query)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
  } catch (error) {
    console.error('Failed to load dynamic search queries for sitemap:', error)
  }

  let albumArtworkPages: MetadataRoute.Sitemap = []
  try {
    const popularAlbums = await getPopularAlbumPages(1000) // Track top 1000 album pages

    albumArtworkPages = popularAlbums.map(album => ({
      url: `${baseUrl}/album/${album.albumId}/${album.slug}`,
      lastModified: new Date(album.lastSeen),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Failed to load album pages for sitemap:', error)
  }

  const allPages = [
    ...staticPages,
    ...dynamicSearchPages,
    ...albumArtworkPages,
  ]

  // Remove duplicates based on URL
  const uniquePages = allPages.filter((page, index, self) =>
    index === self.findIndex(p => p.url === page.url)
  )

  return uniquePages
}
