import { Metadata } from 'next'
import Link from 'next/link'
import OptimizedImage from '@/components/optimized-image'
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Design Trends in Modern Hip-Hop Album Art | AlbumArtworkFinder Blog',
  description: 'Analyzing the visual language of today\'s biggest hip-hop artists and how album art reflects cultural evolution.',
  alternates: {
    canonical: 'https://albumartworkfinder.com/blog/design-trends-in-hip-hop',
  },
}

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-white to-pink-50"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold border border-purple-200">
                Trends
              </span>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Marcus Johnson</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>September 12, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>6 min read</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Design Trends in
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Modern Hip-Hop Album Art
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              Analyzing the visual language of today's biggest hip-hop artists and how album art reflects cultural evolution.
            </p>

            {/* Share Button */}
            <div className="flex items-center justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-purple-600 hover:border-purple-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Share Article
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-12 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">In This Article</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <a href="#luxury-minimalism" className="block text-gray-600 hover:text-purple-600 transition-colors">The Luxury Minimalism Era</a>
                <a href="#surreal-digital" className="block text-gray-600 hover:text-purple-600 transition-colors">Surreal Digital Art</a>
                <a href="#photography" className="block text-gray-600 hover:text-purple-600 transition-colors">Photography as Statement</a>
                <a href="#retro-futurism" className="block text-gray-600 hover:text-purple-600 transition-colors">Retro-Futurism and Nostalgia</a>
              </div>
              <div className="space-y-2">
                <a href="#cultural-symbolism" className="block text-gray-600 hover:text-purple-600 transition-colors">Cultural Symbolism</a>
                <a href="#social-media" className="block text-gray-600 hover:text-purple-600 transition-colors">The Impact of Social Media</a>
                <a href="#collaborative" className="block text-gray-600 hover:text-purple-600 transition-colors">Collaborative Art Direction</a>
                <a href="#future" className="block text-gray-600 hover:text-purple-600 transition-colors">Looking Forward</a>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-xl max-w-none">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-12 border border-purple-100">
              <p className="text-xl leading-relaxed text-gray-700 m-0">
                Hip-hop has always been a visual culture as much as a musical one. From graffiti-inspired covers to minimalist luxury aesthetics, today's hip-hop album art reflects the genre's evolution and cultural impact.
              </p>
            </div>

            {/* Trend Sections */}
            <section id="luxury-minimalism" className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">The Luxury Minimalism Era</h2>
                  <p className="text-gray-600 text-lg">Clean aesthetics meet high-end branding</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <OptimizedImage 
                      src="https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/6b/8a/53/6b8a53d4-8e8b-9e2d-8489-d8b21b8b2e5f/16UMGIM86924.rgb.jpg/600x600bb.jpg" 
                      alt="Drake - Views Album Cover" 
                      width={400} 
                      height={400} 
                      className="rounded-xl shadow-lg w-full" 
                    />
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                      Artists like Kanye West, Drake, and Travis Scott have embraced clean, minimalist designs that reflect their transition from street credibility to luxury brand status.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600"><strong>Key Elements:</strong> Negative space, premium typography</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-600"><strong>Color Palette:</strong> Muted tones, monochromatic schemes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm text-gray-600"><strong>Impact:</strong> Elevated hip-hop's visual sophistication</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="surreal-digital" className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Surreal Digital Art</h2>
                  <p className="text-gray-600 text-lg">Otherworldly visuals and 3D landscapes</p>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                The rise of digital artists has brought surreal, otherworldly visuals to hip-hop. Artists like Travis Scott, Lil Uzi Vert, and Kid Cudi have embraced psychedelic imagery, 3D renders, and fantastical landscapes that transport listeners to different dimensions.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-lg text-blue-800 italic m-0">
                  "Digital art allows hip-hop artists to visualize sounds that were previously impossible to represent."
                </p>
              </div>
            </section>

            <section id="photography" className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Photography as Statement</h2>
                  <p className="text-gray-600 text-lg">Raw authenticity meets artistic vision</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                <OptimizedImage 
                  src="https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/a4/ab/12/a4ab12a4-2589-3540-a381-551259076afa/196871630138.jpg/600x600bb.jpg" 
                  alt="Kendrick Lamar - DAMN. Album Cover" 
                  width={600} 
                  height={600} 
                  className="rounded-xl shadow-lg mx-auto" 
                />
              </div>
              
              <p className="text-lg leading-relaxed text-gray-700">
                Raw, candid photography has become a powerful tool for authenticity. Albums like Kendrick Lamar's "DAMN." and J. Cole's "2014 Forest Hills Drive" use striking photography to create intimate connections with listeners while making bold cultural statements.
              </p>
            </section>

            {/* More sections would continue here... */}

            {/* Conclusion */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-700 rounded-2xl p-12 text-white text-center mt-16">
              <h3 className="text-2xl font-bold mb-4">The Future of Hip-Hop Visuals</h3>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                As hip-hop continues to dominate global culture, its visual language evolves with technology, creating new possibilities for artistic expression.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">Continue Reading</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Link href="/blog/10-most-iconic-album-covers" className="group">
                <article className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">Design History</span>
                    <span className="text-sm text-gray-500">8 min read</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    The 10 Most Iconic Album Covers of the 21st Century
                  </h4>
                  <p className="text-gray-600">
                    From Radiohead's "Kid A" to Kendrick Lamar's "To Pimp a Butterfly", explore the stories behind the most iconic album artwork.
                  </p>
                </article>
              </Link>
              
              <Link href="/blog/the-art-of-the-mixtape-cover" className="group">
                <article className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">Culture</span>
                    <span className="text-sm text-gray-500">10 min read</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    The Lost Art of the Mixtape Cover
                  </h4>
                  <p className="text-gray-600">
                    A nostalgic journey through the wild, creative world of mixtape cover art from the early 2000s underground scene.
                  </p>
                </article>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 