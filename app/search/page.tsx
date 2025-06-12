import { Metadata } from 'next'
import { Suspense } from 'react'
import SearchResults from './search-results'
import SearchForm from '@/components/search-form'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  
  if (!q) {
    return {
      title: 'Search Album Artwork | AlbumArtworkFinder',
      description: 'Search for album artwork, covers, and music from millions of artists. Find high-quality album art from the iTunes catalog.',
    }
  }

  return {
    title: `Search Results for "${q}" | AlbumArtworkFinder`,
    description: `Find album artwork for "${q}". Search results from millions of albums and artists in the iTunes catalog.`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {q ? `Search Results for "${q}"` : 'Search Album Artwork'}
            </h1>
            <p className="text-blue-100 mb-6">
              {q ? `Finding album artwork for "${q}"` : 'Enter a search term to find high-quality album covers'}
            </p>
            
            {/* Search Form */}
            <SearchForm />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search results...</p>
          </div>
        }>
          <SearchResults query={q} />
        </Suspense>
      </div>
    </div>
  )
}
