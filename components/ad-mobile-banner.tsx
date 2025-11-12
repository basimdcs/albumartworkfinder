"use client"

import { useState, useEffect } from "react"
import { AD_SPOTS, AD_CONFIG } from "@/lib/ads-config"

interface AdMobileBannerProps {
  onAdClick: () => void
}

export default function AdMobileBanner({ onAdClick }: AdMobileBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AD_SPOTS.length)
    }, AD_CONFIG.rotationInterval)

    return () => clearInterval(interval)
  }, [])

  const currentAd = AD_SPOTS[currentIndex]

  return (
    <div className="lg:hidden sticky top-0 z-50 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
      <div className="px-4 py-3">
        <button
          onClick={onAdClick}
          className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all active:scale-98"
        >
          <div className="text-3xl flex-shrink-0">{currentAd.logo}</div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
              {currentAd.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {currentAd.tagline}
            </p>
          </div>
          <div className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0">
            {AD_CONFIG.availableSpots}/{AD_CONFIG.totalSpots}
          </div>
        </button>

        {/* Progress bar */}
        <div className="flex justify-center gap-1.5 mt-2">
          {AD_SPOTS.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-blue-600 w-4"
                  : "bg-gray-300 dark:bg-gray-600 w-1"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
