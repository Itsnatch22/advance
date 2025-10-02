'use client';

import { motion } from 'framer-motion';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 md:p-12 mt-10"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        <p className="text-gray-600 mb-12">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        {/* Section 1 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. What Are Cookies?</h2>
        <p className="text-gray-600 mb-6">
          Cookies are small text files stored on your device when you visit our website. They help us
          provide core functionality, improve performance, and personalise your experience.
        </p>

        {/* Section 2 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Types of Cookies We Use</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>
            <strong>Essential Cookies:</strong> Required for core site features such as login and
            secure access.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Collect anonymous data on how visitors use our
            site to help us improve.
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember your preferences (e.g., language or region).
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Used to deliver personalised ads or measure ad
            performance.
          </li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. How We Use Cookies</h2>
        <p className="text-gray-600 mb-6">
          We use cookies to ensure the site runs smoothly, understand user behaviour, and improve
          services like API dashboards, authentication, and analytics.
        </p>

        {/* Section 4 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Third-Party Cookies</h2>
        <p className="text-gray-600 mb-6">
          Some cookies are set by third-party providers such as Google Analytics or payment
          processors. These are governed by their respective privacy policies.
        </p>

        {/* Section 5 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Managing Cookies</h2>
        <p className="text-gray-600 mb-6">
          You can control or disable cookies via your browser settings. Note that blocking certain
          cookies may affect functionality, including secure access to your account or API services.
        </p>

        {/* Section 6 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Updates to This Policy</h2>
        <p className="text-gray-600 mb-6">
          We may update this Cookie Policy occasionally to reflect changes in technology, legal
          requirements, or our business practices.
        </p>

        {/* Section 7 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Contact Us</h2>
        <p className="text-gray-600">
          For questions about our use of cookies, contact us at{' '}
          <a href="mailto:privacy@kaziadvance.com" className="text-green-600 underline">
            privacy@eaziwage.com
          </a>.
        </p>
      </motion.div>
    </div>
  );
}
