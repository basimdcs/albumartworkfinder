import { getTopAlbums, getTopSingles, createSEOSlug, type Album } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"
import SearchForm from "@/components/search-form"

// Pre-defined popular content for instant loading
const POPULAR_ARTISTS = [
  { id: 'taylor-swift', name: 'Taylor Swift' },
  { id: 'drake', name: 'Drake' },
  { id: 'the-beatles', name: 'The Beatles' },
  { id: 'adele', name:'Adele' },
  { id: 'ed-sheeran', name: 'Ed Sheeran' },
  { id: 'billie-eilish', name: 'Billie Eilish' },
  { id: 'post-malone', name: 'Post Malone' },
  { id: 'ariana-grande', name: 'Ariana Grande' },
]

// Enable static generation with 24-hour revalidation
export const revalidate = 86400 // 24 hours

export default async function Home() {
  // Fetch data at build time with fallback handling
  const [topAlbumsResult, topSinglesResult] = await Promise.allSettled([
    getTopAlbums(),
    getTopSingles(),
  ])
  
  // Show all 25 albums and singles
  const topAlbums = topAlbumsResult.status === 'fulfilled' ? topAlbumsResult.value : []
  const topSingles = topSinglesResult.status === 'fulfilled' ? topSinglesResult.value : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Compact Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-8 md:py-12">
          <div className="mx-auto max-w-4xl text-center text-white">
            <h1 className="mb-3 text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Find High-Quality
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Album Artwork
              </span>
            </h1>
            <p className="mb-6 text-base opacity-90 md:text-lg">
              Search millions of album covers from the iTunes catalog. Download high-resolution artwork for free.
            </p>
            
            {/* Search Form Component */}
            <SearchForm />
            
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm opacity-75">
              <span>Popular:</span>
              {['Taylor Swift', 'Drake', 'The Beatles', 'Adele'].map((artist) => (
                <Link
                  key={artist}
                  href={`/search?q=${encodeURIComponent(artist)}`}
                  className="rounded-full bg-white/20 px-3 py-1 transition-colors hover:bg-white/30"
                >
                  {artist}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {/* Content - Compact Design */}
        <div className="space-y-8">
          {/* Top Albums - Show all 25 */}
          {topAlbums.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Top 25 Albums</h2>
                <Link 
                  href="/search?q=2024 albums" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Search More →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                {topAlbums.map((album) => (
                  <Link 
                    key={album.id} 
                    href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all group-hover:shadow-lg group-hover:scale-105">
                      <Image
                        src={album.imageUrl || "/placeholder.svg"}
                        alt={`${album.title} by ${album.artist}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 12.5vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-2 space-y-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{album.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{album.artist}</p>
                      {album.year && <p className="text-xs text-gray-500">{album.year}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Top Singles - Show all 25 */}
          {topSingles.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Top 25 Songs</h2>
                <Link 
                  href="/search?q=2024 hits" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Search More →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                {topSingles.map((album) => (
                  <Link 
                    key={album.id} 
                    href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all group-hover:shadow-lg group-hover:scale-105">
                      <Image
                        src={album.imageUrl || "/placeholder.svg"}
                        alt={`${album.title} by ${album.artist}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 12.5vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-2 space-y-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{album.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{album.artist}</p>
                      {album.year && <p className="text-xs text-gray-500">{album.year}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Popular Artists - Compact Circles */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Popular Artists</h2>
              <Link 
                href="/search" 
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Explore →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {POPULAR_ARTISTS.map((artist) => (
                <Link 
                  key={artist.id} 
                  href={`/search?q=${encodeURIComponent(artist.name)}`} 
                  className="group text-center"
                >
                  <div className="mx-auto mb-2 h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg transition-transform group-hover:scale-110 sm:h-16 sm:w-16">
                    <div className="flex h-full w-full items-center justify-center text-white font-bold text-sm">
                      {artist.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-900 truncate">{artist.name}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Compact Features Section */}
        <section className="mt-12 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-xl font-bold text-gray-900">Why Choose AlbumArtworkFinder?</h2>
              <div className="space-y-2">
                {[
                  'High-resolution album covers (up to 1000x1000px)',
                  'Millions of albums from all genres',
                  'Fast and accurate search results',
                  'Completely free to use',
                  'No registration required'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Quick Search</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Taylor Swift', 'Drake', 'The Beatles', 'Adele', 'Ed Sheeran',
                  'Billie Eilish', 'Post Malone', 'Ariana Grande'
                ].map((artist) => (
                  <Link
                    key={artist}
                    href={`/search?q=${encodeURIComponent(artist)}`}
                    className="rounded-full bg-white px-3 py-1 text-sm text-gray-700 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    {artist}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
