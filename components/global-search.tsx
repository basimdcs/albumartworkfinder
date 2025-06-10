'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  
  // Don't show on homepage as it has its own search
  if (pathname === '/') {
    return null
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search albums, artists, songs..."
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
          aria-label="Search"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  )
} 