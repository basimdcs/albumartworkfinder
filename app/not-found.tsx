import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | AlbumArtworkFinder',
  description: 'The page you are looking for could not be found. Browse our album artwork collection or search for music.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The album artwork page you're looking for doesn't exist or may have been moved.
          </p>
        </div>
        
        <div className="space-y-4">
      <Link
        href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Featured Albums
          </Link>
          
          <div className="text-sm text-gray-500">
            or
          </div>
          
          <Link
            href="/search"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
            Search for Music
      </Link>
        </div>
        
        <div className="mt-8 text-xs text-gray-500">
          <p>
            Looking for a specific album? Try searching for the artist or album name.
          </p>
        </div>
      </div>
    </div>
  )
}