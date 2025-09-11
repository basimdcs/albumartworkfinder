import { Metadata } from 'next';
import { Suspense } from 'react';
import { Calendar, TrendingUp, Music, Download } from 'lucide-react';
import TopAlbumsGrid from './top-albums-grid';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Top 100 Album Covers - Current iTunes Chart Hits | AlbumArtworkFinder',
  description: 'Discover the top 100 album covers from iTunes current chart hits. High-quality album artwork from today\'s most popular albums. Updated weekly with fresh content.',
  keywords: [
    'top 100 album covers',
    'iTunes top albums',
    'current album covers',
    'popular album artwork',
    'trending album covers',
    'chart album art',
    'iTunes chart hits',
    'album cover gallery',
    'music artwork',
    'album art collection'
  ],
  openGraph: {
    title: 'Top 100 Album Covers - Current iTunes Chart Hits',
    description: 'Explore the most popular album covers from iTunes top 100 charts. High-resolution artwork from today\'s trending albums.',
    url: 'https://albumartworkfinder.com/top-100-album-covers',
    type: 'website',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'Top 100 Album Covers Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 100 Album Covers - Current iTunes Chart Hits',
    description: 'Discover trending album artwork from iTunes top charts',
  },
  alternates: {
    canonical: 'https://albumartworkfinder.com/top-100-album-covers',
  },
};

function TopAlbumsHero() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="h-8 w-8 text-blue-300" />
            <span className="bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-blue-300/30">
              Updated Weekly
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Top 100 Album Covers
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Discover the most popular album artwork from iTunes current chart hits. 
            High-resolution covers from today's trending albums, updated weekly.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <span>Current iTunes Charts</span>
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

export default function TopAlbumCoversPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <TopAlbumsHero />
      
      {/* SEO Content Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Current iTunes Top Album Covers Collection
              </h2>
              
              <p className="text-gray-600 mb-6">
                Explore the visual artistry of today's most popular albums with our curated collection 
                of the top 100 album covers from iTunes current charts. This collection is updated 
                weekly to bring you the freshest and most trending album artwork from across all genres.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 my-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Real-Time Charts</h3>
                  <p className="text-gray-600 text-sm">
                    Direct from iTunes official charts, featuring the most popular albums right now.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                  <Download className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
                  <p className="text-gray-600 text-sm">
                    Access high-resolution album artwork suitable for any project or collection.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                  <Calendar className="h-8 w-8 text-green-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Always Fresh</h3>
                  <p className="text-gray-600 text-sm">
                    Updated every 7 days to ensure you see the latest trending album covers.
                  </p>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Album Covers Matter in Today's Music Industry
              </h3>
              
              <p className="text-gray-600 mb-4">
                Album covers remain one of the most important visual elements in music marketing. 
                From streaming platforms to social media, these images are often the first 
                impression listeners have of new music. Our collection showcases how contemporary 
                artists and designers are pushing creative boundaries in album artwork.
              </p>
              
              <p className="text-gray-600 mb-6">
                Whether you're a designer seeking inspiration, a music enthusiast building a 
                collection, or simply curious about current visual trends in music, this 
                gallery provides valuable insights into today's most successful album cover designs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Albums Grid Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              iTunes Top 100 Albums
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through the current chart-toppers and discover the album artwork 
              that's capturing audiences worldwide.
            </p>
          </div>
          
          <Suspense fallback={<LoadingSkeleton />}>
            <TopAlbumsGrid />
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
                  How often is the Top 100 album covers list updated?
                </h3>
                <p className="text-gray-600">
                  Our Top 100 album covers collection is updated every 7 days, ensuring you 
                  always see the most current and trending album artwork from iTunes charts.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Can I download these album covers?
                </h3>
                <p className="text-gray-600">
                  Yes! Click on any album cover to access high-resolution versions suitable 
                  for personal use, design inspiration, or adding to your music collection.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What makes these album covers special?
                </h3>
                <p className="text-gray-600">
                  These are the album covers from iTunes current top charts, representing 
                  the most popular and successful album artwork in today's music industry 
                  across all genres and styles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 