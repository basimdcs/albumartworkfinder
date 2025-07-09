/**
 * SEO Utility functions for URL canonicalization and search engine optimization
 */

export const createSEOSlug = (text: string): string => {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    // Replace special characters and symbols with hyphens
    .replace(/[^\w\s-]/g, '-')
    // Replace multiple spaces or hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 70 characters for better SEO
    .substring(0, 70)
    .replace(/-+$/, '') // Remove trailing hyphen if substring cuts mid-word
}

export const generateCanonicalUrl = (
  baseUrl: string,
  id: string,
  artist: string,
  title: string
): string => {
  const slug = `${createSEOSlug(artist)}-${createSEOSlug(title)}`
  return `${baseUrl}/album/${id}/${slug}`
}

export const shouldNoIndexPage = (pathname: string, searchParams?: string): boolean => {
  // Don't index search result pages
  if (pathname === '/search' && searchParams) {
    return true
  }
  
  // Don't index API routes
  if (pathname.startsWith('/api/')) {
    return true
  }
  
  // Don't index admin or private pages
  if (pathname.startsWith('/admin/') || pathname.startsWith('/private/')) {
    return true
  }
  
  return false
}

export const getAlbumMetaTags = (album: {
  id: string
  title: string
  artist: string
  imageUrl: string
  genre?: string
  releaseDate?: string
}) => {
  const canonicalUrl = generateCanonicalUrl(
    'https://albumartworkfinder.com',
    album.id,
    album.artist,
    album.title
  )
  
  return {
    title: `${album.title} by ${album.artist} - Album Artwork | AlbumArtworkFinder.com`,
    description: `Download high-quality album artwork for ${album.title} by ${album.artist}. View album cover art, track listing, and find related albums.`,
    canonical: canonicalUrl,
    keywords: [
      `${album.title} album artwork`,
      `${album.artist} album covers`,
      `${album.title} ${album.artist}`,
      'album art download',
      'high quality album covers',
      album.genre || 'music artwork'
    ],
    openGraph: {
      title: `${album.title} by ${album.artist} - Album Artwork`,
      description: `Download high-quality album artwork for ${album.title} by ${album.artist}`,
      url: canonicalUrl,
      image: album.imageUrl,
      type: 'music.album'
    }
  }
} 