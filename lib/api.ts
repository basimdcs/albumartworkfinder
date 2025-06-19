import { unstable_cache } from 'next/cache'

// iTunes API integration for album artwork search
// All requests are made client-side using CORS proxy for mobile compatibility

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

// Cache for API responses (30 minutes)
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Reduce timeout to fail faster and use fallbacks sooner
const FETCH_TIMEOUT = 5000 // 5 seconds instead of 10

// Mobile-friendly CORS proxy solution
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

// CORS proxy URLs for mobile browsers (client-side only)
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
]

// Fetch with mobile CORS proxy fallback
const fetchWithMobileFallback = async (url: string): Promise<iTunesSearchResult> => {
  const mobile = isMobile()
  
  // First try direct request (works on desktop)
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
    
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
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const text = await response.text()
    
    // Validate response text before parsing
    if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
      throw new Error('Empty or invalid response from iTunes API')
    }
    
    // Check if response looks like JSON
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      throw new Error('Response is not valid JSON format')
    }
    
    let data: iTunesSearchResult
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      throw new Error('Failed to parse iTunes API response as JSON')
    }
    
    // Validate the parsed data structure
    if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
      throw new Error('Invalid iTunes API response structure')
    }
    
    return data
  } catch (directError) {
    // If direct fails, try CORS proxies (especially for mobile)
    const proxiesToTry = mobile ? CORS_PROXIES : CORS_PROXIES.slice(0, 1) // Try fewer proxies on desktop
    
    for (let i = 0; i < proxiesToTry.length; i++) {
      const proxy = proxiesToTry[i]
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
        
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`Proxy HTTP ${response.status}: ${response.statusText}`)
        }
        
        const text = await response.text()
        
        // Validate response text before parsing
        if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
          throw new Error('Empty or invalid response from proxy')
        }
        
        // Check if response looks like JSON
        if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
          throw new Error('Proxy response is not valid JSON format')
        }
        
        let data: iTunesSearchResult
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          throw new Error('Failed to parse proxy response as JSON')
        }
        
        // Validate the parsed data structure
        if (!data || typeof data !== 'object' || !Array.isArray(data.results)) {
          throw new Error('Invalid proxy response structure')
        }
        
        return data
      } catch (proxyError) {
        // If this is the last proxy, throw a more user-friendly error
        if (i === proxiesToTry.length - 1) {
          throw new Error(`Unable to connect to iTunes. Please check your internet connection and try again.`)
        }
        // Continue to next proxy
        continue
      }
    }
    
    // This should never be reached, but just in case
    throw new Error(`Unable to connect to iTunes. Please check your internet connection and try again.`)
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
    // Remove any cached data for this key
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

// Helper function to get high-resolution artwork URL (up to 1000x1000px) - for backward compatibility
const getHighResArtwork = (artworkUrl: string): string => {
  return getArtworkUrl(artworkUrl, true)
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

// Get top albums from iTunes RSS JSON feed
export const getTopAlbums = async (): Promise<Album[]> => {
  return getCachedData('topAlbums', async () => {
    try {
      const response = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=25/json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const text = await response.text()
      
      // Validate response text before parsing
      if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
        throw new Error('Empty or invalid response from iTunes RSS')
      }
      
      // Check if response looks like JSON
      if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
        throw new Error('Response is not valid JSON format')
      }
      
      let data: iTunesRSSFeed
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error('Failed to parse iTunes RSS response as JSON')
      }
      
      if (!data.feed?.entry) {
        throw new Error('Invalid RSS feed structure')
      }
      
      return data.feed.entry.map((entry, index) => convertRSSEntryToAlbum(entry, index, false))
    } catch (error) {
      // Fallback to search API with popular terms
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
      
      const text = await response.text()
      
      // Validate response text before parsing
      if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
        throw new Error('Empty or invalid response from iTunes RSS')
      }
      
      // Check if response looks like JSON
      if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
        throw new Error('Response is not valid JSON format')
      }
      
      let data: iTunesRSSFeed
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error('Failed to parse iTunes RSS response as JSON')
      }
      
      if (!data.feed?.entry) {
        throw new Error('Invalid RSS feed structure')
      }
      
      return data.feed.entry.map((entry, index) => convertRSSEntryToAlbum(entry, index, false))
    } catch (error) {
      // Fallback to search API with popular terms
      return getPopularSinglesFromSearch()
    }
  })
}

// Fallback function to get popular albums using search API - optimized for speed
const getPopularAlbumsFromSearch = async (): Promise<Album[]> => {
  const popularTerms = ['Taylor Swift', 'Drake', 'The Beatles'] // Reduced to 3 most popular
  
  try {
    // Use Promise.allSettled to handle partial failures gracefully
    const results = await Promise.allSettled(
      popularTerms.map(async (term) => {
        const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=album&limit=8`
        const response = await fetch(searchUrl)
        const data: iTunesSearchResult = await response.json()
        
        return data.results
          .filter(item => item.wrapperType === 'collection')
          .map(item => convertToAlbum(item, false))
          .slice(0, 8)
      })
    )
    
    const albums: Album[] = []
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        albums.push(...result.value)
      }
    })
    
    // If we have some results, return them; otherwise return static fallback
    return albums.length > 0 ? albums.slice(0, 25) : STATIC_FALLBACK_ALBUMS
  } catch (error) {
    // Return static fallback data for immediate loading
    return STATIC_FALLBACK_ALBUMS
  }
}

// Fallback function to get popular singles using search API - optimized for speed
const getPopularSinglesFromSearch = async (): Promise<Album[]> => {
  const popularTerms = ['2024 hits', 'top songs', 'trending music'] // Reduced and more specific
  
  try {
    // Use Promise.allSettled to handle partial failures gracefully
          const results = await Promise.allSettled(
      popularTerms.map(async (term) => {
        const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=8`
        const response = await fetch(searchUrl)
        const data: iTunesSearchResult = await response.json()
        
        return data.results
          .filter(item => item.wrapperType === 'track')
          .map(item => convertToAlbum(item, false))
          .slice(0, 8)
      })
    )
    
    const songs: Album[] = []
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        songs.push(...result.value)
      }
    })
    
    // If we have some results, return them; otherwise return static fallback
    return songs.length > 0 ? songs.slice(0, 25) : STATIC_FALLBACK_ALBUMS
  } catch (error) {
    // Return static fallback data for immediate loading
    return STATIC_FALLBACK_ALBUMS
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

// Search for albums only - simplified and optimized
export const searchAlbums = async (query: string): Promise<Album[]> => {
  if (!query.trim()) {
    const error = new Error('Empty search query provided')
    throw error
  }
  
  // Block server-side calls completely
  if (typeof window === 'undefined') {
    const error = new Error('Server-side iTunes API calls are blocked to prevent rate limiting and CORS issues')
    throw error
  }
  
  return getCachedData(`albums_${query}`, async () => {
    // iTunes API URL
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=album&limit=25`
    

    
    const startTime = performance.now()
    let data: iTunesSearchResult
    
    try {
      data = await fetchWithMobileFallback(itunesUrl)
    } catch (fetchError) {
      const endTime = performance.now()
      const errorDetails = {
        query,
        itunesUrl,
        error: fetchError,
        errorMessage: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        errorName: fetchError instanceof Error ? fetchError.name : 'Unknown',
        duration: `${Math.round(endTime - startTime)}ms`,
        timestamp: new Date().toISOString(),
        clientInfo: {
          online: navigator?.onLine,
          userAgent: navigator?.userAgent,
          location: window?.location?.href,
          isMobile: isMobile(),
          connection: (navigator as any)?.connection ? {
            effectiveType: (navigator as any).connection.effectiveType,
            downlink: (navigator as any).connection.downlink,
            rtt: (navigator as any).connection.rtt
          } : 'Not available'
        }
      }
      throw new Error(`Network error accessing iTunes API: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}. Duration: ${Math.round(endTime - startTime)}ms`)
    }

    const endTime = performance.now()
    const requestDuration = Math.round(endTime - startTime)
    
    if (!data || typeof data.resultCount !== 'number' || !Array.isArray(data.results)) {
      const errorDetails = {
        query,
        itunesUrl,
        invalidData: data,
        duration: `${requestDuration}ms`,
        timestamp: new Date().toISOString()
      }
      throw new Error(`Invalid iTunes API response structure. Expected {resultCount: number, results: array}, got: ${JSON.stringify(data)}. Duration: ${requestDuration}ms`)
    }
    
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
      const error = new Error(`No valid albums found for "${query}". Found ${data.results.length} iTunes results but none were valid albums.`)
      throw error
    }
    
    const albums = validAlbums
      .map((item, index) => {
        try {
          return convertToAlbum(item, false)
        } catch (conversionError) {
          return null
        }
      })
      .filter((album): album is Album => album !== null)
      .slice(0, 25)
      
    if (albums.length === 0) {
      const error = new Error(`Failed to convert any valid albums for "${query}". All ${validAlbums.length} valid iTunes results failed during conversion.`)
      throw error
    }
    
    return albums
  })
}

// Get album by ID - using high resolution images for detail page
export const getAlbumById = async (id: string): Promise<Album | null> => {
  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${id}&entity=song`
    const response = await fetch(lookupUrl)
    
    if (!response.ok) {
      return null
    }
    
    const text = await response.text()
    
    // More robust validation
    if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
      return null
    }
    
    // Check if response looks like JSON
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      return null
    }
    
    let data: iTunesSearchResult
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      return null
    }
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      return null
    }
    
    if (!Array.isArray(data.results)) {
      return null
    }
    
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
      return []
    }
    
    const text = await response.text()
    
    // More robust validation
    if (!text || text.trim() === '' || text === 'undefined' || text === 'null') {
      return []
    }
    
    // Check if response looks like JSON
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      return []
    }
    
    let data: iTunesSearchResult
    try {
      data = JSON.parse(text)
    } catch (parseError) {
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
    return []
  }
}

// Simplified search - albums only (no duplicate declaration)
export const searchAll = searchAlbums
