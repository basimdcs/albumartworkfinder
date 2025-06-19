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
