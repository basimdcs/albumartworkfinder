import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">AlbumArtworkFinder.com</h3>
            <p className="text-sm text-gray-600">
              The ultimate destination for finding high-quality album artwork for your favorite music.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 hover:text-primary">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/popular" className="text-gray-600 hover:text-primary">
                  Popular Albums
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} AlbumArtworkFinder.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
