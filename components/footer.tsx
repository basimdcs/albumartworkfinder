import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-12 mt-12" style={{ minHeight: '400px' }}>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold text-primary mb-4 block">
              AlbumArtworkFinder
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Find high-quality album artwork from millions of artists. Download album covers 
              for your favorite music from the iTunes catalog.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-primary transition-colors">
                  Search Albums
                </Link>
              </li>
              <li>
                <Link href="/top-100-album-covers" className="text-gray-600 hover:text-primary transition-colors">
                  Top 100 Albums
                </Link>
              </li>
              <li>
                <Link href="/top-100-single-covers" className="text-gray-600 hover:text-primary transition-colors">
                  Top 100 Singles
                </Link>
              </li>
              <li>
                <Link href="/best-album-covers" className="text-gray-600 hover:text-primary transition-colors">
                  Best Album Covers
                </Link>
              </li>
              <li>
                <Link href="/search?q=2024" className="text-gray-600 hover:text-primary transition-colors">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link href="/search?q=top hits" className="text-gray-600 hover:text-primary transition-colors">
                  Popular Albums
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Artists */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Popular Artists</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search?q=Taylor Swift" className="text-gray-600 hover:text-primary transition-colors">
                  Taylor Swift
                </Link>
              </li>
              <li>
                <Link href="/search?q=Drake" className="text-gray-600 hover:text-primary transition-colors">
                  Drake
                </Link>
              </li>
              <li>
                <Link href="/search?q=The Beatles" className="text-gray-600 hover:text-primary transition-colors">
                  The Beatles
                </Link>
              </li>
              <li>
                <Link href="/search?q=Adele" className="text-gray-600 hover:text-primary transition-colors">
                  Adele
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal & Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-gray-600">
                  High-res artwork up to 1000x1000px
                </span>
              </li>
              <li>
                <span className="text-gray-600">
                  Free to use
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; 2024 AlbumArtworkFinder. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Album artwork sourced from iTunes. All rights belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  )
}