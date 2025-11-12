'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import SearchBar from "./search-bar"

export default function Header() {
  const pathname = usePathname()
  const [isHomePage, setIsHomePage] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Use useEffect to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    setIsHomePage(pathname === '/')
  }, [pathname])

  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Top Navigation Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Improved Logo Design */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg md:text-xl font-bold tracking-tight text-gray-900">
                AlbumArtwork<span className="text-blue-600">Finder</span>
              </div>
              <div className="text-xs text-gray-500 -mt-1">.com</div>
            </div>
            <div className="sm:hidden">
              <div className="text-lg font-bold tracking-tight text-gray-900">
                <span className="text-blue-600">AAF</span>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Browse
            </Link>
            <Link href="/top-100-album-covers" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Top Albums
            </Link>
            <Link href="/top-100-single-covers" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Top Singles
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Blog
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Search Bar Section - Show on all pages except homepage */}
      {mounted && !isHomePage && (
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}