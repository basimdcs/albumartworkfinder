"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="search"
        placeholder="Search by artist, album, or song..."
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search for album artwork"
      />
      <button type="submit" className="search-button" aria-label="Search">
        <Search className="h-5 w-5" />
      </button>
    </form>
  )
}
