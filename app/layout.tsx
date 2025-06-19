import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import GlobalSearch from "@/components/global-search"
import GoogleAnalytics from "@/components/google-analytics"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://albumartworkfinder.com'),
  title: {
    default: 'AlbumArtworkFinder - Download High-Quality Album Covers & Music Artwork',
    template: '%s | AlbumArtworkFinder'
  },
  description: 'Discover and download high-resolution album artwork, covers, and music art from millions of artists. Free, fast, and mobile-optimized album cover finder with iTunes integration.',
  keywords: [
    'album artwork',
    'album covers',
    'music artwork',
    'album art download',
    'high resolution album covers',
    'iTunes album art',
    'music covers',
    'album cover finder',
    'free album artwork',
    'music art gallery'
  ],
  authors: [{ name: 'AlbumArtworkFinder Team' }],
  creator: 'AlbumArtworkFinder',
  publisher: 'AlbumArtworkFinder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://albumartworkfinder.com',
    siteName: 'AlbumArtworkFinder',
    title: 'AlbumArtworkFinder - Download High-Quality Album Covers & Music Artwork',
    description: 'Discover and download high-resolution album artwork from millions of artists. Free, fast, and mobile-optimized.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AlbumArtworkFinder - High-Quality Album Covers',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlbumArtworkFinder - Download High-Quality Album Covers',
    description: 'Discover and download high-resolution album artwork from millions of artists.',
    images: ['/og-image.jpg'],
    creator: '@albumartworkfinder',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://albumartworkfinder.com',
    languages: {
      'en-US': 'https://albumartworkfinder.com',
      'en-GB': 'https://albumartworkfinder.com/en-gb',
  },
  },
  category: 'music',
}

// Enhanced viewport configuration for mobile
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
}

// Enable static generation with 24-hour revalidation
export const revalidate = 86400 // 24 hours in seconds

// Structured Data for the website
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AlbumArtworkFinder",
  "alternateName": "Album Artwork Finder",
  "url": "https://albumartworkfinder.com",
  "description": "Discover and download high-resolution album artwork, covers, and music art from millions of artists.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://albumartworkfinder.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AlbumArtworkFinder",
    "url": "https://albumartworkfinder.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://albumartworkfinder.com/logo.png",
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://twitter.com/albumartworkfinder",
      "https://github.com/albumartworkfinder"
    ]
  },
  "mainEntity": {
    "@type": "WebApplication",
    "name": "AlbumArtworkFinder",
    "applicationCategory": "MusicApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "High-resolution album artwork download",
      "Search millions of albums",
      "Mobile-optimized interface",
      "iTunes integration",
      "Free to use"
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://itunes.apple.com" />
        <link rel="preconnect" href="https://is1-ssl.mzstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//itunes.apple.com" />
        <link rel="dns-prefetch" href="//is1-ssl.mzstatic.com" />
        <link rel="dns-prefetch" href="//api.allorigins.win" />
        <link rel="dns-prefetch" href="//corsproxy.io" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Additional SEO Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AlbumArtworkFinder" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
        <Header />
          <main className="flex-1">
            {children}
          </main>
        <Footer />
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  )
}

