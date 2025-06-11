import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import GlobalSearch from "@/components/global-search"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Find High-Quality Album Artwork, Covers & More | AlbumArtworkFinder.com",
  description: "Search and discover album artwork from millions of artists. Find high-quality album covers for your favorite music from the iTunes catalog.",
  keywords: [
    "album artwork",
    "album covers",
    "music artwork",
    "iTunes album art",
    "high resolution album covers",
    "album art download",
    "music covers",
    "album artwork finder"
  ],
  authors: [{ name: "AlbumArtworkFinder" }],
  creator: "AlbumArtworkFinder",
  publisher: "AlbumArtworkFinder",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://albumartworkfinder.com",
    siteName: "AlbumArtworkFinder",
    title: "Find High-Quality Album Artwork, Covers & More",
    description: "Search and discover album artwork from millions of artists. Find high-quality album covers for your favorite music from the iTunes catalog.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find High-Quality Album Artwork, Covers & More",
    description: "Search and discover album artwork from millions of artists. Find high-quality album covers for your favorite music from the iTunes catalog.",
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Album Artwork Finder',
    startupImage: [
      '/apple-touch-startup-image-768x1004.png',
      '/apple-touch-startup-image-1536x2008.png',
    ],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Album Artwork Finder',
    'application-name': 'Album Artwork Finder',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3b82f6',
  },
}

// Enhanced viewport configuration for mobile
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1d4ed8' },
  ],
}

// Enable static generation with 24-hour revalidation
export const revalidate = 86400 // 24 hours in seconds

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://itunes.apple.com" />
        <link rel="dns-prefetch" href="https://itunes.apple.com" />
      </head>
      <body className={`${inter.className} safe-area-padding`}>
        <header className="border-b bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="text-xl font-bold text-primary shrink-0 md:text-2xl">
                AlbumArtworkFinder
              </Link>
              
              {/* Global Search - Only show on non-homepage */}
              <div className="flex-1 max-w-md mx-4">
                <GlobalSearch />
              </div>
              
              <nav className="hidden md:flex space-x-6 shrink-0">
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/search" className="text-gray-600 hover:text-primary transition-colors">
                  Search
                </Link>
              </nav>
              
              {/* Mobile menu button */}
              <button className="md:hidden p-2 text-gray-600 hover:text-primary min-h-[44px] min-w-[44px] touch-target" aria-label="Menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        <main className="min-h-screen">{children}</main>
        
        <footer className="border-t bg-gray-50 py-12 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-4">
              {/* Brand Section */}
              <div className="md:col-span-1">
                <Link href="/" className="text-xl font-bold text-primary mb-4 block">
                  AlbumArtworkFinder
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Find high-quality album artwork from millions of artists. Download album covers 
                  for your favorite music from the iTunes catalog.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="text-gray-600 hover:text-primary transition-colors">
                      Search Albums
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=2024" className="text-gray-600 hover:text-primary transition-colors">
                      Latest Releases
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=top hits" className="text-gray-600 hover:text-primary transition-colors">
                      Popular Albums
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Popular Artists */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Popular Artists</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/search?q=Taylor Swift" className="text-gray-600 hover:text-primary transition-colors">
                      Taylor Swift
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Drake" className="text-gray-600 hover:text-primary transition-colors">
                      Drake
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=The Beatles" className="text-gray-600 hover:text-primary transition-colors">
                      The Beatles
                    </Link>
                  </li>
                  <li>
                    <Link href="/search?q=Adele" className="text-gray-600 hover:text-primary transition-colors">
                      Adele
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal & Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Legal & Info</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/terms" className="text-gray-600 hover:text-primary transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-600">
                      High-res artwork up to 1000x1000px
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-600">
                      Free to use, no registration
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 mt-8 pt-8 text-center">
              <p className="text-gray-600 text-sm">
                &copy; 2024 AlbumArtworkFinder. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Album artwork sourced from iTunes. All rights belong to their respective owners.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

