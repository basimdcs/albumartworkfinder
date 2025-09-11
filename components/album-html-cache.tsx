'use client'

import { useEffect } from 'react'

interface AlbumHtmlCacheProps {
  albumId: string
  albumTitle?: string
  artistName?: string
}

export default function AlbumHtmlCache({ albumId, albumTitle, artistName }: AlbumHtmlCacheProps) {
  useEffect(() => {
    // Apply client-side SEO enhancements for album pages
    const applySEOEnhancements = () => {
      if (albumTitle && artistName) {
        const pageTitle = `${albumTitle} by ${artistName} - Album Artwork Download | Album Artwork Finder`
        const description = `Download high-resolution album artwork for "${albumTitle}" by ${artistName}. Get HD album covers up to 5000x5000px from the iTunes catalog. Free album artwork download.`
        const canonicalUrl = window.location.href
        
        // Update meta description with album-specific keywords
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) {
          metaDesc.setAttribute('content', description)
        }

        // Update page title for SEO
        const title = document.querySelector('title')
        if (title) {
          title.textContent = pageTitle
        }

        // Add canonical URL for album page
        const existingCanonical = document.querySelector('link[rel="canonical"]')
        if (existingCanonical) {
          existingCanonical.remove()
        }
        
        const canonicalLink = document.createElement('link')
        canonicalLink.rel = 'canonical'
        canonicalLink.href = canonicalUrl
        document.head.appendChild(canonicalLink)

        // Add album-specific Open Graph tags
        const ensureMeta = (attr: 'name' | 'property', key: string, value: string) => {
          let node = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
          if (!node) {
            node = document.createElement('meta')
            node.setAttribute(attr, key)
            document.head.appendChild(node)
          }
          node.setAttribute('content', value)
        }

        ensureMeta('property', 'og:title', pageTitle)
        ensureMeta('property', 'og:description', description)
        ensureMeta('property', 'og:type', 'music.album')
        ensureMeta('property', 'og:url', canonicalUrl)

        // Best-effort OG image: use first album image on page
        const imgSrc = (document.querySelector('img[alt*="album artwork"]') as HTMLImageElement | null)?.src
          || (document.querySelector('img[alt*="album"]') as HTMLImageElement | null)?.src
          || ''
        if (imgSrc) {
          ensureMeta('property', 'og:image', imgSrc)
        }

        // Twitter card
        ensureMeta('name', 'twitter:card', 'summary_large_image')
        ensureMeta('name', 'twitter:title', pageTitle)
        ensureMeta('name', 'twitter:description', description)
        if (imgSrc) {
          ensureMeta('name', 'twitter:image', imgSrc)
        }

        // Robots: allow large image preview
        ensureMeta('name', 'robots', 'index, follow, max-image-preview:large')
        ensureMeta('name', 'googlebot', 'index, follow, max-image-preview:large')

        // Add album-specific structured data
        const albumStructuredData = {
          "@context": "https://schema.org",
          "@type": "MusicAlbum",
          "name": albumTitle,
          "byArtist": {
            "@type": "MusicGroup",
            "name": artistName
          },
          "image": imgSrc || '',
          "description": `High-resolution album artwork for ${albumTitle} by ${artistName}. Download HD album covers up to 5000x5000px.`,
          "url": canonicalUrl,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }

        // Add Music Album schema (avoid invalid :has-text selector)
        let hasAlbumSchema = false
        document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
          try {
            const data = JSON.parse(script.textContent || '{}')
            if (data['@type'] === 'MusicAlbum') hasAlbumSchema = true
          } catch {}
        })
        if (!hasAlbumSchema) {
          const albumScript = document.createElement('script')
          albumScript.type = 'application/ld+json'
          albumScript.textContent = JSON.stringify(albumStructuredData)
          document.head.appendChild(albumScript)
        }

        // Add breadcrumb structured data for album pages
        const breadcrumbData = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://albumartworkfinder.com"
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": "Album Artwork",
              "item": "https://albumartworkfinder.com/search"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": `${albumTitle} by ${artistName}`,
              "item": window.location.href
            }
          ]
        }

        // Add Breadcrumb schema (avoid invalid :has-text selector)
        let hasBreadcrumb = false
        document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
          try {
            const data = JSON.parse(script.textContent || '{}')
            if (data['@type'] === 'BreadcrumbList') hasBreadcrumb = true
          } catch {}
        })
        if (!hasBreadcrumb) {
          const breadcrumbScript = document.createElement('script')
          breadcrumbScript.type = 'application/ld+json'
          breadcrumbScript.textContent = JSON.stringify(breadcrumbData)
          document.head.appendChild(breadcrumbScript)
        }
      }
    }

    // Apply SEO enhancements immediately
    applySEOEnhancements()

    // Cache album page HTML after it's fully rendered
    const timer = setTimeout(async () => {
      try {
        // Get the full HTML including all dynamic content and SEO enhancements
        const html = document.documentElement.outerHTML
        
        // Only cache if HTML contains actual album content
        if (html.includes('album') && html.length > 8000 && albumTitle) {
          await fetch('/api/cache-album-html', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              html,
              albumId,
              albumTitle,
              artistName
            })
          })
        }
      } catch (error) {
        // Silent fail - caching is non-critical
        console.debug('Album HTML caching failed:', error)
      }
    }, 3000) // Wait 3 seconds for all content to render

    return () => clearTimeout(timer)
  }, [albumId, albumTitle, artistName])

  return null // This component doesn't render anything
}