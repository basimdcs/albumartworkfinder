import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Handle album page canonical redirects
  if (url.pathname.startsWith('/album/')) {
    const pathParts = url.pathname.split('/')
    if (pathParts.length === 3) {
      // If accessing /album/[id] without slug, let it pass through
      // The page component will handle the redirect to canonical URL
      return NextResponse.next()
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
  
  // Force HTTPS redirect in production
  if (process.env.NODE_ENV === 'production' && url.protocol === 'http:') {
    url.protocol = 'https:'
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