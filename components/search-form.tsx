'use client'

import { useState } from 'react'

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by artist, album, or song..."
          className="flex-1 rounded-lg border-0 px-4 py-3 text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-red-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Search
        </button>
      </div>
    </form>
  )
} 