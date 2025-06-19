import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - AlbumArtworkFinder',
  description: 'Terms of Service for AlbumArtworkFinder. Learn about our usage policies, copyright information, and user responsibilities for album artwork downloads.',
  keywords: ['terms of service', 'album artwork', 'copyright', 'usage policy', 'legal'],
  openGraph: {
    title: 'Terms of Service - AlbumArtworkFinder',
    description: 'Terms of Service for AlbumArtworkFinder album artwork finder.',
    url: 'https://albumartworkfinder.com/terms',
  },
  alternates: {
    canonical: 'https://albumartworkfinder.com/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span>Terms of Service</span>
          </nav>

          <div className="rounded-2xl bg-white p-8 shadow-lg md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
              Terms of Service
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">
                Last updated: January 2024
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using AlbumArtworkFinder ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
                <p>
                  AlbumArtworkFinder is a free web application that allows users to search for and view album artwork from the iTunes catalog. Our service provides:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Search functionality for album artwork</li>
                  <li>High-resolution image viewing up to 1000x1000px</li>
                  <li>Mobile-optimized browsing experience</li>
                  <li>Free access without registration requirements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Copyright and Intellectual Property</h2>
                <p>
                  All album artwork displayed on AlbumArtworkFinder is sourced from the iTunes catalog and remains the property of their respective copyright holders, including:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Record labels and music publishers</li>
                  <li>Artists and their representatives</li>
                  <li>Graphic designers and artwork creators</li>
                  <li>Apple Inc. (iTunes Store)</li>
                </ul>
                <p className="mt-4">
                  Users are responsible for ensuring their use of any artwork complies with applicable copyright laws and fair use provisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Permitted Use</h2>
                <p>You may use AlbumArtworkFinder for:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Personal music library organization</li>
                  <li>Educational and research purposes</li>
                  <li>Non-commercial personal use</li>
                  <li>Fair use under copyright law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Use</h2>
                <p>You may NOT use AlbumArtworkFinder for:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Commercial redistribution of artwork</li>
                  <li>Selling or licensing artwork to third parties</li>
                  <li>Creating derivative works for commercial purposes</li>
                  <li>Violating copyright or intellectual property rights</li>
                  <li>Automated scraping or bulk downloading</li>
                  <li>Any illegal or unauthorized activities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
                <p>
                  AlbumArtworkFinder is provided "as is" without any representations or warranties, express or implied. We make no representations or warranties in relation to this website or the information and materials provided on this website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                <p>
                  In no event shall AlbumArtworkFinder, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy Policy</h2>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                  View Privacy Policy
                </Link>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our website or by visiting our homepage.
                </p>
                <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
                  Return to Homepage
                </Link>
              </section>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> This Terms of Service page is designed to be comprehensive and user-friendly. 
                  AlbumArtworkFinder respects intellectual property rights and encourages responsible use of album artwork. 
                  All artwork is sourced from publicly available iTunes data and remains the property of respective copyright holders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 