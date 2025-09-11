'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full">
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by artist, album, or song..."
        className="flex-1 rounded-l-lg border-0 px-4 py-3 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] touch-manipulation text-base"
        required
        autoComplete="off"
        inputMode="search"
        enterKeyHint="search"
        aria-label="Search for album artwork"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
      <button
        type="submit"
        className="rounded-r-lg bg-blue-600 px-4 py-3 text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 min-h-[48px] touch-manipulation flex items-center justify-center"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  )
}