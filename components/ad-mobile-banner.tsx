"use client"

import { useState, useEffect } from "react"
import { AD_SPOTS, AD_CONFIG } from "@/lib/ads-config"
import { X } from "lucide-react"

interface AdMobileBannerProps {
  onAdClick: () => void
}

export default function AdMobileBanner({ onAdClick }: AdMobileBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AD_SPOTS.length)
    }, AD_CONFIG.rotationInterval)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY < 10)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  if (!isVisible) return null

  const currentAd = AD_SPOTS[currentIndex]

  return (
    <div
      className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isScrollingUp ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <button
          onClick={onAdClick}
          className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-black/10 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-2xl flex-shrink-0">{currentAd.logo}</div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{currentAd.name}</p>
              <p className="text-xs opacity-90 truncate">{currentAd.tagline}</p>
            </div>
            <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
              {AD_CONFIG.availableSpots}/{AD_CONFIG.totalSpots} spots
            </div>
          </div>
        </button>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsVisible(false)
          }}
          className="absolute top-1 right-1 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close advertisement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/30">
        <div
          className="h-full bg-white transition-all"
          style={{
            width: `${((currentIndex + 1) / AD_SPOTS.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
