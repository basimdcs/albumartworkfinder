import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://albumartworkfinder.com'
  
  // Popular artists for sitemap
  const popularArtists = [
    'taylor-swift', 'drake', 'the-beatles', 'adele', 'ed-sheeran',
    'billie-eilish', 'post-malone', 'ariana-grande', 'the-weeknd', 'dua-lipa',
    'harry-styles', 'olivia-rodrigo', 'bad-bunny', 'kanye-west', 'beyonce',
    'eminem', 'rihanna', 'justin-bieber', 'lady-gaga', 'bruno-mars'
  ]

  // Popular genres for sitemap
  const popularGenres = [
    'pop', 'rock', 'hip-hop', 'country', 'electronic', 'jazz', 'classical',
    'r-b', 'indie', 'alternative', 'metal', 'folk', 'reggae', 'blues'
  ]

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Add popular artist search pages
  const artistPages = popularArtists.map(artist => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(artist.replace('-', ' '))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Add popular genre search pages
  const genrePages = popularGenres.map(genre => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(genre)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...artistPages,
    ...genrePages,
  ]
}
