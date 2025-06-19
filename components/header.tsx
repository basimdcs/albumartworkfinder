import Link from "next/link"
import SearchBar from "./search-bar"

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Top Navigation Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            AlbumArtworkFinder<span className="text-secondary">.com</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
              Browse
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Search Bar Section - Separate and Prominent */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  )
}
