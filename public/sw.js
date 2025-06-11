// Service Worker for Album Artwork Finder
// Optimized for mobile performance and offline capabilities

const CACHE_NAME = 'album-artwork-finder-v1'
const STATIC_CACHE_NAME = 'static-assets-v1'
const SEARCH_CACHE_NAME = 'search-results-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/search',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/css/app.css',
  // Add other critical static assets here
]

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll(STATIC_ASSETS.filter(url => url))
      }),
      caches.open(SEARCH_CACHE_NAME) // Initialize search cache
    ]).then(() => {
      console.log('Service Worker installed successfully')
      return self.skipWaiting()
    }).catch(error => {
      console.error('Service Worker installation failed:', error)
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => 
            !cacheName.includes(CACHE_NAME) && 
            !cacheName.includes(STATIC_CACHE_NAME) &&
            !cacheName.includes(SEARCH_CACHE_NAME)
          )
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    }).then(() => {
      console.log('Service Worker activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Handle different types of requests
  if (url.origin === self.location.origin) {
    // Same-origin requests
    if (url.pathname.startsWith('/_next/static/')) {
      // Static assets - cache first
      event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
    } else if (url.pathname === '/search' || url.pathname.startsWith('/search?')) {
      // Search pages - network first with fallback
      event.respondWith(networkFirstWithFallback(request))
    } else {
      // Other pages - stale while revalidate
      event.respondWith(staleWhileRevalidate(request, CACHE_NAME))
    }
  } else if (url.hostname === 'itunes.apple.com') {
    // iTunes API requests - cache with short TTL
    event.respondWith(cacheAPIResponse(request))
  } else if (url.hostname.includes('mzstatic.com') || url.hostname.includes('apple.com')) {
    // Album artwork images - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME))
  }
})

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return new Response('Offline content not available', { status: 503 })
  }
}

// Network first with fallback strategy
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 3000)
      )
    ])
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.log('Network failed, trying cache:', error.message)
    
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for search requests
    if (request.url.includes('/search')) {
      return new Response(
        generateOfflineSearchHTML(),
        { 
          headers: { 'Content-Type': 'text/html' },
          status: 200
        }
      )
    }
    
    return new Response('Content not available offline', { status: 503 })
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(error => {
    console.log('Network request failed:', error)
    return cachedResponse || new Response('Content not available', { status: 503 })
  })
  
  return cachedResponse || await fetchPromise
}

// Cache API responses with TTL
async function cacheAPIResponse(request) {
  const cache = await caches.open(SEARCH_CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  // Check if cached response is still fresh (5 minutes)
  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('sw-cached-date') || 0)
    const now = new Date()
    const fiveMinutes = 5 * 60 * 1000
    
    if (now - cachedDate < fiveMinutes) {
      return cachedResponse
    }
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Clone response and add cache date header
      const responseClone = networkResponse.clone()
      const headers = new Headers(responseClone.headers)
      headers.set('sw-cached-date', new Date().toISOString())
      
      const cachedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      })
      
      cache.put(request, cachedResponse)
      return networkResponse
    }
    
    return cachedResponse || networkResponse
  } catch (error) {
    console.error('API request failed:', error)
    return cachedResponse || new Response(
      JSON.stringify({ resultCount: 0, results: [] }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  }
}

// Generate offline search HTML
function generateOfflineSearchHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Search - Album Artwork Finder</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 2rem;
          background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
          color: #374151;
          text-align: center;
        }
        .container {
          max-width: 32rem;
          margin: 0 auto;
        }
        .icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1.5rem;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        p {
          color: #6b7280;
          margin-bottom: 2rem;
        }
        .button {
          background: #3b82f6;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📱</div>
        <h1>You're Offline</h1>
        <p>Search functionality requires an internet connection. Please check your connection and try again.</p>
        <a href="/" class="button">Go Home</a>
      </div>
      <script>
        // Reload when back online
        window.addEventListener('online', () => {
          window.location.reload();
        });
      </script>
    </body>
    </html>
  `
}

// Background sync for failed searches (if supported)
self.addEventListener('sync', event => {
  if (event.tag === 'background-search') {
    console.log('Background sync triggered for search')
    // Implement background search sync if needed
  }
})

// Push notification handling (for future features)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: data.url
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    )
  }
}) 