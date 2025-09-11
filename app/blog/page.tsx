import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | AlbumArtworkFinder',
  description: 'The official blog of AlbumArtworkFinder. Read articles, guides, and insights into the world of album artwork, music history, and design.',
  alternates: {
    canonical: 'https://albumartworkfinder.com/blog',
  },
}

// Blog posts
const blogPosts = [
  {
    slug: '10-most-iconic-album-covers',
    title: 'The 10 Most Iconic Album Covers of the 21st Century',
    description: 'From Radiohead\'s "Kid A" to Kendrick Lamar\'s "To Pimp a Butterfly", we explore the stories behind the most iconic album artwork of our time.',
    author: 'Jane Doe',
    date: 'August 5, 2024',
    category: 'Design History',
    readTime: '8 min read',
    featured: true,
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    slug: 'design-trends-in-hip-hop',
    title: 'Design Trends in Modern Hip-Hop Album Art',
    description: 'Analyzing the visual language of today\'s biggest hip-hop artists and how album art reflects cultural evolution.',
    author: 'Marcus Johnson',
    date: 'September 12, 2024',
    category: 'Trends',
    readTime: '6 min read',
    featured: false,
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    slug: 'the-art-of-the-mixtape-cover',
    title: 'The Lost Art of the Mixtape Cover',
    description: 'A nostalgic journey through the wild, creative world of mixtape cover art from the early 2000s underground scene.',
    author: 'Sarah Chen',
    date: 'October 3, 2024',
    category: 'Culture',
    readTime: '10 min read',
    featured: false,
    gradient: 'from-orange-500 to-red-600'
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Design History': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Trends': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'Culture': return 'bg-orange-100 text-orange-700 border-orange-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-purple-50"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Stories & Insights
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The Album Art
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Chronicles
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Deep dives into music history, design trends, and the fascinating stories behind the world's most memorable album artwork.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Weekly Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Expert Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>Music History</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Featured Post */}
          {featuredPost && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
              </div>
              
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <article className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  <div className="md:flex">
                    {/* Content */}
                    <div className="md:w-2/3 p-10 md:p-12">
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(featuredPost.category)}`}>
                          {featuredPost.category}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium border border-yellow-200">
                          Featured
                        </span>
                      </div>
                      
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h3>
                      
                      <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        {featuredPost.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{featuredPost.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                      
                      <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                        <span>Read Full Article</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Visual Element */}
                    <div className="md:w-1/3 relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${featuredPost.gradient} opacity-10`}></div>
                      <div className="h-64 md:h-full flex items-center justify-center p-8">
                        <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${featuredPost.gradient} shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform duration-500`}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </article>
              </Link>
            </section>
          )}

          {/* Regular Posts Grid */}
          <section>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              {regularPosts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <article className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                    {/* Visual Header */}
                    <div className="relative h-48 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`}></div>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-white/90 backdrop-blur-sm ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl transform rotate-12 group-hover:rotate-6 transition-transform duration-300"></div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                        {post.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <span className="text-xs">{post.date}</span>
                      </div>
                    </div>
                    
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="mt-20">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-12 text-center text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
              <div className="relative">
                <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                  Get notified when we publish new articles about album art, music history, and design trends.
                </p>
                <Link 
                  href="/search" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors"
                >
                  Explore Album Art
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 