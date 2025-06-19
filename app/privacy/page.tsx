import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy - AlbumArtworkFinder",
  description: "Privacy Policy for AlbumArtworkFinder. Learn how we protect your privacy, handle data, and ensure secure album artwork browsing experience.",
  keywords: ["privacy policy", "data protection", "album artwork", "privacy", "security"],
  openGraph: {
    title: "Privacy Policy - AlbumArtworkFinder",
    description: "Privacy Policy for AlbumArtworkFinder album artwork finder.",
    url: "https://albumartworkfinder.com/privacy",
  },
  alternates: {
    canonical: "https://albumartworkfinder.com/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span>Privacy Policy</span>
          </nav>

          <div className="rounded-2xl bg-white p-8 shadow-lg md:p-12">
            <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">
                Last updated: January 2024
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p>
                  AlbumArtworkFinder ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our album artwork search service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Information You Provide</h3>
                <p>
                  AlbumArtworkFinder does not require user registration or account creation. We do not collect personal information such as:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Names, email addresses, or contact information</li>
                  <li>Payment information (our service is completely free)</li>
                  <li>User accounts or profiles</li>
                  <li>Personal preferences or settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
                <p>
                  When you visit our website, we may automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Search queries and terms you enter</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and general location (country/region)</li>
                  <li>Referral source (how you found our website)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Providing and improving our album artwork search service</li>
                  <li>Analyzing usage patterns to enhance user experience</li>
                  <li>Optimizing website performance and loading speeds</li>
                  <li>Understanding popular search terms and trends</li>
                  <li>Ensuring website security and preventing abuse</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 iTunes API</h3>
                <p>
                  Our service uses the iTunes Search API to provide album artwork and music information. When you search for albums, your queries are sent to Apple's servers. Please refer to Apple's Privacy Policy for information about how they handle this data.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Analytics Services</h3>
                <p>
                  We use Google Analytics to understand how visitors interact with our website. Google Analytics may collect:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Anonymous usage statistics</li>
                  <li>Page views and session duration</li>
                  <li>Device and browser information</li>
                  <li>General geographic location</li>
                </ul>
                <p className="mt-4">
                  You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 CORS Proxy Services</h3>
                <p>
                  For mobile compatibility, we may use CORS proxy services to access the iTunes API. These services temporarily process your search requests but do not store personal information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Storage and Security</h2>
                <p>
                  We implement appropriate security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>No permanent storage of personal information</li>
                  <li>Temporary caching of search results for performance</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Limited data retention periods</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Local Storage</h2>
                <p>
                  Our website uses minimal cookies and local storage for:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Caching search results to improve performance</li>
                  <li>Remembering your recent searches (stored locally)</li>
                  <li>Analytics and website optimization</li>
                  <li>Ensuring proper website functionality</li>
                </ul>
                <p className="mt-4">
                  You can control cookie settings through your browser preferences. Disabling cookies may affect some website functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
                <p>You have the following rights regarding your information:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Access: Request information about data we may have collected</li>
                  <li>Deletion: Clear your browser cache and cookies to remove stored data</li>
                  <li>Opt-out: Disable analytics tracking through browser settings</li>
                  <li>Correction: Contact us if you believe we have incorrect information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
                <p>
                  Our service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Users</h2>
                <p>
                  Our service is available globally. If you are accessing our website from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
                <p>
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us through our website.
                </p>
                <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
                  Return to Homepage
                </Link>
              </section>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Privacy Summary:</strong> AlbumArtworkFinder is designed with privacy in mind. We don't require registration, don't store personal information, and only collect minimal data necessary to provide our album artwork search service. Your searches are processed through the iTunes API, and we use standard web analytics to improve our service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 