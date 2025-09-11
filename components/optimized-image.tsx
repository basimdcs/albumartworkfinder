'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

// Transform iTunes URLs to get optimal size and format without Vercel processing
const getOptimizedItunesUrl = (url: string, size: number = 300): string => {
  if (!url || !url.includes('mzstatic.com')) return url
  
  // Replace resolution in iTunes URLs to get smaller images by default
  // Also prefer JPG format for better compression and faster loading
  let optimizedUrl = url.replace(/\/\d+x\d+/, `/${size}x${size}`)
  
  // Convert PNG to JPG for better compression (iTunes supports both)
  optimizedUrl = optimizedUrl.replace(/\.png$/i, '.jpg')
  
  return optimizedUrl
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  fill = false,
  sizes,
  priority = false,
  loading = 'lazy',
  fallbackSrc = '/placeholder.svg',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // Get optimized iTunes URL for smaller images by default
  const optimizedSrc = getOptimizedItunesUrl(imgSrc)

  const handleError = useCallback(() => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
    onError?.()
  }, [hasError, fallbackSrc, imgSrc, onError])

  const handleLoad = useCallback(() => {
    onLoad?.()
  }, [onLoad])

  // Determine loading behavior - priority takes precedence
  const shouldUsePriority = priority === true
  const loadingProp = shouldUsePriority ? undefined : loading

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={props.width}
      height={props.height}
      className={className}
      fill={fill}
      sizes={sizes}
      priority={shouldUsePriority}
      {...(loadingProp && { loading: loadingProp })}
      onError={handleError}
      onLoad={handleLoad}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      {...props}
    />
  )
}

// Higher resolution image component for detailed views
export function HighResImage({
  src,
  alt,
  className = '',
  fill = false,
  sizes,
  priority = false,
  loading = 'lazy',
  fallbackSrc = '/placeholder.svg',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // Get high-resolution iTunes URL for album pages with JPG optimization
  const highResSrc = src?.includes('mzstatic.com') 
    ? src.replace(/\/\d+x\d+/, '/1000x1000').replace(/\.png$/i, '.jpg')
    : src

  const handleError = useCallback(() => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
    onError?.()
  }, [hasError, fallbackSrc, imgSrc, onError])

  const handleLoad = useCallback(() => {
    onLoad?.()
  }, [onLoad])

  // Determine loading behavior - priority takes precedence
  const shouldUsePriority = priority === true
  const loadingProp = shouldUsePriority ? undefined : loading

  return (
    <Image
      src={hasError ? fallbackSrc : highResSrc}
      alt={alt}
      width={props.width}
      height={props.height}
      className={className}
      fill={fill}
      sizes={sizes}
      priority={shouldUsePriority}
      {...(loadingProp && { loading: loadingProp })}
      onError={handleError}
      onLoad={handleLoad}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      {...props}
    />
  )
}