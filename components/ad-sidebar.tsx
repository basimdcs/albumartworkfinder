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
    <div className="hidden lg:block border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={onAdClick}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg group"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">{currentAd.logo}</div>
            <div className="text-left">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                {currentAd.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentAd.tagline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Indicator dots */}
            <div className="flex gap-1.5">
              {AD_SPOTS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-blue-600 scale-125"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
              {AD_CONFIG.availableSpots}/{AD_CONFIG.totalSpots} spots left
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
