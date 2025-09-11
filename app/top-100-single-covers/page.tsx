import { Metadata } from 'next';
import { Suspense } from 'react';
import { Calendar, TrendingUp, Music, Download, Headphones } from 'lucide-react';
import TopSinglesGrid from './top-singles-grid';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Top 100 Single Album Covers - Current iTunes Hit Songs | AlbumArtworkFinder',
  description: 'Discover the top 100 single album covers from iTunes current hit songs. High-quality single artwork from today\'s most popular tracks. Updated weekly.',
  keywords: [
    'top 100 single covers',
    'iTunes top songs',
    'current single covers',
    'popular single artwork',
    'trending single covers',
    'hit song album art',
    'iTunes chart singles',
    'single cover gallery',
    'song artwork',
    'single art collection'
  ],
  openGraph: {
    title: 'Top 100 Single Album Covers - Current iTunes Hit Songs',
    description: 'Explore the most popular single covers from iTunes top 100 songs chart. High-resolution artwork from today\'s trending singles.',
    url: 'https://albumartworkfinder.com/top-100-single-covers',
    type: 'website',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'Top 100 Single Album Covers Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 100 Single Album Covers - Current iTunes Hit Songs',
    description: 'Discover trending single artwork from iTunes top charts',
  },
  alternates: {
    canonical: 'https://albumartworkfinder.com/top-100-single-covers',
  },
};

function TopSinglesHero() {
  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Headphones className="h-8 w-8 text-purple-300" />
            <span className="bg-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-purple-300/30">
              Updated Weekly
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Top 100 Single Covers
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
            Discover the most popular single artwork from iTunes current hit songs. 
            High-resolution covers from today's chart-topping tracks, updated weekly.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-purple-200">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <span>Current iTunes Singles</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <span>High-Resolution Artwork</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Updated Weekly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopSingleCoversPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <TopSinglesHero />
      
      {/* SEO Content Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Current iTunes Top Single Covers Collection
              </h2>
              
              <p className="text-gray-600 mb-6">
                Explore the visual artistry behind today's hottest singles with our curated collection 
                of the top 100 single covers from iTunes current hit songs chart. This collection showcases 
                the artwork that accompanies the most streamed and purchased tracks across all genres.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 my-8">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Chart-Topping Hits</h3>
                  <p className="text-gray-600 text-sm">
                    Direct from iTunes official singles charts, featuring today's most popular tracks.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl">
                  <Download className="h-8 w-8 text-pink-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
                  <p className="text-gray-600 text-sm">
                    Access high-resolution single artwork perfect for playlists and collections.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <Calendar className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Always Current</h3>
                  <p className="text-gray-600 text-sm">
                    Updated every 7 days to capture the latest trending single covers.
                  </p>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                The Art of Single Cover Design in the Streaming Era
              </h3>
              
              <p className="text-gray-600 mb-4">
                In today's streaming-dominated music landscape, single artwork plays a crucial role 
                in capturing listener attention. These covers must work at thumbnail size while 
                remaining impactful enough to stand out in crowded playlists and social media feeds.
              </p>
              
              <p className="text-gray-600 mb-6">
                Our collection of top 100 single covers represents the most successful visual 
                approaches to single artwork, showcasing how artists and designers adapt their 
                creative vision for the digital music era. From bold typography to striking imagery, 
                these covers demonstrate the evolution of music marketing in the streaming age.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Singles Grid Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              iTunes Top 100 Singles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through the current chart-topping singles and discover the artwork 
              behind today's most popular songs.
            </p>
          </div>
          
          <Suspense fallback={<LoadingSkeleton />}>
            <TopSinglesGrid />
          </Suspense>
        </div>
      </section>
      
      {/* FAQ Section for SEO */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What's the difference between single covers and album covers?
                </h3>
                <p className="text-gray-600">
                  Single covers are specifically designed for individual songs and are often 
                  optimized for small thumbnail displays in streaming platforms. They may differ 
                  from the parent album artwork to better represent the specific track.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How often is the Top 100 single covers list updated?
                </h3>
                <p className="text-gray-600">
                  Our Top 100 single covers collection is updated every 7 days to reflect the 
                  latest chart movements and ensure you see the most current hit single artwork.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Can I download these single covers for my playlists?
                </h3>
                <p className="text-gray-600">
                  Yes! Click on any single cover to access high-resolution versions perfect 
                  for playlist covers, music collections, or design inspiration.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Why do some singles have different artwork than their albums?
                </h3>
                <p className="text-gray-600">
                  Artists often create unique artwork for singles to highlight specific songs, 
                  match promotional campaigns, or better suit streaming platform requirements 
                  where the artwork appears in smaller formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 