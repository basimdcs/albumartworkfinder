import { NextRequest, NextResponse } from 'next/server'

// Initialize Redis client only if environment variables are available
let redis: any = null
try {
  if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) {
    const { Redis } = require('@upstash/redis')
    redis = new Redis({
      url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
    })
  }
} catch (error) {
  console.warn('Redis initialization failed - caching disabled:', error)
  redis = null
}

// Check if request is from a crawler
function isCrawler(userAgent: string): boolean {
  const crawlerPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /rogerbot/i,
    /linkedinbot/i,
    /embedly/i,
    /quora link preview/i,
    /showyoubot/i,
    /outbrain/i,
    /pinterest/i,
    /developers.google.com/i
  ]
  
  return crawlerPatterns.some(pattern => pattern.test(userAgent))
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const userAgent = request.headers.get('user-agent') || ''
  
  // Force WWW redirect (canonical domain enforcement) - only in production
  if (process.env.NODE_ENV === 'production' && url.hostname === 'albumartworkfinder.com') {
    url.hostname = 'www.albumartworkfinder.com'
    return NextResponse.redirect(url, 301)
  }
  
  // Handle homepage HTML caching for crawlers (only if Redis is available)
  if (url.pathname === '/' && isCrawler(userAgent) && redis) {
    try {
      const cacheKey = 'homepage-html'
      const cachedHtml = await redis.get(cacheKey)
      
      if (cachedHtml && typeof cachedHtml === 'string') {
        // Return cached HTML directly with proper headers
        return new Response(cachedHtml, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            'X-Cache': 'HIT-HOMEPAGE'
          }
        })
      }
    } catch (error) {
      // If cache fails, fall back to normal rendering
      console.error('Homepage HTML cache lookup failed:', error)
    }
  }
  
  // Handle album page HTML caching for crawlers (only if Redis is available)
  if (url.pathname.startsWith('/album/')) {
    const albumMatch = url.pathname.match(/^\/album\/(\d+)(?:\/|$)/)
    if (albumMatch && isCrawler(userAgent) && redis) {
      const albumId = albumMatch[1]
      
      try {
        const cacheKey = `album-html:${albumId}`
        const cachedHtml = await redis.get(cacheKey)
        
        if (cachedHtml && typeof cachedHtml === 'string') {
          // Return cached HTML directly with proper headers
          return new Response(cachedHtml, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
              'X-Cache': 'HIT'
            }
          })
        }
      } catch (error) {
        // If cache fails, fall back to normal rendering
        console.error('HTML cache lookup failed:', error)
      }
    }
    
    // Handle album page canonical redirects
    const pathParts = url.pathname.split('/').filter(Boolean)
    // pathParts: ['album', '{id}', ...slug]
    if (pathParts.length === 2) {
      // Allow /album/{id} without slug. If crawler and cached HTML exists, serve it above.
      // Otherwise, pass through so client can fetch and then cache.
      return NextResponse.next()
    }
    
    // Validate that album URLs with slugs are properly formatted
    if (pathParts.length > 2) {
      const slug = pathParts.slice(2).join('/')
      // Basic slug validation - if it contains invalid characters, let page handle redirect
      if (!/^[a-z0-9-]+$/i.test(slug.replace(/[^a-z0-9-]/gi, ''))) {
        return NextResponse.next()
      }
    }
  }
  
  // Handle search page robots directives
  if (url.pathname === '/search' && url.search) {
    // Add noindex headers for search result pages
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex')
    return response
  }
  
  // Handle trailing slashes consistently
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }
  
  // Force HTTPS redirect in production (but NOT in development)
  if (process.env.NODE_ENV === 'production' && 
      url.protocol === 'http:' && 
      !url.hostname.includes('localhost') && 
      !url.hostname.includes('127.0.0.1')) {
    url.protocol = 'https:'
    // Ensure we're redirecting to www version
    if (url.hostname === 'albumartworkfinder.com') {
      url.hostname = 'www.albumartworkfinder.com'
    }
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 