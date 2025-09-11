'use client'

import { useEffect } from 'react'

export default function HomepageHtmlCache() {
  useEffect(() => {
    // Apply client-side SEO enhancements before caching
    const applySEOEnhancements = () => {
      // Update meta description with target keywords
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Find and download high-resolution album artwork from millions of artists. Free album artwork finder with iTunes integration. Get HD album covers up to 5000x5000px instantly from the iTunes catalog.')
      }

      // Add canonical URL
      const existingCanonical = document.querySelector('link[rel="canonical"]')
      if (existingCanonical) {
        existingCanonical.remove()
      }
      const canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = 'https://albumartworkfinder.com/'
      document.head.appendChild(canonical)

      // Update Open Graph image
      const ogImage = document.querySelector('meta[property="og:image"]')
      if (ogImage) {
        ogImage.setAttribute('content', 'https://albumartworkfinder.com/album-artwork-og-image.jpg')
      } else {
        const newOgImage = document.createElement('meta')
        newOgImage.setAttribute('property', 'og:image')
        newOgImage.setAttribute('content', 'https://albumartworkfinder.com/album-artwork-og-image.jpg')
        document.head.appendChild(newOgImage)
      }

      // Add FAQ structured data (fix the selector issue)
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
      let hasFAQ = false
      
      // Check if FAQ schema already exists
      existingScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '')
          if (data['@type'] === 'FAQPage') {
            hasFAQ = true
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      })

      // Add FAQ schema if it doesn't exist
      if (!hasFAQ) {
        const faqSchema = document.createElement('script')
        faqSchema.type = 'application/ld+json'
        faqSchema.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I download high-resolution album artwork?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Search for your album using our album artwork finder, click on the album cover, and download artwork up to 5000x5000px resolution directly from iTunes catalog."
              }
            },
            {
              "@type": "Question", 
              "name": "Is the album artwork download free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our album artwork finder is completely free. Download high-resolution album covers without any registration or payment required."
              }
            },
            {
              "@type": "Question",
              "name": "What resolution album artwork can I download?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our album artwork finder provides artwork in multiple resolutions up to 5000x5000px, sourced directly from the iTunes catalog for the highest quality."
              }
            }
          ]
        })
        document.head.appendChild(faqSchema)
      }

      // Add HowTo structured data
      const howToSchema = document.createElement('script')
      howToSchema.type = 'application/ld+json'
      howToSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Find and Download Album Artwork",
        "description": "Step-by-step guide to finding and downloading high-resolution album artwork using our album artwork finder",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Search for Album",
            "text": "Enter the artist name or album title in our album artwork finder search box",
            "url": "https://albumartworkfinder.com/#search"
          },
          {
            "@type": "HowToStep", 
            "name": "Select Album",
            "text": "Browse the search results and click on your desired album artwork",
            "url": "https://albumartworkfinder.com/#results"
          },
          {
            "@type": "HowToStep",
            "name": "Download Artwork",
            "text": "Choose your preferred resolution and download the album artwork instantly",
            "url": "https://albumartworkfinder.com/#download"
          }
        ]
      })
      document.head.appendChild(howToSchema)

      // Update page title for better SEO
      if (document.title.indexOf('Album Artwork') === -1) {
        document.title = 'Album Artwork Finder - Download High-Resolution Album Covers & iTunes Art'
      }
    }

    // Apply enhancements after a short delay to ensure DOM is ready
    const timer = setTimeout(applySEOEnhancements, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return null
}