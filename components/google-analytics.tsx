'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// Google Analytics ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-K9SYT9LZNM'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

function GoogleAnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      console.log('Google Analytics not configured')
      return
    }

    if (typeof window.gtag === 'undefined') {
      console.log('Google Analytics not loaded yet')
      return
    }

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    
    // Track page views
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    })

    console.log('GA page view tracked:', url)

    // Track search queries for SEO insights
    const query = searchParams.get('q')
    if (query && pathname === '/search') {
      window.gtag('event', 'search', {
        search_term: query,
        page_path: url,
        custom_parameter_1: 'album_search'
      })
      console.log('GA search tracked:', query)
    }

    // Track popular artist searches
    const popularArtists = [
      'Taylor Swift', 'Drake', 'The Beatles', 'Adele', 'Billie Eilish',
      'Ed Sheeran', 'Ariana Grande', 'Post Malone', 'Kanye West', 'Beyonce'
    ]
    
    if (query && popularArtists.some(artist => 
      query.toLowerCase().includes(artist.toLowerCase())
    )) {
      window.gtag('event', 'popular_artist_search', {
        search_term: query,
        artist_category: 'popular',
        page_path: url
      })
    }

    // Track genre searches
    const genres = ['pop', 'hip-hop', 'rock', 'alternative', 'country', 'electronic']
    if (query && genres.some(genre => 
      query.toLowerCase().includes(genre.toLowerCase())
    )) {
      window.gtag('event', 'genre_search', {
        search_term: query,
        search_category: 'genre',
        page_path: url
      })
    }

    // Track album page visits
    if (pathname.startsWith('/album/')) {
      window.gtag('event', 'album_page_view', {
        page_path: url,
        content_type: 'album_artwork'
      })
    }

  }, [pathname, searchParams])

  return null
}

export default function GoogleAnalytics() {
  // Don't render anything if GA is not configured
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null
  }

  return (
    <>
      {/* Google Analytics Scripts */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics script loaded')
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
            console.log('Google Analytics initialized with ID: ${GA_MEASUREMENT_ID}');
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsInner />
      </Suspense>
    </>
  )
}

// Helper functions for manual event tracking
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
    console.log('GA event tracked:', eventName, parameters)
  }
}

export const trackSearch = (query: string, resultCount: number = 0) => {
  trackEvent('search', {
    search_term: query,
    result_count: resultCount,
    search_type: 'album_artwork'
  })
}

export const trackAlbumView = (albumId: string, albumTitle: string, artist: string) => {
  trackEvent('album_view', {
    album_id: albumId,
    album_title: albumTitle,
    artist_name: artist,
    content_type: 'album_artwork'
  })
}

export const trackDownload = (albumId: string, albumTitle: string, imageUrl: string) => {
  trackEvent('download', {
    album_id: albumId,
    album_title: albumTitle,
    image_url: imageUrl,
    download_type: 'album_artwork'
  })
} 