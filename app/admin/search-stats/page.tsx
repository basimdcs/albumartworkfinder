import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - AlbumArtworkFinder',
  description: 'Administrative functions are currently disabled.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Administrative functions</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Admin Panel Disabled
          </h2>
          
          <p className="text-blue-700 mb-4">
            Administrative functions are currently disabled. The system focuses purely on SEO optimization through sitemap generation.
          </p>
          
          <div className="text-sm text-blue-600 space-y-2">
            <p><strong>Current Active Features:</strong></p>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>Search query tracking for sitemap</li>
              <li>Album page tracking for sitemap</li>
              <li>Dynamic sitemap.xml generation</li>
              <li>SEO optimization via Redis data storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 