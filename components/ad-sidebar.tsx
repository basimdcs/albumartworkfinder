"use client"

import { useState, useEffect } from "react"
import { AD_SPOTS, AD_CONFIG } from "@/lib/ads-config"

interface AdSidebarProps {
  onAdClick: () => void
}

export default function AdSidebar({ onAdClick }: AdSidebarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AD_SPOTS.length)
    }, AD_CONFIG.rotationInterval)

    return () => clearInterval(interval)
  }, [])

  const currentAd = AD_SPOTS[currentIndex]

  return (
    <aside className="hidden lg:block fixed right-4 top-24 w-48 space-y-4 z-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 shadow-lg">
        <button
          onClick={onAdClick}
          className="w-full text-center space-y-3 hover:opacity-80 transition-opacity"
        >
          <div className="text-5xl mb-2">{currentAd.logo}</div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {currentAd.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {currentAd.tagline}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {AD_CONFIG.availableSpots}/{AD_CONFIG.totalSpots} spots left
            </p>
          </div>
        </button>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-1.5">
        {AD_SPOTS.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "bg-blue-600 w-4"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </aside>
  )
}
