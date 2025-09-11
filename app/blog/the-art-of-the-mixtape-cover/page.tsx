import { Metadata } from 'next'
import Link from 'next/link'
import OptimizedImage from '@/components/optimized-image'
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'The Lost Art of the Mixtape Cover | AlbumArtworkFinder Blog',
  description: 'A nostalgic journey through the wild, creative world of mixtape cover art from the early 2000s underground scene.',
  alternates: {
    canonical: 'https://albumartworkfinder.com/blog/the-art-of-the-mixtape-cover',
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
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-white to-red-50"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold border border-orange-200">
                Culture
              </span>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Sarah Chen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>October 3, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>10 min read</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              The Lost Art of the
              <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Mixtape Cover
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              A nostalgic journey through the wild, creative world of mixtape cover art from the early 2000s underground scene.
            </p>

            {/* Share Button */}
            <div className="flex items-center justify-center gap-4">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-colors">
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
              <BookOpen className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">In This Article</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <a href="#golden-era" className="block text-gray-600 hover:text-orange-600 transition-colors">The Golden Era: 1999-2010</a>
                <a href="#photoshop-wild" className="block text-gray-600 hover:text-orange-600 transition-colors">Photoshop Gone Wild</a>
                <a href="#parody-culture" className="block text-gray-600 hover:text-orange-600 transition-colors">The Parody Culture</a>
                <a href="#street-credibility" className="block text-gray-600 hover:text-orange-600 transition-colors">Street Credibility Through Design</a>
                <a href="#diy-aesthetic" className="block text-gray-600 hover:text-orange-600 transition-colors">The DIY Aesthetic</a>
              </div>
              <div className="space-y-2">
                <a href="#regional-styles" className="block text-gray-600 hover:text-orange-600 transition-colors">Regional Styles</a>
                <a href="#bootleg-empire" className="block text-gray-600 hover:text-orange-600 transition-colors">The Bootleg Empire</a>
                <a href="#technology" className="block text-gray-600 hover:text-orange-600 transition-colors">Technology and Accessibility</a>
                <a href="#decline-legacy" className="block text-gray-600 hover:text-orange-600 transition-colors">The Decline and Legacy</a>
                <a href="#modern-revival" className="block text-gray-600 hover:text-orange-600 transition-colors">Modern Revival</a>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-xl max-w-none">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-12 border border-orange-100">
              <p className="text-xl leading-relaxed text-gray-700 m-0">
                Before streaming platforms and official releases dominated the music landscape, mixtapes ruled the streets. These underground collections showcased raw talent and creativity, often paired with equally bold and experimental cover art.
              </p>
            </div>

            {/* Era Sections */}
            <section id="golden-era" className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">The Golden Era: 1999-2010</h2>
                  <p className="text-gray-600 text-lg">When mixtapes defined underground culture</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <OptimizedImage 
                      src="https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/e5/23/9c/e5239c87-a2f7-21a7-2016-4447c2349079/075679899324.jpg/600x600bb.jpg" 
                      alt="Classic Mixtape Cover Example" 
                      width={400} 
                      height={400} 
                      className="rounded-xl shadow-lg w-full" 
                    />
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                      The late 90s and early 2000s marked the golden era of mixtape culture. DJs like DJ Clue, Funkmaster Flex, and DJ Drama became household names, featuring some of the most memorable cover art in music history.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600"><strong>Key Players:</strong> DJ Clue, Funkmaster Flex, DJ Drama</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600"><strong>Style:</strong> No major label restrictions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-600"><strong>Impact:</strong> Unprecedented creative freedom</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="photoshop-wild" className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Photoshop Gone Wild</h2>
                  <p className="text-gray-600 text-lg">Over-the-top effects and impossible compositions</p>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                Mixtape covers were notorious for their over-the-top Photoshop effects. Chrome text, lens flares, fire effects, and impossible composite images became the norm. While often criticized for being "too much," these designs perfectly captured the energy and ambition of underground hip-hop culture.
              </p>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <p className="text-lg text-purple-800 italic m-0">
                  "Mixtape covers were like graffiti for the digital age – raw, unfiltered expressions of creativity that didn't ask for permission."
                </p>
              </div>
            </section>

            <section id="parody-culture" className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">The Parody Culture</h2>
                  <p className="text-gray-600 text-lg">Movie posters and pop culture mashups</p>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed text-gray-700">
                One of the most entertaining aspects of mixtape covers was their liberal use of movie posters, album covers, and pop culture imagery. Rappers would place themselves into famous scenes from Scarface, The Godfather, or popular video games, creating surreal and often hilarious compositions.
              </p>
            </section>

            {/* Modern Context */}
            <section id="modern-revival" className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  4
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Modern Revival</h2>
                  <p className="text-gray-600 text-lg">Contemporary artists embracing the aesthetic</p>
                </div>
              </div>
              
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                Recent years have seen a nostalgic revival of mixtape aesthetics. Artists like Tyler, The Creator, and Playboi Carti have incorporated mixtape-inspired elements into their official releases, paying homage to this important chapter in hip-hop history.
              </p>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-lg text-gray-700 m-0">
                  <strong>Collecting Mixtape Art:</strong> Original mixtape covers have become collector's items, with rare releases selling for hundreds of dollars. The artwork that was once considered "cheap" or "amateur" is now appreciated as an important cultural artifact.
                </p>
              </div>
            </section>

            {/* Conclusion */}
            <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 rounded-2xl p-12 text-white text-center mt-16">
              <h3 className="text-2xl font-bold mb-4">A Lasting Cultural Impact</h3>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                The mixtape cover era may be over, but its impact on hip-hop culture and graphic design continues to resonate as a reminder that authentic art comes from the underground.
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
              
              <Link href="/blog/design-trends-in-hip-hop" className="group">
                <article className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">Trends</span>
                    <span className="text-sm text-gray-500">6 min read</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    Design Trends in Modern Hip-Hop Album Art
                  </h4>
                  <p className="text-gray-600">
                    Analyzing the visual language of today's biggest hip-hop artists and how album art reflects cultural evolution.
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