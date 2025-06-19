// Search tracking system for dynamic sitemap generation, using Upstash Redis for persistence
import { Redis } from '@upstash/redis'
import 'dotenv/config' // Load environment variables from .env file

const MAX_SEARCH_QUERIES = 1000
const MAX_ALBUM_PAGES = 2000
const BATCH_SAVE_INTERVAL = 30000 // Save every 30 seconds
const MIN_SAVE_INTERVAL = 5000    // Minimum 5 seconds between saves

// Initialize Upstash Redis client with proper error handling
function createRedisClient(): Redis | null {
  try {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
    
    if (!url || !token) {
      console.warn('Redis credentials not found. Tracking will be disabled.')
      return null
    }
    
    return new Redis({ url, token })
  } catch (error) {
    console.error('Failed to create Redis client:', error)
    return null
  }
}

const redis = createRedisClient()

// In-memory cache to reduce Redis reads and batch writes effectively
let searchQueriesCache: SearchLog | null = null
let albumPagesCache: AlbumLog | null = null
let lastSearchSave = 0
let lastAlbumSave = 0
let searchSaveTimeout: NodeJS.Timeout | null = null
let albumSaveTimeout: NodeJS.Timeout | null = null

export interface SearchQuery {
  query: string
  firstVisited: string
  lastVisited: string
  visitCount: number
  resultCount?: number
}

export interface SearchLog {
  queries: Record<string, SearchQuery>
  lastUpdated: string
}

export interface AlbumPage {
  albumId: string
  artist: string
  title: string
  slug: string
  firstSeen: string
  lastSeen: string
  searchAppearances: number
  directVisits: number
}

export interface AlbumLog {
  albums: Record<string, AlbumPage>
  lastUpdated: string
}

// Unified data loading functions with caching
async function loadData<T>(key: 'search-queries' | 'album-pages', cache: T | null): Promise<T> {
  if (cache) return cache

  const defaultLog = { queries: {}, albums: {}, lastUpdated: new Date().toISOString() }
  if (!redis) return defaultLog as T

  try {
    const data = await redis.get<T>(key)
    if (data) return data
  } catch (error) {
    console.error(`Failed to load ${key} from Upstash:`, error)
  }
  
  return defaultLog as T
}

export const loadSearchQueries = () => loadData<SearchLog>('search-queries', searchQueriesCache)
export const loadAlbumPages = () => loadData<AlbumLog>('album-pages', albumPagesCache)

// Unified data saving functions
async function saveData<T>(key: 'search-queries' | 'album-pages', data: T, force = false): Promise<void> {
  if (!redis) return
  const now = Date.now()
  const lastSave = key === 'search-queries' ? lastSearchSave : lastAlbumSave
  
  if (!force && now - lastSave < MIN_SAVE_INTERVAL) return

  try {
    await redis.set(key, data)
    if (key === 'search-queries') lastSearchSave = now
    else lastAlbumSave = now
  } catch (error) {
    console.error(`Failed to save ${key} to Upstash:`, error)
  }
}

const saveSearchQueries = (log: SearchLog, force?: boolean) => saveData('search-queries', log, force)
const saveAlbumPages = (log: AlbumLog, force?: boolean) => saveData('album-pages', log, force)

// Helper function to create SEO-friendly slugs
function createSEOSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Unified scheduling function
function scheduleSave<T>(log: T, timeout: NodeJS.Timeout | null, saveFn: (log: T, force: boolean) => void, cacheSetter: (log: T) => void): NodeJS.Timeout {
  cacheSetter(log) // Update cache immediately

  if (timeout) clearTimeout(timeout)
  
  return setTimeout(() => {
    // Await the async save function and catch any potential errors
    const runSave = async () => {
      try {
        await saveFn(log, true)
      } catch (error) {
        console.error('Scheduled save failed:', error)
      }
    }
    runSave()
  }, BATCH_SAVE_INTERVAL)
}

const scheduleBatchedSearchSave = (log: SearchLog) => {
  searchQueriesCache = log
  searchSaveTimeout = scheduleSave(log, searchSaveTimeout, saveSearchQueries, (l) => searchQueriesCache = l)
}
const scheduleBatchedAlbumSave = (log: AlbumLog) => {
  albumPagesCache = log
  albumSaveTimeout = scheduleSave(log, albumSaveTimeout, saveAlbumPages, (l) => albumPagesCache = l)
}

// --- EXPORTED TRACKING FUNCTIONS ---

export async function trackSearchQuery(query: string, resultCount?: number): Promise<void> {
  if (!query || query.trim().length < 2) return

  const normalizedQuery = query.trim().toLowerCase()
  if (['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(normalizedQuery)) {
    return
  }

  const searchLog = await loadSearchQueries()
  const now = new Date().toISOString()
  
  if (searchLog.queries[normalizedQuery]) {
    searchLog.queries[normalizedQuery].lastVisited = now
    searchLog.queries[normalizedQuery].visitCount += 1
    if (resultCount !== undefined) {
      searchLog.queries[normalizedQuery].resultCount = resultCount
    }
  } else {
    searchLog.queries[normalizedQuery] = {
      query: query.trim(), firstVisited: now, lastVisited: now, visitCount: 1, resultCount
    }
  }
  
  searchLog.lastUpdated = now
  
  if (Object.keys(searchLog.queries).length > MAX_SEARCH_QUERIES) {
    const sorted = Object.entries(searchLog.queries)
      .sort(([, a], [, b]) => b.visitCount - a.visitCount || new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime())
      .slice(0, MAX_SEARCH_QUERIES)
    searchLog.queries = Object.fromEntries(sorted)
  }
  
  scheduleBatchedSearchSave(searchLog)
}

export async function trackAlbumPage(albumId: string, artist: string, title: string, slug: string, isDirectVisit = false): Promise<void> {
  if (!albumId || !artist || !title) return

  const albumLog = await loadAlbumPages()
  const now = new Date().toISOString()
  const key = `${albumId}-${createSEOSlug(title)}`
  
  if (albumLog.albums[key]) {
    albumLog.albums[key].lastSeen = now
    if (isDirectVisit) albumLog.albums[key].directVisits += 1
    else albumLog.albums[key].searchAppearances += 1
  } else {
    albumLog.albums[key] = {
      albumId, artist, title, slug, firstSeen: now, lastSeen: now,
      searchAppearances: isDirectVisit ? 0 : 1,
      directVisits: isDirectVisit ? 1 : 0
    }
  }
  
  albumLog.lastUpdated = now
  
  if (Object.keys(albumLog.albums).length > MAX_ALBUM_PAGES) {
      const sorted = Object.entries(albumLog.albums)
        .sort(([, a], [, b]) => (b.searchAppearances + b.directVisits) - (a.searchAppearances + a.directVisits) || new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
        .slice(0, MAX_ALBUM_PAGES)
      albumLog.albums = Object.fromEntries(sorted)
  }
  
  scheduleBatchedAlbumSave(albumLog)
}

export async function trackAlbumPages(albums: Array<Omit<AlbumPage, 'firstSeen' | 'lastSeen' | 'searchAppearances' | 'directVisits'>>): Promise<void> {
  if (!redis || !albums || albums.length === 0) return

  const albumLog = await loadAlbumPages()
  const now = new Date().toISOString()
  
  for (const album of albums) {
    if (!album.albumId || !album.artist || !album.title) continue
    const key = `${album.albumId}-${createSEOSlug(album.title)}`
    if (albumLog.albums[key]) {
      albumLog.albums[key].lastSeen = now
      albumLog.albums[key].searchAppearances += 1
    } else {
      albumLog.albums[key] = {
        ...album, firstSeen: now, lastSeen: now, searchAppearances: 1, directVisits: 0
      }
    }
  }

  albumLog.lastUpdated = now
  
  if (Object.keys(albumLog.albums).length > MAX_ALBUM_PAGES) {
      const sorted = Object.entries(albumLog.albums)
        .sort(([, a], [, b]) => (b.searchAppearances + b.directVisits) - (a.searchAppearances + a.directVisits) || new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
        .slice(0, MAX_ALBUM_PAGES)
      albumLog.albums = Object.fromEntries(sorted)
  }

  scheduleBatchedAlbumSave(albumLog)
}

export async function getPopularSearchQueries(limit = 200): Promise<string[]> {
  const searchLog = await loadSearchQueries()
  return Object.values(searchLog.queries)
    .sort((a, b) => b.visitCount - a.visitCount || new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime())
    .slice(0, limit)
    .map(q => q.query)
}

export async function getPopularAlbumPages(limit = 500): Promise<AlbumPage[]> {
  const albumLog = await loadAlbumPages()
  return Object.values(albumLog.albums)
    .sort((a, b) => (b.searchAppearances + b.directVisits) - (a.searchAppearances + a.directVisits) || new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
    .slice(0, limit)
}

export async function flushPendingData(): Promise<void> {
  if (searchSaveTimeout) {
    clearTimeout(searchSaveTimeout)
    searchSaveTimeout = null
    if (searchQueriesCache) await saveSearchQueries(searchQueriesCache, true)
  }
  if (albumSaveTimeout) {
    clearTimeout(albumSaveTimeout)
    albumSaveTimeout = null
    if (albumPagesCache) await saveAlbumPages(albumPagesCache, true)
  }
}

// Get search statistics
export async function getSearchStatistics(): Promise<{
  totalQueries: number
  totalVisits: number
  topQueries: Array<{ query: string; visits: number }>
  totalAlbums: number
  totalAlbumViews: number
  topAlbums: Array<{ title: string; artist: string; views: number }>
}> {
  try {
    const [searchLog, albumLog] = await Promise.all([
      loadSearchQueries(),
      loadAlbumPages()
    ])
    
    const queries = Object.values(searchLog.queries)
    const albums = Object.values(albumLog.albums)
    
    const totalQueries = queries.length
    const totalVisits = queries.reduce((sum, q) => sum + q.visitCount, 0)
    const topQueries = queries
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 10)
      .map(q => ({ query: q.query, visits: q.visitCount }))
    
    const totalAlbums = albums.length
    const totalAlbumViews = albums.reduce((sum, a) => sum + a.searchAppearances + a.directVisits, 0)
    const topAlbums = albums
      .sort((a, b) => (b.searchAppearances + b.directVisits) - (a.searchAppearances + a.directVisits))
      .slice(0, 10)
      .map(a => ({ 
        title: a.title, 
        artist: a.artist, 
        views: a.searchAppearances + a.directVisits 
      }))
    
    return { 
      totalQueries, 
      totalVisits, 
      topQueries, 
      totalAlbums, 
      totalAlbumViews, 
      topAlbums 
    }
  } catch (error) {
    console.error('Failed to get search statistics:', error)
    return { 
      totalQueries: 0, 
      totalVisits: 0, 
      topQueries: [], 
      totalAlbums: 0, 
      totalAlbumViews: 0, 
      topAlbums: [] 
    }
  }
}

// Clean old search queries and album pages (older than 6 months)
export async function cleanOldData(): Promise<void> {
  try {
    const [searchLog, albumLog] = await Promise.all([
      loadSearchQueries(),
      loadAlbumPages()
    ])
    
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const filteredQueries: Record<string, SearchQuery> = {}
    for (const [key, query] of Object.entries(searchLog.queries)) {
      const lastVisited = new Date(query.lastVisited)
      if (lastVisited > sixMonthsAgo || query.visitCount >= 5) {
        filteredQueries[key] = query
      }
    }
    
    const filteredAlbums: Record<string, AlbumPage> = {}
    for (const [key, album] of Object.entries(albumLog.albums)) {
      const lastSeen = new Date(album.lastSeen)
      const totalActivity = album.searchAppearances + album.directVisits
      if (lastSeen > sixMonthsAgo || totalActivity >= 3) {
        filteredAlbums[key] = album
      }
    }
    
    searchLog.queries = filteredQueries
    searchLog.lastUpdated = new Date().toISOString()
    
    albumLog.albums = filteredAlbums
    albumLog.lastUpdated = new Date().toISOString()
    
    await Promise.all([
      saveSearchQueries(searchLog),
      saveAlbumPages(albumLog)
    ])
  } catch (error) {
    console.error('Failed to clean old data:', error)
  }
} 