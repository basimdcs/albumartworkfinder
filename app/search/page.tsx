import { Metadata } from 'next'
import { Suspense } from 'react'
import SearchResults from './search-results'

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {q ? `Search Results for "${q}"` : 'Search Album Artwork'}
        </h1>
        <p className="text-gray-600">
          {q ? `Finding album artwork for "${q}"` : 'Enter a search term to find album artwork'}
        </p>
      </div>
      
      <Suspense fallback={<div className="text-center py-8">Loading search results...</div>}>
        <SearchResults query={q} />
      </Suspense>
    </div>
  )
}
