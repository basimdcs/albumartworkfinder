import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAlbumById, getRelatedAlbums } from "@/lib/api"
import DownloadButton from "@/components/download-button"
import ShareButton from "@/components/share-button"
import MusicPreview from "@/components/music-preview"
import AlbumTracker from "@/components/album-tracker"

// Inline SEO slug function to avoid webpack issues
const createSEOSlug = (text: string): string => {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    // Replace special characters and symbols with hyphens
    .replace(/[^\w\s-]/g, '-')
    // Replace multiple spaces or hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 70 characters for better SEO
    .substring(0, 70)
    .replace(/-+$/, '') // Remove trailing hyphen if substring cuts mid-word
}

interface AlbumPageProps {
  params: Promise<{ id: string; slug?: string[] }>
}



export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { id } = await params
  const album = await getAlbumById(id)

  if (!album) {
    return {
      title: "Album Not Found | AlbumArtworkFinder.com",
      description: "The requested album artwork could not be found."
    }
  }

  // Create SEO-friendly slug using the new function
  const slug = `${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`

  return {
    title: `${album.title} by ${album.artist} - Album Artwork | AlbumArtworkFinder.com`,
    description: `Download high-quality album artwork for ${album.title} by ${album.artist}. View album cover art, track listing, and find related albums.`,
    keywords: [
      `${album.title} album artwork`,
      `${album.artist} album covers`,
      `${album.title} ${album.artist}`,
      'album art download',
      'high quality album covers',
      album.genre || 'music artwork'
    ],
    openGraph: {
      title: `${album.title} by ${album.artist} - Album Artwork`,
      description: `Download high-quality album artwork for ${album.title} by ${album.artist}`,
      images: [
        {
          url: album.imageUrl,
          width: 1000,
          height: 1000,
          alt: `${album.title} by ${album.artist} album artwork`,
        },
      ],
      type: 'music.album',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${album.title} by ${album.artist} - Album Artwork`,
      description: `Download high-quality album artwork for ${album.title} by ${album.artist}`,
      images: [album.imageUrl],
    },
    alternates: {
      canonical: `https://albumartworkfinder.com/album/${id}/${slug}`,
    },
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params
  const album = await getAlbumById(id)

  if (!album) {
    notFound()
  }

  // Track direct album page visit for sitemap inclusion
  const slug = `${createSEOSlug(album.artist)}-${createSEOSlug(album.title)}`

  const relatedAlbums = await getRelatedAlbums(id)

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    "name": album.title,
    "albumProductionType": "StudioAlbum",
    "byArtist": {
      "@type": "MusicGroup",
      "name": album.artist
    },
    "image": album.imageUrl,
    "datePublished": album.releaseDate,
    "genre": album.genre,
    "numTracks": album.trackCount,
    ...(album.tracks && {
      "track": album.tracks.map((track, index) => ({
        "@type": "MusicRecording",
        "name": track.title,
        "position": index + 1,
        "duration": track.duration
      }))
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Track album page visit */}
      <AlbumTracker 
        albumId={album.collectionId || album.id}
        artist={album.artist}
        title={album.title}
        slug={slug}
        isDirectVisit={true}
        relatedAlbums={relatedAlbums}
      />
      
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Breadcrumb for SEO */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 overflow-x-auto">
            <li className="shrink-0">
              <Link href="/" className="text-primary hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-500 shrink-0">/</li>
            <li className="shrink-0">
              <Link href={`/search?q=${encodeURIComponent(album.artist)}`} className="text-primary hover:underline">
                {album.artist}
              </Link>
            </li>
            <li className="text-gray-500 shrink-0">/</li>
            <li className="text-gray-700 font-medium truncate">{album.title}</li>
          </ol>
        </nav>

        <div className="mb-8">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            {/* Album Artwork */}
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg bg-gray-100">
              <Image
                src={album.imageUrl || "/placeholder.svg"}
                alt={`${album.title} by ${album.artist} album artwork`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Album Info */}
            <div className="space-y-6">
            <div>
                <h1 className="mb-2 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">{album.title}</h1>
              <Link
                href={`/search?q=${encodeURIComponent(album.artist)}`}
                  className="block text-lg text-primary hover:underline md:text-xl"
              >
                {album.artist}
              </Link>
              </div>

              {/* Album Details */}
              <div className="flex flex-wrap gap-2">
                {album.year && (
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <strong>Year:</strong> {album.year}
                  </div>
                )}
                {album.genre && (
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <strong>Genre:</strong> {album.genre}
                  </div>
                )}
                {album.trackCount && (
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <strong>Tracks:</strong> {album.trackCount}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <DownloadButton 
                  imageUrl={album.imageUrl}
                  albumTitle={album.title}
                  artistName={album.artist}
                />
                <ShareButton 
                  title={`${album.title} by ${album.artist} - Album Artwork`}
                  text={`Check out this album artwork for ${album.title} by ${album.artist}`}
                />
              </div>

              {/* Album Description for SEO */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h2 className="mb-2 text-lg font-semibold">About This Album</h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {album.title} is {album.year ? `a ${album.year} ` : 'an '}album by {album.artist}
                  {album.genre ? ` in the ${album.genre} genre` : ''}. 
                  {album.trackCount ? ` This album contains ${album.trackCount} tracks` : ''}
                  {album.releaseDate ? ` and was released on ${new Date(album.releaseDate).toLocaleDateString()}` : ''}.
                  Download high-quality album artwork (up to 1000x1000px) and discover more music from {album.artist}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Music Preview */}
        {album.tracks && album.tracks.length > 0 && (
          <div className="mb-8">
            <MusicPreview 
              tracks={album.tracks} 
              albumTitle={album.title}
              artist={album.artist}
            />
          </div>
        )}

        {/* Related Albums */}
        {relatedAlbums.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">More from {album.artist}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {relatedAlbums.slice(0, 12).map((relatedAlbum) => (
                <Link
                  key={relatedAlbum.id}
                  href={`/album/${relatedAlbum.id}/${createSEOSlug(relatedAlbum.artist)}-${createSEOSlug(relatedAlbum.title)}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all group-hover:shadow-lg group-hover:scale-105">
                    <Image
                      src={relatedAlbum.imageUrl || "/placeholder.svg"}
                      alt={`${relatedAlbum.title} by ${relatedAlbum.artist}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.66vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{relatedAlbum.title}</h3>
                    <p className="text-xs text-gray-600 truncate">{relatedAlbum.artist}</p>
                    {relatedAlbum.year && <p className="text-xs text-gray-500">{relatedAlbum.year}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO Content */}
        <section className="rounded-lg bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Download {album.title} Album Artwork
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-medium">High-Quality Album Art</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Get the official album artwork for {album.title} by {album.artist} in high resolution 
                (up to 1000x1000 pixels). Perfect for music libraries, playlists, and personal collections. 
                Our album artwork is sourced directly from the iTunes catalog for the best quality.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-medium">About {album.artist}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Explore more albums and artwork from {album.artist}. Find their complete discography, 
                latest releases, and classic albums. All album artwork is available for free download 
                in high resolution.
              </p>
              <Link
                href={`/search?q=${encodeURIComponent(album.artist)}`}
                className="mt-2 inline-block text-primary hover:underline text-sm font-medium"
              >
                View all {album.artist} albums →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}