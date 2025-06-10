import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | AlbumArtworkFinder.com",
  description: "Terms of Service and usage guidelines for AlbumArtworkFinder.com. Learn about our policies for using our album artwork search service.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700 font-medium">Terms of Service</li>
        </ol>
      </nav>

      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> December 2024
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using AlbumArtworkFinder.com ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              AlbumArtworkFinder.com is a free service that allows users to search for and view album artwork from the iTunes catalog. Our service provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Search functionality for album artwork</li>
              <li>High-resolution album cover images (up to 1000x1000px)</li>
              <li>Album information and track listings</li>
              <li>Music preview functionality</li>
              <li>Download capabilities for personal use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials on AlbumArtworkFinder.com for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Content and Copyright</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All album artwork, images, and related content displayed on this service are sourced from the iTunes catalog and remain the property of their respective copyright holders. We do not claim ownership of any album artwork or music content.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Users are responsible for ensuring their use of downloaded content complies with applicable copyright laws. Downloaded content should only be used for personal, non-commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use the service to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Distribute malware or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or download content in bulk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials on AlbumArtworkFinder.com are provided on an 'as is' basis. AlbumArtworkFinder makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitations</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall AlbumArtworkFinder or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AlbumArtworkFinder.com, even if AlbumArtworkFinder or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              AlbumArtworkFinder may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our website.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            By using AlbumArtworkFinder.com, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
          </p>
        </div>
      </div>
    </div>
  )
} 