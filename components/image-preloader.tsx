'use client'

import { useEffect } from 'react'

interface ImagePreloaderProps {
  images: string[]
  maxConcurrent?: number
}

// Preload critical images without using Vercel optimization
export default function ImagePreloader({ 
  images, 
  maxConcurrent = 3 
}: ImagePreloaderProps) {
  useEffect(() => {
    if (!images.length) return

    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new window.Image()
        img.onload = () => resolve()
        img.onerror = () => resolve() // Continue even if image fails
        
        // Use smaller resolution for preloading to save bandwidth
        const optimizedSrc = src.includes('mzstatic.com') 
          ? src.replace(/\/\d+x\d+/, '/300x300')
          : src
        
        img.src = optimizedSrc
      })
    }

    const loadBatch = async (batch: string[]) => {
      await Promise.allSettled(batch.map(loadImage))
    }

    // Load images in batches to avoid overwhelming the browser
    const batches: string[][] = []
    for (let i = 0; i < images.length; i += maxConcurrent) {
      batches.push(images.slice(i, i + maxConcurrent))
    }

    // Load batches sequentially
    const loadSequentially = async () => {
      for (const batch of batches) {
        await loadBatch(batch)
        // Small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    loadSequentially()
  }, [images, maxConcurrent])

  return null // This component doesn't render anything
}