import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface AlbumLayoutProps {
  params: Promise<{ id: string; slug?: string[] }>
  children: React.ReactNode
}

// Function to create SEO slug (duplicated from client component)
const createSEOSlug = (text: string): string => {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '-')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 70)
    .replace(/-+$/, '')
}

export async function generateMetadata({ params }: AlbumLayoutProps): Promise<Metadata> {
  const { id, slug } = await params
  
  // Basic validation
  if (!id || !/^\d+$/.test(id)) {
    return {
      title: 'Album Not Found | AlbumArtworkFinder',
      description: 'The requested album could not be found.',
      robots: { index: false, follow: false }
    }
  }

  // We can't call iTunes API on server side due to rate limits
  // So we'll generate basic metadata and let the client component handle the rest
  const canonicalUrl = `https://albumartworkfinder.com/album/${id}${slug ? `/${slug.join('/')}` : ''}`
  
  return {
    title: 'Album Artwork Download | AlbumArtworkFinder',
    description: 'Download high-resolution album artwork. Free HD album covers from iTunes catalog.',
    alternates: {
      canonical: canonicalUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      url: canonicalUrl,
      type: 'article',
      siteName: 'AlbumArtworkFinder',
    },
  }
}

export default function AlbumLayout({ children }: AlbumLayoutProps) {
  return <>{children}</>
}