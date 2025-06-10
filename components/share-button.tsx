'use client'

import React from 'react'

interface ShareButtonProps {
  title: string
  text: string
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium transition-colors hover:bg-gray-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h8" />
        <path d="M16 4h4a2 2 0 0 1 2 2v4" />
        <line x1="9" y1="9" x2="21" y2="21" />
      </svg>
      Share
    </button>
  )
} 