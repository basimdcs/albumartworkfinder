import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to create SEO-friendly URL slugs
export const createSEOSlug = (text: string): string => {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    // Replace special characters and symbols with hyphens
    .replace(/[^\w\s-]/g, '-')
    // Replace multiple spaces or hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 70 characters for better SEO and to avoid overly long slugs
    .substring(0, 70)
    .replace(/-+$/, '') // Remove trailing hyphen if substring cuts mid-word
}

/**
 * Generate high-resolution iTunes artwork URLs
 * Takes a standard iTunes artwork URL and converts it to specified resolution
 */
export const getHighResArtworkUrl = (originalUrl: string, size: string = '1000x1000bb'): string => {
  if (!originalUrl) return ''
  
  // Pattern to match iTunes artwork URLs
  const itunesPattern = /^(https?:\/\/is\d+-ssl\.mzstatic\.com\/image\/thumb\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\/)(\d+x\d+bb\.jpg)$/
  
  const match = originalUrl.match(itunesPattern)
  if (match) {
    return `${match[1]}${size}.jpg`
  }
  
  // Fallback: try to replace common size patterns
  return originalUrl
    .replace(/\/\d+x\d+bb\.jpg$/, `/${size}.jpg`)
    .replace(/\/\d+x\d+bb\.png$/, `/${size}.jpg`)
}

/**
 * Get ultra high-resolution 5000x5000px artwork URL for premium downloads
 * This is the highest quality available from iTunes
 */
export const getUltraHighResArtworkUrl = (originalUrl: string): string => {
  return getHighResArtworkUrl(originalUrl, '5000x5000bb')
}

/**
 * Get available artwork resolutions for an iTunes image
 */
export const getArtworkResolutions = (originalUrl: string) => {
  if (!originalUrl) return []
  
  return [
    { 
      label: 'Small (300px)', 
      size: '300x300bb',
      url: getHighResArtworkUrl(originalUrl, '300x300bb'),
      recommended: 'Web thumbnails'
    },
    { 
      label: 'Medium (600px)', 
      size: '600x600bb',
      url: getHighResArtworkUrl(originalUrl, '600x600bb'),
      recommended: 'Social media'
    },
    { 
      label: 'High (1000px)', 
      size: '1000x1000bb',
      url: getHighResArtworkUrl(originalUrl, '1000x1000bb'),
      recommended: 'Digital collections'
    },
    { 
      label: 'Ultra HD (3000px)', 
      size: '3000x3000bb',
      url: getHighResArtworkUrl(originalUrl, '3000x3000bb'),
      recommended: 'Print quality'
    },
    { 
      label: 'Maximum (5000px)', 
      size: '5000x5000bb',
      url: getUltraHighResArtworkUrl(originalUrl),
      recommended: 'Professional use',
      premium: true
    }
  ]
}

/**
 * Estimate file size for different artwork resolutions (approximate)
 */
export const estimateFileSize = (resolution: string): string => {
  const sizeMap: { [key: string]: string } = {
    '300x300bb': '~50 KB',
    '600x600bb': '~200 KB',
    '1000x1000bb': '~500 KB',
    '3000x3000bb': '~2 MB',
    '5000x5000bb': '~5 MB'
  }
  return sizeMap[resolution] || 'Unknown'
}