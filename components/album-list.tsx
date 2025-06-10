import AlbumCard from "./album-card"

interface Album {
  id: string
  title: string
  artist: string
  imageUrl: string
  year?: string
}

interface AlbumListProps {
  title: string
  albums: Album[]
}

export default function AlbumList({ title, albums }: AlbumListProps) {
  return (
    <section className="py-6">
      <h2 className="mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            id={album.id}
            title={album.title}
            artist={album.artist}
            imageUrl={album.imageUrl}
            year={album.year}
          />
        ))}
      </div>
    </section>
  )
}
