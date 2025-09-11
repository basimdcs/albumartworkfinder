/**
 * Enhanced SEO slug generation for album artwork pages
 * Handles international characters, music-specific terms, and special characters
 */

// Common music-specific replacements for better SEO
const MUSIC_REPLACEMENTS: Record<string, string> = {
    '&': 'and',
    '+': 'plus',
    '♪': 'music',
    '♫': 'music',
    '♬': 'music',
    '♭': 'flat',
    '♯': 'sharp',
    '★': 'star',
    '☆': 'star',
    '💿': 'cd',
    '🎵': 'music',
    '🎶': 'music',
    '🎤': 'mic',
    '🎧': 'headphones',
    '🎸': 'guitar',
    '🎹': 'piano',
    '🥁': 'drums',
    '@': 'at',
    '#': 'number',
    '$': 'dollar',
    '%': 'percent',
    '©': 'copyright',
    '®': 'registered',
    '™': 'trademark',
  }
  
  // Common transliterations for music artists
  const TRANSLITERATIONS: Record<string, string> = {
    // Korean K-pop groups (common examples)
    '방탄소년단': 'bts',
    '블랙핑크': 'blackpink', 
    '트와이스': 'twice',
    '레드벨벳': 'red-velvet',
    '소녀시대': 'girls-generation',
    '빅뱅': 'bigbang',
    '엑소': 'exo',
    '샤이니': 'shinee',
    '슈퍼주니어': 'super-junior',
    
    // Japanese artists (common examples)
    'あいみょん': 'aimyon',
    'ヨルシカ': 'yorushika',
    'ずっと真夜中でいいのに': 'zutomayo',
    'king gnu': 'king-gnu',
    
    // Russian/Cyrillic (common examples)
    'тату': 'tatu',
    'время и стекло': 'vremya-i-steklo',
  }
  
  /**
   * Converts text to URL-friendly slug with enhanced character handling
   * @param text - Input text to convert
   * @param maxLength - Maximum length of resulting slug (default: 80)
   * @returns URL-friendly slug
   */
  export function createSEOSlug(text: string, maxLength: number = 80): string {
    if (!text || typeof text !== 'string') return ''
    
    let slug = text.trim()
    
    // Handle known transliterations first (case-insensitive)
    const lowerText = slug.toLowerCase()
    for (const [original, replacement] of Object.entries(TRANSLITERATIONS)) {
      if (lowerText.includes(original.toLowerCase())) {
        slug = slug.replace(new RegExp(original, 'gi'), replacement)
      }
    }
    
    // Convert to lowercase
    slug = slug.toLowerCase()
    
    // Apply music-specific replacements
    for (const [symbol, replacement] of Object.entries(MUSIC_REPLACEMENTS)) {
      slug = slug.replace(new RegExp(escapeRegExp(symbol), 'g'), replacement)
    }
    
    // Handle common contractions and possessives
    slug = slug
      .replace(/n't\b/g, 'nt')        // don't → dont, can't → cant
      .replace(/'s\b/g, 's')          // john's → johns
      .replace(/'\w/g, '')            // other apostrophes
      .replace(/"/g, '')              // Remove quotes entirely
    
    // Normalize Unicode characters (handles accented characters)
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    
    // Handle parentheses and brackets with better spacing
    slug = slug
      .replace(/\s*\([^)]*\)\s*/g, ' ') // Remove content in parentheses
      .replace(/\s*\[[^\]]*\]\s*/g, ' ') // Remove content in brackets
      .replace(/\s*\{[^}]*\}\s*/g, ' ')  // Remove content in curly braces
    
    // Remove remaining special characters (keep only alphanumeric, spaces, hyphens)
    slug = slug.replace(/[^\w\s-]/g, '')
    
    // Convert spaces to hyphens and clean up
    slug = slug
      .replace(/\s+/g, '-')           // Multiple spaces → single hyphen
      .replace(/-+/g, '-')            // Multiple hyphens → single hyphen
      .replace(/^-+|-+$/g, '')        // Remove leading/trailing hyphens
    
    // Trim to max length at word boundary
    if (slug.length > maxLength) {
      slug = slug.substring(0, maxLength)
      // Try to break at last hyphen to avoid cutting words
      const lastHyphen = slug.lastIndexOf('-')
      if (lastHyphen > maxLength * 0.7) { // Only if we don't lose too much
        slug = slug.substring(0, lastHyphen)
      }
    }
    
    // Final cleanup
    slug = slug.replace(/-+$/, '') // Remove any trailing hyphens
    
    return slug || 'unknown' // Fallback if slug becomes empty
  }
  
  /**
   * Escapes special regex characters in a string
   */
  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  
  /**
   * Creates a complete album URL slug in the format: artist-album-title
   * @param artist - Artist name
   * @param albumTitle - Album title
   * @param maxLength - Maximum total length (default: 80)
   * @returns Combined SEO slug
   */
  export function createAlbumSlug(
    artist: string, 
    albumTitle: string, 
    maxLength: number = 80
  ): string {
    const artistSlug = createSEOSlug(artist, 35)
    const albumSlug = createSEOSlug(albumTitle, 35)
    
    if (!artistSlug && !albumSlug) return 'unknown-album'
    if (!artistSlug) return albumSlug
    if (!albumSlug) return artistSlug
    
    const combined = `${artistSlug}-${albumSlug}`
    
    // If combined length exceeds limit, trim proportionally
    if (combined.length > maxLength) {
      const ratio = maxLength / combined.length
      const newArtistLength = Math.floor(artistSlug.length * ratio)
      const newAlbumLength = maxLength - newArtistLength - 1 // -1 for hyphen
      
      const trimmedArtist = createSEOSlug(artist, newArtistLength)
      const trimmedAlbum = createSEOSlug(albumTitle, newAlbumLength)
      
      return `${trimmedArtist}-${trimmedAlbum}`
    }
    
    return combined
  }
  
  /**
   * Validates if a slug is properly formatted
   * @param slug - Slug to validate
   * @returns Boolean indicating if slug is valid
   */
  export function isValidSlug(slug: string): boolean {
    if (!slug || typeof slug !== 'string') return false
    
    // Check basic format requirements
    const validFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    const notTooShort = slug.length >= 3
    const notTooLong = slug.length <= 100
    const noLeadingTrailingHyphens = !slug.startsWith('-') && !slug.endsWith('-')
    
    return validFormat && notTooShort && notTooLong && noLeadingTrailingHyphens
  }
  
  /**
   * Generates a canonical URL for an album page
   * @param albumId - Album ID
   * @param artist - Artist name  
   * @param albumTitle - Album title
   * @param baseUrl - Base URL (default: https://www.albumartworkfinder.com)
   * @returns Complete canonical URL
   */
  export function generateCanonicalAlbumUrl(
    albumId: string,
    artist: string,
    albumTitle: string,
    baseUrl: string = 'https://www.albumartworkfinder.com'
  ): string {
    const slug = createAlbumSlug(artist, albumTitle)
    return `${baseUrl}/album/${albumId}/${slug}`
  }