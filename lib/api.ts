import { unstable_cache } from 'next/cache'

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

// Cache for API responses (30 minutes)
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Reduce timeout to fail faster and use fallbacks sooner
const FETCH_TIMEOUT = 5000 // 5 seconds instead of 10

// Helper function to fetch with timeout and retry
const fetchWithTimeout = async (url: string, options?: RequestInit): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Helper function to get cached data
const getCachedData = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  const cached = cache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`📦 Cache hit for key: ${key}`)
    return cached.data as T
  }
  
  console.log(`🔄 Cache miss for key: ${key}, fetching fresh data...`)
  
  try {
    const data = await fetcher()
    cache.set(key, { data, timestamp: now })
    console.log(`✅ Successfully cached data for key: ${key}`)
    return data
  } catch (error) {
    console.error(`❌ Error fetching data for key: ${key}`, error)
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
      const response = await fetchWithTimeout('https://itunes.apple.com/us/rss/topalbums/limit=25/json')
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
      // Fallback to search API with popular terms
      return getPopularAlbumsFromSearch()
    }
  })
}

// Get top singles from iTunes RSS JSON feed
export const getTopSingles = async (): Promise<Album[]> => {
  return getCachedData('topSingles', async () => {
    try {
      const response = await fetchWithTimeout('https://itunes.apple.com/us/rss/topsongs/limit=25/json')
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
        const response = await fetchWithTimeout(searchUrl)
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
    console.error('Error fetching popular albums from search:', error)
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
        const response = await fetchWithTimeout(searchUrl)
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
    console.error('Error fetching popular singles from search:', error)
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

// Search for albums - client-side only with comprehensive error reporting
export const searchAlbums = async (query: string): Promise<Album[]> => {
  if (!query.trim()) {
    const error = new Error('Empty search query provided')
    console.error('❌ SearchAlbums Error:', {
      error: error.message,
      query,
      timestamp: new Date().toISOString()
    })
    throw error
  }
  
  // Block server-side calls completely
  if (typeof window === 'undefined') {
    const error = new Error('Server-side iTunes API calls are blocked to prevent rate limiting and CORS issues')
    console.error('🚫 Server-side search attempt blocked:', {
      query,
      error: error.message,
      location: 'searchAlbums',
      timestamp: new Date().toISOString(),
      stack: new Error().stack
    })
    throw error
  }
  
  return getCachedData(`albums_${query}`, async () => {
    // Use our Vercel proxy instead of direct iTunes API
    const proxyUrl = `/api/itunes-proxy?term=${encodeURIComponent(query)}&media=music&entity=album&limit=50`
    
    console.log('🔍 iTunes Album Search Started (via proxy):', {
      query,
      encodedQuery: encodeURIComponent(query),
      proxyUrl,
      timestamp: new Date().toISOString(),
      userAgent: navigator?.userAgent || 'Unknown',
      location: window?.location?.href || 'Unknown',
      online: navigator?.onLine || 'Unknown'
    })
    
    let response: Response
    const startTime = performance.now()
    
    try {
      response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })
    } catch (fetchError) {
      const endTime = performance.now()
      const errorDetails = {
        query,
        proxyUrl,
        error: fetchError,
        errorMessage: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        errorName: fetchError instanceof Error ? fetchError.name : 'Unknown',
        duration: `${Math.round(endTime - startTime)}ms`,
        timestamp: new Date().toISOString(),
        networkInfo: {
          online: navigator?.onLine,
          connection: (navigator as any)?.connection ? {
            effectiveType: (navigator as any).connection.effectiveType,
            downlink: (navigator as any).connection.downlink,
            rtt: (navigator as any).connection.rtt
          } : 'Not available'
        }
      }
      console.error('❌ Network error during iTunes Proxy fetch:', errorDetails)
      throw new Error(`Network error accessing iTunes Proxy: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}. Duration: ${Math.round(endTime - startTime)}ms`)
    }
    
    const endTime = performance.now()
    const requestDuration = Math.round(endTime - startTime)
    
    if (!response.ok) {
      let responseText = 'Could not read response body'
      try {
        responseText = await response.text()
      } catch (e) {
        console.error('Failed to read error response body:', e)
      }
      
      const errorDetails = {
        query,
        proxyUrl,
        status: response.status,
        statusText: response.statusText,
        responseBody: responseText,
        duration: `${requestDuration}ms`,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      }
      console.error('❌ iTunes Proxy HTTP error:', errorDetails)
      throw new Error(`iTunes Proxy HTTP ${response.status} error: ${response.statusText}. Response: ${responseText}. Duration: ${requestDuration}ms`)
    }
    
    let data: iTunesSearchResult
    try {
      data = await response.json()
    } catch (parseError) {
      const errorDetails = {
        query,
        proxyUrl,
        error: parseError,
        duration: `${requestDuration}ms`,
        timestamp: new Date().toISOString()
      }
      console.error('❌ Failed to parse iTunes Proxy JSON response:', errorDetails)
      throw new Error(`Failed to parse iTunes Proxy JSON response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}. Duration: ${requestDuration}ms`)
    }
    
    console.log('📊 iTunes Proxy Response Received:', {
      query,
      status: response.status,
      duration: `${requestDuration}ms`,
      resultCount: data.resultCount,
      actualResults: data.results?.length || 0,
      timestamp: new Date().toISOString(),
      responseSize: JSON.stringify(data).length + ' characters'
    })
    
    if (!data.results) {
      const error = new Error(`iTunes Proxy returned no results array for "${query}"`)
      console.error('❌ iTunes Proxy structure error:', {
        query,
        data,
        error: error.message,
        timestamp: new Date().toISOString()
      })
      throw error
    }
    
    if (data.results.length === 0) {
      const error = new Error(`No albums found for "${query}" in iTunes API`)
      console.error('⚠️ No results found:', {
        query,
        resultCount: data.resultCount,
        timestamp: new Date().toISOString()
      })
      throw error
    }
    
    const validCollections = data.results.filter(item => {
      const isValid = item && item.wrapperType === 'collection' && item.collectionName && item.artistName
      if (!isValid) {
        console.log('🔍 Filtered out invalid result:', {
          wrapperType: item?.wrapperType,
          collectionName: item?.collectionName,
          artistName: item?.artistName,
          hasItem: !!item
        })
      }
      return isValid
    })
    
    console.log('📋 iTunes Results Filtering:', {
      query,
      totalResults: data.results.length,
      validCollections: validCollections.length,
      filteredOut: data.results.length - validCollections.length,
      timestamp: new Date().toISOString()
    })
    
    if (validCollections.length === 0) {
      const error = new Error(`No valid album collections found for "${query}". All ${data.results.length} results were invalid or filtered out.`)
      console.error('❌ No valid collections after filtering:', {
        query,
        totalResults: data.results.length,
        sampleResults: data.results.slice(0, 3).map(item => ({
          wrapperType: item?.wrapperType,
          collectionName: item?.collectionName,
          artistName: item?.artistName
        })),
        timestamp: new Date().toISOString()
      })
      throw error
    }
    
    const albums = validCollections
      .map((item, index) => {
        try {
          return convertToAlbum(item, false)
        } catch (conversionError) {
          console.error('❌ Failed to convert iTunes item to album:', {
            query,
            index,
            item: {
              collectionName: item.collectionName,
              artistName: item.artistName,
              collectionId: item.collectionId
            },
            error: conversionError,
            timestamp: new Date().toISOString()
          })
          return null
        }
      })
      .filter((album): album is Album => album !== null)
      .slice(0, 50)
    
    console.log('✅ iTunes Album Search Completed (via proxy):', {
      query,
      totalDuration: `${requestDuration}ms`,
      inputResults: data.results.length,
      validCollections: validCollections.length,
      finalAlbums: albums.length,
      conversionSuccessRate: `${Math.round((albums.length / validCollections.length) * 100)}%`,
      timestamp: new Date().toISOString(),
      sampleAlbums: albums.slice(0, 3).map(album => ({
        title: album.title,
        artist: album.artist,
        id: album.id
      }))
    })
    
    if (albums.length === 0) {
      const error = new Error(`Failed to convert any valid albums for "${query}". All ${validCollections.length} valid iTunes results failed during album conversion.`)
      console.error('❌ No albums after conversion:', {
        query,
        validCollections: validCollections.length,
        timestamp: new Date().toISOString()
      })
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

// Search for songs - client-side only with comprehensive error reporting
export const searchSongs = async (query: string): Promise<Album[]> => {
  if (!query.trim()) {
    const error = new Error('Empty search query provided')
    console.error('❌ SearchSongs Error:', {
      error: error.message,
      query,
      timestamp: new Date().toISOString()
    })
    throw error
  }
  
  // Block server-side calls completely
  if (typeof window === 'undefined') {
    const error = new Error('Server-side iTunes API calls are blocked to prevent rate limiting and CORS issues')
    console.error('🚫 Server-side search attempt blocked:', {
      query,
      error: error.message,
      location: 'searchSongs',
      timestamp: new Date().toISOString(),
      stack: new Error().stack
    })
    throw error
  }
  
  return getCachedData(`songs_${query}`, async () => {
    // Use our Vercel proxy instead of direct iTunes API
    const proxyUrl = `/api/itunes-proxy?term=${encodeURIComponent(query)}&media=music&entity=song&limit=50`
    
    console.log('🔍 iTunes Songs Search Started (via proxy):', {
      query,
      encodedQuery: encodeURIComponent(query),
      proxyUrl,
      timestamp: new Date().toISOString(),
      userAgent: navigator?.userAgent || 'Unknown',
      location: window?.location?.href || 'Unknown',
      online: navigator?.onLine || 'Unknown'
    })
    
    let response: Response
    const startTime = performance.now()
    
    try {
      response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })
    } catch (fetchError) {
      const endTime = performance.now()
      const errorDetails = {
        query,
        proxyUrl,
        error: fetchError,
        errorMessage: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        errorName: fetchError instanceof Error ? fetchError.name : 'Unknown',
        duration: `${Math.round(endTime - startTime)}ms`,
        timestamp: new Date().toISOString()
      }
      console.error('❌ Network error during iTunes Songs Proxy fetch:', errorDetails)
      throw new Error(`Network error accessing iTunes Songs Proxy: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}. Duration: ${Math.round(endTime - startTime)}ms`)
    }
    
    const endTime = performance.now()
    const requestDuration = Math.round(endTime - startTime)
    
    if (!response.ok) {
      let responseText = 'Could not read response body'
      try {
        responseText = await response.text()
      } catch (e) {
        console.error('Failed to read error response body:', e)
      }
      
      const errorDetails = {
        query,
        proxyUrl,
        status: response.status,
        statusText: response.statusText,
        responseBody: responseText,
        duration: `${requestDuration}ms`,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      }
      console.error('❌ iTunes Songs Proxy HTTP error:', errorDetails)
      throw new Error(`iTunes Songs Proxy HTTP ${response.status} error: ${response.statusText}. Response: ${responseText}. Duration: ${requestDuration}ms`)
    }
    
    let data: iTunesSearchResult
    try {
      data = await response.json()
    } catch (parseError) {
      const errorDetails = {
        query,
        proxyUrl,
        error: parseError,
        duration: `${requestDuration}ms`,
        timestamp: new Date().toISOString()
      }
      console.error('❌ Failed to parse iTunes Songs Proxy JSON response:', errorDetails)
      throw new Error(`Failed to parse iTunes Songs Proxy JSON response: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}. Duration: ${requestDuration}ms`)
    }
    
    console.log('📊 iTunes Songs Proxy Response Received:', {
      query,
      status: response.status,
      duration: `${requestDuration}ms`,
      resultCount: data.resultCount,
      actualResults: data.results?.length || 0,
      timestamp: new Date().toISOString()
    })
    
    if (!data.results) {
      const error = new Error(`iTunes Songs Proxy returned no results array for "${query}"`)
      console.error('❌ iTunes Songs Proxy structure error:', {
        query,
        data,
        error: error.message,
        timestamp: new Date().toISOString()
      })
      throw error
    }
    
    if (data.results.length === 0) {
      const error = new Error(`No songs found for "${query}" in iTunes API`)
      console.error('⚠️ No songs found:', {
        query,
        resultCount: data.resultCount,
        timestamp: new Date().toISOString()
      })
      throw error
    }
    
    const validTracks = data.results.filter(item => {
      const isValid = item && item.wrapperType === 'track' && item.trackName && item.artistName
      if (!isValid) {
        console.log('🔍 Filtered out invalid song result:', {
          wrapperType: item?.wrapperType,
          trackName: item?.trackName,
          artistName: item?.artistName,
          hasItem: !!item
        })
      }
      return isValid
    })
    
    console.log('📋 iTunes Songs Results Filtering:', {
      query,
      totalResults: data.results.length,
      validTracks: validTracks.length,
      filteredOut: data.results.length - validTracks.length,
      timestamp: new Date().toISOString()
    })
    
    if (validTracks.length === 0) {
      const error = new Error(`No valid song tracks found for "${query}". All ${data.results.length} results were invalid or filtered out.`)
      console.error('❌ No valid tracks after filtering:', {
        query,
        totalResults: data.results.length,
        sampleResults: data.results.slice(0, 3).map(item => ({
          wrapperType: item?.wrapperType,
          trackName: item?.trackName,
          artistName: item?.artistName
        })),
        timestamp: new Date().toISOString()
      })
      throw error
    }
    
    const songs = validTracks
      .map((item, index) => {
        try {
          return convertToAlbum(item, false)
        } catch (conversionError) {
          console.error('❌ Failed to convert iTunes song item to album:', {
            query,
            index,
            item: {
              trackName: item.trackName,
              artistName: item.artistName,
              trackId: item.trackId
            },
            error: conversionError,
            timestamp: new Date().toISOString()
          })
          return null
        }
      })
      .filter((song): song is Album => song !== null)
      .slice(0, 50)
    
    console.log('✅ iTunes Songs Search Completed (via proxy):', {
      query,
      totalDuration: `${requestDuration}ms`,
      inputResults: data.results.length,
      validTracks: validTracks.length,
      finalSongs: songs.length,
      conversionSuccessRate: `${Math.round((songs.length / validTracks.length) * 100)}%`,
      timestamp: new Date().toISOString()
    })
    
    if (songs.length === 0) {
      const error = new Error(`Failed to convert any valid songs for "${query}". All ${validTracks.length} valid iTunes results failed during conversion.`)
      console.error('❌ No songs after conversion:', {
        query,
        validTracks: validTracks.length,
        timestamp: new Date().toISOString()
      })
      throw error
    }
    
    return songs
  })
}

// Search all (albums and songs combined) - with better error handling
export const searchAll = async (query: string): Promise<Album[]> => {
  if (!query.trim()) {
    const error = new Error('Empty search query provided')
    console.error('❌ SearchAll Error:', {
      error: error.message,
      query,
      timestamp: new Date().toISOString()
    })
    throw error
  }
  
  console.log('🔍 searchAll called for:', {
    query,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator?.userAgent : 'Server-side',
    online: typeof window !== 'undefined' ? navigator?.onLine : 'Unknown'
  })
  
  try {
    // Use Promise.allSettled to handle partial failures gracefully
    const searchPromises = [
      searchAlbums(query).catch(error => {
        console.error('❌ searchAlbums failed in searchAll:', {
          query,
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : 'No stack trace',
          timestamp: new Date().toISOString()
        })
        throw error
      }),
      searchSongs(query).catch(error => {
        console.error('❌ searchSongs failed in searchAll:', {
          query,
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : 'No stack trace',
          timestamp: new Date().toISOString()
        })
        throw error
      })
    ]
    
    const [albumsResult, songsResult] = await Promise.allSettled(searchPromises)
    
    let albums: Album[] = []
    let songs: Album[] = []
    let albumsError: any = null
    let songsError: any = null
    
    if (albumsResult.status === 'fulfilled') {
      albums = albumsResult.value || []
      console.log('✅ Albums search succeeded in searchAll:', {
        query,
        albumCount: albums.length,
        timestamp: new Date().toISOString()
      })
    } else {
      albumsError = albumsResult.reason
      console.error('❌ Albums search failed in searchAll:', {
        query,
        error: albumsResult.reason,
        errorMessage: albumsResult.reason instanceof Error ? albumsResult.reason.message : 'Unknown',
        timestamp: new Date().toISOString()
      })
    }
    
    if (songsResult.status === 'fulfilled') {
      songs = songsResult.value || []
      console.log('✅ Songs search succeeded in searchAll:', {
        query,
        songCount: songs.length,
        timestamp: new Date().toISOString()
      })
    } else {
      songsError = songsResult.reason
      console.error('❌ Songs search failed in searchAll:', {
        query,
        error: songsResult.reason,
        errorMessage: songsResult.reason instanceof Error ? songsResult.reason.message : 'Unknown',
        timestamp: new Date().toISOString()
      })
    }
    
    // Combine and deduplicate results
    const allResults = [...albums, ...songs]
    console.log('📊 searchAll combined results:', {
      query,
      albumResults: albums.length,
      songResults: songs.length,
      totalCombined: allResults.length,
      timestamp: new Date().toISOString()
    })
    
    if (allResults.length === 0) {
      // Create a detailed error with information about both searches
      const detailedError = {
        query,
        albumsSearchStatus: albumsResult.status,
        songsSearchStatus: songsResult.status,
        albumsError: albumsError ? {
          message: albumsError instanceof Error ? albumsError.message : 'Unknown error',
          name: albumsError instanceof Error ? albumsError.name : 'Unknown',
          stack: albumsError instanceof Error ? albumsError.stack : 'No stack trace'
        } : null,
        songsError: songsError ? {
          message: songsError instanceof Error ? songsError.message : 'Unknown error',
          name: songsError instanceof Error ? songsError.name : 'Unknown',
          stack: songsError instanceof Error ? songsError.stack : 'No stack trace'
        } : null,
        timestamp: new Date().toISOString()
      }
      
      const error = new Error(`No results found for "${query}" from any iTunes API search (albums or songs). Albums: ${albumsResult.status}, Songs: ${songsResult.status}`)
      ;(error as any).searchDetails = detailedError
      
      console.error('⚠️ No results from iTunes API in searchAll:', detailedError)
      throw error
    }
    
    const uniqueResults = allResults.filter((album, index, self) => 
      index === self.findIndex(a => a.id === album.id)
    )
    
    const finalResults = uniqueResults.slice(0, 50) // Limit to 50 total results
    console.log('✅ searchAll completed successfully:', {
      query,
      inputAlbums: albums.length,
      inputSongs: songs.length,
      totalCombined: allResults.length,
      uniqueResults: uniqueResults.length,
      finalResults: finalResults.length,
      timestamp: new Date().toISOString()
    })
    
    return finalResults
  } catch (error) {
    console.error('❌ Unexpected error in searchAll:', {
      query,
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorStack: error instanceof Error ? error.stack : 'No stack trace',
      searchDetails: (error as any).searchDetails || null,
      timestamp: new Date().toISOString()
    })
    throw error
  }
}
