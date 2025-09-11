import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/private/',
          '*.json',
          '/search?*', // Disallow all search result pages with parameters
          '/search/*', // Disallow search subdirectories
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/private/',
          '/search?*', // Disallow search result pages for Googlebot
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/private/',
          '/search?*', // Disallow search result pages for Bingbot
        ],
      },
    ],
    sitemap: 'https://www.albumartworkfinder.com/sitemap.xml',
    host: 'https://www.albumartworkfinder.com',
  }
}