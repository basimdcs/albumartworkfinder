// iTunes API integration for album artwork search
// All requests are made client-side to avoid rate limiting issues

export interface Album {
  id: string
  title: string
  artist: string
  imageUrl: string
  year?: string
  genre?: string
  tracks?: Track[]
  artistId?: string
  collectionId?: string
  trackCount?: number
  releaseDate?: string
  primaryGenreName?: string
  country?: string
  currency?: string
  collectionPrice?: number
  trackPrice?: number
  collectionViewUrl?: string
  trackViewUrl?: string
  previewUrl?: string
}

export interface Track {
  id: string
  title: string
  duration: string
  trackNumber?: number
  previewUrl?: string
}

export interface Artist {
  id: string
  name: string
  imageUrl?: string
}

export interface iTunesSearchResult {
  resultCount: number
  results: iTunesItem[]
}

export interface iTunesItem {
  wrapperType: string
  kind: string
  artistId: number
  collectionId: number
  trackId: number
  artistName: string
  collectionName: string
  trackName: string
  collectionCensoredName: string
  trackCensoredName: string
  artistViewUrl: string
  collectionViewUrl: string
  trackViewUrl: string
  previewUrl: string
  artworkUrl30: string
  artworkUrl60: string
  artworkUrl100: string
  collectionPrice: number
  trackPrice: number
  releaseDate: string
  collectionExplicitness: string
  trackExplicitness: string
  discCount: number
  discNumber: number
  trackCount: number
  trackNumber: number
  trackTimeMillis: number
  country: string
  currency: string
  primaryGenreName: string
  isStreamable: boolean
}

// iTunes RSS JSON Feed interfaces
export interface iTunesRSSFeed {
  feed: {
    author: {
      name: { label: string }
      uri: { label: string }
    }
    entry: iTunesRSSEntry[]
    updated: { label: string }
    rights: { label: string }
    title: { label: string }
    icon: { label: string }
    link: Array<{
      attributes: {
        rel: string
        type: string
        href: string
      }
    }>
    id: { label: string }
  }
}

export interface iTunesRSSEntry {
  'im:name': { label: string }
  'im:image': Array<{
    label: string
    attributes: { height: string }
  }>
  'im:itemCount': { label: string }
  'im:price': {
    label: string
    attributes: {
      amount: string
      currency: string
    }
  }
  'im:contentType': {
    'im:contentType': {
      attributes: {
        term: string
        label: string
      }
    }
    attributes: {
      term: string
      label: string
    }
  }
  rights: { label: string }
  title: { label: string }
  link: {
    attributes: {
      rel: string
      type: string
      href: string
    }
  }
  id: {
    label: string
    attributes: {
      'im:id': string
    }
  }
  'im:artist': {
    label: string
    attributes: {
      href: string
    }
  }
  category: {
    attributes: {
      'im:id': string
      term: string
      scheme: string
      label: string
    }
  }
  'im:releaseDate': {
    label: string
    attributes: {
      label: string
    }
  }
}

// Cache for API responses (24 hours)
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Helper function to get cached data
const getCachedData = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  const cached = cache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data as T
  }
  
  try {
    const data = await fetcher()
    cache.set(key, { data, timestamp: now })
    return data
  } catch (error) {
    console.error(`Error fetching ${key}:`, error)
    // Return cached data if available, even if expired
    return cached?.data as T || ([] as any)
  }
}

// Helper function to get artwork URL with specified resolution
const getArtworkUrl = (artworkUrl: string, highRes: boolean = false): string => {
  if (!artworkUrl) return '/placeholder.svg?height=300&width=300'
  
  if (highRes) {
    // For album detail pages - use highest quality (up to 1000x1000px)
    return artworkUrl
      .replace(/100x100bb/, '1000x1000bb')
      .replace(/60x60bb/, '1000x1000bb')
      .replace(/30x30bb/, '1000x1000bb')
      .replace(/170x170bb/, '1000x1000bb')
  } else {
    // For homepage and search - use medium quality (300x300px for better performance)
    return artworkUrl
      .replace(/100x100bb/, '300x300bb')
      .replace(/60x60bb/, '300x300bb')
      .replace(/30x30bb/, '300x300bb')
      .replace(/170x170bb/, '300x300bb')
  }
}

// Helper function to get high-resolution artwork URL (up to 1000x1000px) - for backward compatibility
const getHighResArtwork = (artworkUrl: string): string => {
  return getArtworkUrl(artworkUrl, true)
}

// Helper function to create SEO-friendly URL slugs
export const createSEOSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    // Replace special characters and symbols with hyphens
    .replace(/[^\w\s-]/g, '-')
    // Replace multiple spaces or hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 50 characters for better SEO
    .substring(0, 50)
    .replace(/-+$/, '') // Remove trailing hyphen if substring cuts mid-word
}

// Helper function to format duration from milliseconds
const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Convert iTunes item to our Album interface
const convertToAlbum = (item: iTunesItem, highRes: boolean = false): Album => {
  return {
    id: item.collectionId?.toString() || item.trackId?.toString() || Math.random().toString(),
    title: item.collectionName || item.trackName || 'Unknown Album',
    artist: item.artistName || 'Unknown Artist',
    imageUrl: getArtworkUrl(item.artworkUrl100 || item.artworkUrl60 || item.artworkUrl30, highRes),
    year: item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : undefined,
    genre: item.primaryGenreName,
    artistId: item.artistId?.toString(),
    collectionId: item.collectionId?.toString(),
    trackCount: item.trackCount,
    releaseDate: item.releaseDate,
    primaryGenreName: item.primaryGenreName,
    country: item.country,
    currency: item.currency,
    collectionPrice: item.collectionPrice,
    trackPrice: item.trackPrice,
    collectionViewUrl: item.collectionViewUrl,
    trackViewUrl: item.trackViewUrl,
    previewUrl: item.previewUrl
  }
}

// Convert iTunes RSS entry to our Album interface
const convertRSSEntryToAlbum = (entry: iTunesRSSEntry, index: number, highRes: boolean = false): Album => {
  const title = entry['im:name']?.label || 'Unknown Album'
  const artist = entry['im:artist']?.label || 'Unknown Artist'
  
  // Get the highest resolution image
  let imageUrl = '/placeholder.svg?height=300&width=300'
  if (entry['im:image'] && entry['im:image'].length > 0) {
    const largestImage = entry['im:image'][entry['im:image'].length - 1]
    imageUrl = getArtworkUrl(largestImage.label, highRes)
  }
  
  const releaseDate = entry['im:releaseDate']?.label
  const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : undefined
  
  return {
    id: entry.id?.attributes?.['im:id'] || `rss-${index}`,
    title,
    artist,
    imageUrl,
    year,
    genre: entry.category?.attributes?.label,
    trackCount: entry['im:itemCount'] ? parseInt(entry['im:itemCount'].label) : undefined,
    releaseDate,
    collectionPrice: entry['im:price']?.attributes?.amount ? parseFloat(entry['im:price'].attributes.amount) : undefined,
    currency: entry['im:price']?.attributes?.currency,
    collectionViewUrl: entry.link?.attributes?.href
  }
}

// Get top albums from iTunes RSS JSON feed
export const getTopAlbums = async (): Promise<Album[]> => {
  return getCachedData('topAlbums', async () => {
    try {
      const response = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=25/json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: iTunesRSSFeed = await response.json()
      
      if (!data.feed?.entry) {
        throw new Error('Invalid RSS feed structure')
      }
      
      return data.feed.entry.map((entry, index) => convertRSSEntryToAlbum(entry, index, false))
    } catch (error) {
      console.error('Error fetching top albums from RSS:', error)
      // Fallback to search API
      return getPopularAlbumsFromSearch()
    }
  })
}

// Get top singles from iTunes RSS JSON feed
export const getTopSingles = async (): Promise<Album[]> => {
  return getCachedData('topSingles', async () => {
    try {
      const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=25/json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: iTunesRSSFeed = await response.json()
      
      if (!data.feed?.entry) {
        throw new Error('Invalid RSS feed structure')
      }
      
      return data.feed.entry.map((entry, index) => convertRSSEntryToAlbum(entry, index, false))
    } catch (error) {
      console.error('Error fetching top singles from RSS:', error)
      // Fallback to search API
      return getPopularSinglesFromSearch()
    }
  })
}

// Fallback function to get popular albums using search API
const getPopularAlbumsFromSearch = async (): Promise<Album[]> => {
  const popularTerms = ['Taylor Swift', 'Drake', 'The Beatles', 'Adele', 'Ed Sheeran']
  const albums: Album[] = []
  
  try {
    for (const term of popularTerms) {
      const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=album&limit=5`
      const response = await fetch(searchUrl)
      const data: iTunesSearchResult = await response.json()
      
      const termAlbums = data.results
        .filter(item => item.wrapperType === 'collection')
        .map(item => convertToAlbum(item, false))
        .slice(0, 5)
      
      albums.push(...termAlbums)
    }
    
    return albums.slice(0, 25)
  } catch (error) {
    console.error('Error fetching popular albums from search:', error)
    return []
  }
}

// Fallback function to get popular singles using search API
const getPopularSinglesFromSearch = async (): Promise<Album[]> => {
  const popularTerms = ['2024 hits', 'top songs', 'popular music', 'chart toppers', 'trending songs']
  const albums: Album[] = []
  
  try {
    for (const term of popularTerms) {
      const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=5`
      const response = await fetch(searchUrl)
      const data: iTunesSearchResult = await response.json()
      
      const termAlbums = data.results
        .filter(item => item.wrapperType === 'track')
        .map(item => convertToAlbum(item, false))
        .slice(0, 5)
      
      albums.push(...termAlbums)
    }
    
    return albums.slice(0, 25)
  } catch (error) {
    console.error('Error fetching popular singles from search:', error)
    return []
  }
}

// Get popular artists (simplified for now)
export const getPopularArtists = async (): Promise<Artist[]> => {
  return getCachedData('popularArtists', async () => {
    const popularArtists = [
      { id: 'taylor-swift', name: 'Taylor Swift' },
      { id: 'drake', name: 'Drake' },
      { id: 'the-beatles', name: 'The Beatles' },
      { id: 'adele', name: 'Adele' },
      { id: 'ed-sheeran', name: 'Ed Sheeran' },
      { id: 'billie-eilish', name: 'Billie Eilish' },
      { id: 'post-malone', name: 'Post Malone' },
      { id: 'ariana-grande', name: 'Ariana Grande' },
    ]
    
    return popularArtists
  })
}

// Search for albums - limit to 50 and using smaller images
export const searchAlbums = async (query: string): Promise<Album[]> => {
  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=album&limit=50`
    const response = await fetch(searchUrl)
    
    if (!response.ok) {
      console.error(`iTunes API HTTP error: ${response.status} ${response.statusText}`)
      return []
    }
    
    const text = await response.text()
    
    // More robust validation
    if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
      console.error('Empty or invalid response from iTunes API')
      return []
    }
    
    // Check if response looks like JSON
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.error('Response does not appear to be JSON:', text.substring(0, 100))
      return []
    }
    
    let data: iTunesSearchResult
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse iTunes API response:', parseError)
      console.error('Response text:', text.substring(0, 200))
      return []
    }
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid iTunes API response structure - not an object:', typeof data)
      return []
    }
    
    if (!Array.isArray(data.results)) {
      console.error('Invalid iTunes API response structure - results is not an array:', typeof data.results)
      return []
    }
    
    return data.results
      .filter(item => item && item.wrapperType === 'collection')
      .map(item => convertToAlbum(item, false))
      .slice(0, 50) // Ensure we don't exceed 50 results
  } catch (error) {
    console.error('Error searching albums:', error)
    return []
  }
}

// Get album by ID - using high resolution images for detail page
export const getAlbumById = async (id: string): Promise<Album | null> => {
  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${id}&entity=song`
    const response = await fetch(lookupUrl)
    
    if (!response.ok) {
      console.error(`iTunes API HTTP error: ${response.status} ${response.statusText}`)
      return null
    }
    
    const text = await response.text()
    
    // More robust validation
    if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
      console.error('Empty or invalid response from iTunes API')
      return null
    }
    
    // Check if response looks like JSON
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.error('Response does not appear to be JSON:', text.substring(0, 100))
      return null
    }
    
    let data: iTunesSearchResult
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse iTunes API response:', parseError)
      console.error('Response text:', text.substring(0, 200))
      return null
    }
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid iTunes API response structure - not an object:', typeof data)
      return null
    }
    
    if (!Array.isArray(data.results)) {
      console.error('Invalid iTunes API response structure - results is not an array:', typeof data.results)
      return null
    }
    
    if (data.results.length === 0) {
      console.error('No results found in iTunes API response')
      return null
    }
    
    const albumInfo = data.results[0]
    if (!albumInfo) {
      console.error('First result is null or undefined')
      return null
    }
    
    const tracks = data.results
      .filter(item => item && item.wrapperType === 'track')
      .map(item => ({
        id: item.trackId?.toString() || Math.random().toString(),
        title: item.trackName || 'Unknown Track',
        duration: item.trackTimeMillis ? formatDuration(item.trackTimeMillis) : '0:00',
        trackNumber: item.trackNumber || 0,
        previewUrl: item.previewUrl || ''
      }))
    
    const album = convertToAlbum(albumInfo, true) // Use high resolution for album detail page
    album.tracks = tracks
    
    return album
  } catch (error) {
    console.error('Error fetching album by ID:', error)
    return null
  }
}

// Get related albums (albums by the same artist) - using smaller images
export const getRelatedAlbums = async (albumId: string): Promise<Album[]> => {
  try {
    // First get the album to find the artist
    const album = await getAlbumById(albumId)
    if (!album) return []
    
    // Search for other albums by the same artist
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(album.artist)}&media=music&entity=album&limit=20`
    const response = await fetch(searchUrl)
    
    if (!response.ok) {
      console.error(`iTunes API HTTP error: ${response.status} ${response.statusText}`)
      return []
    }
    
    const text = await response.text()
    
    // More robust validation
    if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
      console.error('Empty or invalid response from iTunes API')
      return []
    }
    
    // Check if response looks like JSON
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.error('Response does not appear to be JSON:', text.substring(0, 100))
      return []
    }
    
    let data: iTunesSearchResult
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse iTunes API response:', parseError)
      return []
    }
    
    // Validate response structure
    if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
      return []
    }
    
    return data.results
      .filter(item => item && item.wrapperType === 'collection' && item.collectionId?.toString() !== albumId)
      .map(item => convertToAlbum(item, false)) // Use smaller images for related albums
      .slice(0, 12) // Limit to 12 related albums
  } catch (error) {
    console.error('Error fetching related albums:', error)
    return []
  }
}

// Search for songs - limit to 50 and using smaller images
export const searchSongs = async (query: string): Promise<Album[]> => {
  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=50`
    const response = await fetch(searchUrl)
    
    if (!response.ok) {
      console.error(`iTunes API HTTP error: ${response.status} ${response.statusText}`)
      return []
    }
    
    const text = await response.text()
    
    // More robust validation
    if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
      console.error('Empty or invalid response from iTunes API')
      return []
    }
    
    // Check if response looks like JSON
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      console.error('Response does not appear to be JSON:', text.substring(0, 100))
      return []
    }
    
    let data: iTunesSearchResult
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse iTunes API response:', parseError)
      return []
    }
    
    // Validate response structure
    if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
      return []
    }
    
    return data.results
      .filter(item => item && item.wrapperType === 'track')
      .map(item => convertToAlbum(item, false))
      .slice(0, 50) // Ensure we don't exceed 50 results
  } catch (error) {
    console.error('Error searching songs:', error)
    return []
  }
}

// Search all (albums and songs combined) - limit to 50 total
export const searchAll = async (query: string): Promise<Album[]> => {
  try {
    const [albums, songs] = await Promise.all([
      searchAlbums(query),
      searchSongs(query)
    ])
    
    // Combine and deduplicate results
    const allResults = [...albums, ...songs]
    const uniqueResults = allResults.filter((album, index, self) => 
      index === self.findIndex(a => a.id === album.id)
    )
    
    return uniqueResults.slice(0, 50) // Limit to 50 total results
  } catch (error) {
    console.error('Error searching all:', error)
    return []
  }
}
