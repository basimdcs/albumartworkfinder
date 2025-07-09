// iTunes API integration for album artwork search
// ALL requests are made client-side only to avoid rate limiting

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

// Cache for API responses (10 minutes for frequent requests)
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes for faster searches

// Timeout for requests
const FETCH_TIMEOUT = 8000 // 8 seconds
const MAX_RETRIES = 1 // Maximum retry attempts

// Block all server-side iTunes API calls to prevent rate limiting
const ensureClientSide = () => {
  if (typeof window === 'undefined') {
    throw new Error('iTunes API calls must be made client-side only to avoid rate limiting. This function cannot be called on the server.')
  }
}

// Retry-enabled fetch to iTunes API (client-side only)
const fetchiTunesAPI = async (url: string, retryCount = 0): Promise<iTunesSearchResult> => {
  ensureClientSide()
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AlbumArtworkFinder/1.0'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status} ${response.statusText}`)
    }
    
    const text = await response.text()
    
    if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
      throw new Error('Empty response from iTunes API')
    }
    
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      throw new Error('Invalid JSON response from iTunes API')
    }
    
    const data: iTunesSearchResult = JSON.parse(text)
    
    if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
      throw new Error('Invalid iTunes API response structure')
    }
    
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        // Retry on timeout if we haven't exceeded max retries
        if (retryCount < MAX_RETRIES) {
          console.log(`iTunes API timeout, retrying... (${retryCount + 1}/${MAX_RETRIES})`)
          // Wait briefly before retry
          await new Promise(resolve => setTimeout(resolve, 500))
          return fetchiTunesAPI(url, retryCount + 1)
        }
        throw new Error('iTunes API request timed out after multiple attempts. Please try again.')
      }
      
      // Retry on network errors if we haven't exceeded max retries
      if ((error.message.includes('network') || error.message.includes('fetch')) && retryCount < MAX_RETRIES) {
        console.log(`iTunes API network error, retrying... (${retryCount + 1}/${MAX_RETRIES})`)
        await new Promise(resolve => setTimeout(resolve, 500))
        return fetchiTunesAPI(url, retryCount + 1)
      }
      
      throw new Error(`iTunes API error: ${error.message}`)
    }
    
    throw new Error('iTunes API error: Unknown error occurred')
  }
}

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
    cache.delete(key)
    throw error
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
  
  const collectionId = entry.id?.attributes?.['im:id'] || `rss-${index}`
  
  return {
    id: collectionId,
    title,
    artist,
    imageUrl,
    year,
    genre: entry.category?.attributes?.label,
    trackCount: entry['im:itemCount'] ? parseInt(entry['im:itemCount'].label) : undefined,
    releaseDate,
    collectionPrice: entry['im:price']?.attributes?.amount ? parseFloat(entry['im:price'].attributes.amount) : undefined,
    currency: entry['im:price']?.attributes?.currency,
    collectionViewUrl: entry.link?.attributes?.href,
    collectionId: collectionId
  }
}

// Static fallback data for instant loading
const STATIC_FALLBACK_ALBUMS: Album[] = [
  {
    id: '1440857781',
    title: 'Midnights',
    artist: 'Taylor Swift',
    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/18/93/6f/18936f85-8f5b-7fa2-9e47-ac63438eda6e/22UMGIM86640.rgb.jpg/300x300bb.jpg',
    year: '2022',
    genre: 'Pop'
  },
  {
    id: '1613784588',
    title: 'Scorpion',
    artist: 'Drake',
    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/70/12/36/701236b9-8d8d-4c24-8c5f-1c9956bfb8b4/18UMGIM56838.rgb.jpg/300x300bb.jpg',
    year: '2018',
    genre: 'Hip-Hop/Rap'
  },
  {
    id: '1193710813',
    title: 'Abbey Road',
    artist: 'The Beatles',
    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/57/26/f0/5726f0de-ecf5-9fa7-bb1e-d1fb785c2748/19UMGIM12972.rgb.jpg/300x300bb.jpg',
    year: '1969',
    genre: 'Rock'
  },
  {
    id: '1440857781',
    title: '25',
    artist: 'Adele',
    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/aa/40/19/aa401985-181b-9301-fb4b-4a4a2a6a5b9b/886445635164.jpg/300x300bb.jpg',
    year: '2015',
    genre: 'Pop'
  },
  {
    id: '1193710813',
    title: '÷ (Divide)',
    artist: 'Ed Sheeran',
    imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/60/c6/57/60c6571e-7d69-5b7b-6f67-c2b2b1da2e37/190295854485.jpg/300x300bb.jpg',
    year: '2017',
    genre: 'Pop'
  }
]

// Get top albums from iTunes RSS JSON feed (CLIENT-SIDE ONLY)
export const getTopAlbums = async (): Promise<Album[]> => {
  ensureClientSide()
  
  return getCachedData('topAlbums', async () => {
    try {
      const response = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=25/json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const text = await response.text()
      
      if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
        throw new Error('Empty response from iTunes RSS')
      }
      
      if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
        throw new Error('Invalid JSON response from iTunes RSS')
      }
      
      const data: iTunesRSSFeed = JSON.parse(text)
      
      if (!data.feed?.entry) {
        throw new Error('Invalid RSS feed structure')
      }
      
      return data.feed.entry.map((entry, index) => convertRSSEntryToAlbum(entry, index, false))
    } catch (error) {
      // Return static fallback data for immediate loading
      return STATIC_FALLBACK_ALBUMS
    }
  })
}

// Get top singles from iTunes RSS JSON feed (CLIENT-SIDE ONLY)
export const getTopSingles = async (): Promise<Album[]> => {
  ensureClientSide()
  
  return getCachedData('topSingles', async () => {
    try {
      const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=25/json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const text = await response.text()
      
      if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
        throw new Error('Empty response from iTunes RSS')
      }
      
      if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
        throw new Error('Invalid JSON response from iTunes RSS')
      }
      
      const data: iTunesRSSFeed = JSON.parse(text)
      
      if (!data.feed?.entry) {
        throw new Error('Invalid RSS feed structure')
      }
      
      return data.feed.entry.map((entry, index) => convertRSSEntryToAlbum(entry, index, false))
    } catch (error) {
      // Return static fallback data for immediate loading
      return STATIC_FALLBACK_ALBUMS
    }
  })
}

// Get popular artists (simplified)
export const getPopularArtists = async (): Promise<Artist[]> => {
  ensureClientSide()
  
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

// Search for albums only (CLIENT-SIDE ONLY)
export const searchAlbums = async (query: string): Promise<Album[]> => {
  if (!query.trim()) {
    throw new Error('Empty search query provided')
  }
  
  ensureClientSide()
  
  return getCachedData(`albums_${query}`, async () => {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=album&limit=25`
    
    const data = await fetchiTunesAPI(itunesUrl)
    
    if (data.results.length === 0) {
      return []
    }
    
    // Filter for albums only
    const validAlbums = data.results.filter(item => 
      item.wrapperType === 'collection' && 
      item.collectionName && 
      item.artistName &&
      item.artworkUrl100
    )
    
    if (validAlbums.length === 0) {
      throw new Error(`No valid albums found for "${query}"`)
    }
    
    const albums = validAlbums
      .map((item) => {
        try {
          return convertToAlbum(item, false)
        } catch (conversionError) {
          return null
        }
      })
      .filter((album): album is Album => album !== null)
      .slice(0, 25)
      
    if (albums.length === 0) {
      throw new Error(`Failed to convert any valid albums for "${query}"`)
    }
    
    return albums
  })
}

// Get album by ID (CLIENT-SIDE ONLY)
export const getAlbumById = async (id: string): Promise<Album | null> => {
  ensureClientSide()
  
  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${id}&entity=song`
    const data = await fetchiTunesAPI(lookupUrl)
    
    if (data.results.length === 0) {
      return null
    }
    
    const albumInfo = data.results[0]
    if (!albumInfo) {
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
    return null
  }
}

// Get related albums (albums by the same artist) (CLIENT-SIDE ONLY)
export const getRelatedAlbums = async (albumId: string): Promise<Album[]> => {
  ensureClientSide()
  
  try {
    // First get the album to find the artist
    const album = await getAlbumById(albumId)
    if (!album) return []
    
    // Search for other albums by the same artist
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(album.artist)}&media=music&entity=album&limit=20`
    const data = await fetchiTunesAPI(searchUrl)
    
    return data.results
      .filter(item => item && item.wrapperType === 'collection' && item.collectionId?.toString() !== albumId)
      .map(item => convertToAlbum(item, false)) // Use smaller images for related albums
      .slice(0, 12) // Limit to 12 related albums
  } catch (error) {
    return []
  }
}

// Simplified search - albums only
export const searchAll = searchAlbums