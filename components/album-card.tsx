import Image from "next/image"
import Link from "next/link"

interface AlbumCardProps {
  id: string
  title: string
  artist: string
  imageUrl: string
  year?: string
}

export default function AlbumCard({ id, title, artist, imageUrl, year }: AlbumCardProps) {
  // Create SEO-friendly slug
  const slug = `${artist.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
  
  return (
    <Link href={`/album/${id}/${slug}`} className="album-card block">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`${title} by ${artist}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium">{title}</h3>
        <p className="truncate text-xs text-gray-600">{artist}</p>
        {year && <p className="mt-1 text-xs text-gray-500">{year}</p>}
      </div>
    </Link>
  )
}
