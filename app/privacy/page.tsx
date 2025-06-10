import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | AlbumArtworkFinder.com",
  description: "Privacy Policy for AlbumArtworkFinder.com. Learn how we protect your privacy and handle your data when using our album artwork search service.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
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
          <li className="text-gray-700 font-medium">Privacy Policy</li>
        </ol>
      </nav>

      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <p className="text-gray-600 mb-8">
          <strong>Last updated:</strong> December 2024
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              AlbumArtworkFinder.com ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Information You Provide</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not require user registration or account creation. However, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Search queries you enter when looking for album artwork</li>
              <li>Feedback or communications you send to us</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>IP address and location information</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
              <li>Device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide and maintain our album artwork search service</li>
              <li>Improve our website functionality and user experience</li>
              <li>Analyze usage patterns and trends</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our service integrates with the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>iTunes API:</strong> We use Apple's iTunes API to search for and display album artwork</li>
              <li><strong>Analytics Services:</strong> We may use analytics tools to understand how our service is used</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              These third-party services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve our service functionality</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings, but disabling them may affect some website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information only for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us through our website.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Privacy Matters</h3>
          <p className="text-sm text-blue-800">
            We are committed to protecting your privacy and being transparent about our data practices. 
            This service is designed to be privacy-friendly with minimal data collection.
          </p>
        </div>
      </div>
    </div>
  )
} 