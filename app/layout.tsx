import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import GoogleAnalytics from "@/components/google-analytics"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AdProvider from "@/components/ad-provider"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.albumartworkfinder.com'),
  title: {
    default: 'Album Artwork Finder | Download High-Resolution iTunes Album Covers & Art',
    template: '%s | Album Artwork Finder'
  },
  description: 'Discover and download high-resolution album artwork with our free Album Artwork Finder. Access iTunes album covers up to 5000×5000px instantly. Best free album artwork finder with iTunes integration for music lovers.',
  keywords: [
    // Primary competitive keywords - enhanced for "album artwork"
    'album artwork',
    'album artwork finder',
    'album artwork download',
    'high resolution album artwork',
    'iTunes album artwork',
    'free album artwork',
    'download album artwork',
    'album artwork database',
    'high quality album artwork',
    'album art downloader', 
    'iTunes artwork finder',
    'album cover download free',
    'music artwork download',
    'HD album art',
    'iTunes album art',
    'free album covers',
    'high resolution album covers',
    'album art exchange',
    'music cover art',
    'best album artwork finder',
    // Secondary keywords
    'album covers',
    'music artwork',
    'album art download',
    'music covers',
    'album cover finder',
    'music art gallery',
    'vinyl album covers',
    'CD artwork'
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
    url: 'https://www.albumartworkfinder.com',
    siteName: 'Album Artwork Finder',
    title: 'Album Artwork Finder | Download High-Resolution iTunes Album Covers',
    description: 'Discover and download high-resolution album artwork with our free Album Artwork Finder. Access iTunes album covers up to 5000×5000px instantly. Best iTunes album artwork finder.',
    images: [
      {
        url: '/album-artwork-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Album Artwork Finder - Download High-Resolution iTunes Album Covers',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Album Artwork Finder | Download High-Resolution iTunes Album Covers',
    description: 'Discover and download high-resolution album artwork with our free Album Artwork Finder. Access iTunes album covers up to 5000×5000px instantly.',
    images: ['/album-artwork-og-image.jpg'],
    creator: '@albumartworkfinder',
    site: '@albumartworkfinder',
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
    languages: {
      'en-US': 'https://www.albumartworkfinder.com',
      'en-GB': 'https://www.albumartworkfinder.com/en-gb',
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
  "url": "https://www.albumartworkfinder.com",
  "description": "Discover and download high-resolution album artwork, covers, and music art from millions of artists.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.albumartworkfinder.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AlbumArtworkFinder",
    "url": "https://www.albumartworkfinder.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.albumartworkfinder.com/logo.png",
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
        {/* Preconnect to critical domains for performance */}
        <link rel="preconnect" href="https://itunes.apple.com" />
        <link rel="preconnect" href="https://is1-ssl.mzstatic.com" />
        <link rel="preconnect" href="https://is2-ssl.mzstatic.com" />
        <link rel="preconnect" href="https://is3-ssl.mzstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for analytics (lower priority) */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* DNS prefetch for CORS proxies (backup only) */}
        <link rel="dns-prefetch" href="//api.allorigins.win" />
        <link rel="dns-prefetch" href="//corsproxy.io" />
        
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
        
        {/* Resource hints for critical resources */}
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
        <AdProvider />
      </body>
    </html>
  )
}
