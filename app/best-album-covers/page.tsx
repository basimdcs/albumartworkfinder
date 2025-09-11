import { Metadata } from 'next'
import Link from 'next/link'
import OptimizedImage from '@/components/optimized-image'
import { createSEOSlug } from '@/lib/utils'

export const metadata: Metadata = {
  title: '100 Best Album Covers of All Time | AlbumArtworkFinder',
  description: 'Discover the 100 most iconic and best album covers in music history. A curated gallery of high-quality album artwork that defined genres and generations.',
  alternates: {
    canonical: 'https://albumartworkfinder.com/best-album-covers',
  },
}

// Data for the 100 best album covers - this would ideally come from a database or CMS
// For now, using a static list. This list is a sample.
const bestAlbumCovers = [
  { id: '1440851862', title: 'The Dark Side of the Moon', artist: 'Pink Floyd', year: '1973', imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4c/94/9b/4c949b3d-a853-4605-e557-413158957597/886446536227.jpg/1000x1000bb.jpg' },
  { id: '401142125', title: 'Nevermind', artist: 'Nirvana', year: '1991', imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music/v4/4a/29/33/4a29334c-d499-3c83-1188-825586228033/source/1000x1000bb.jpg' },
  { id: '557685669', title: 'Abbey Road', artist: 'The Beatles', year: '1969', imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/6c/a7/67/6ca76753-2b63-953d-2490-645391a971e7/094638246824.jpg/1000x1000bb.jpg' },
  { id: '1440794156', title: 'The Velvet Underground & Nico', artist: 'The Velvet Underground & Nico', year: '1967', imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/aa/64/f3/aa64f358-ce17-a0dd-3a78-fe6c71439265/886446381629.jpg/1000x1000bb.jpg' },
  // Add more iconic albums here...
];

export default function BestAlbumCoversPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The 100 Best Album Covers of All Time</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From groundbreaking designs to controversial statements, this is our curated gallery of the most iconic album artwork in music history.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {bestAlbumCovers.map((album) => (
            <Link
              key={album.id}
              href={`/album/${album.id}/${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-lg transition-all group-hover:shadow-2xl group-hover:scale-105">
                <OptimizedImage
                  src={album.imageUrl}
                  alt={`${album.title} by ${album.artist} - one of the best album covers of all time`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{album.title}</h3>
                <p className="text-xs text-gray-600 truncate">{album.artist} ({album.year})</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 