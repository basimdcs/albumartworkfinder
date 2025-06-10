import Link from "next/link"
import SearchBar from "./search-bar"

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="text-3xl font-bold tracking-tight text-primary">
            AlbumArtworkFinder<span className="text-secondary">.com</span>
          </Link>
          <div className="w-full md:w-1/2 lg:w-2/5">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  )
}
