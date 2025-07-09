'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by artist, album, or song..."
          className="flex-1 rounded-lg border-0 px-4 py-4 text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 min-h-[48px] touch-manipulation"
          required
          autoComplete="off"
          inputMode="search"
          enterKeyHint="search"
          aria-label="Search for album artwork"
        />
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-red-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300 active:scale-95 min-h-[48px] touch-target touch-feedback"
        >
          Search
        </button>
      </div>
    </form>
  )
} 