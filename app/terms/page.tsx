'use client';

import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 md:p-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-12">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        {/* Section 1 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-600 mb-6">
          By using KaziAdvance (“we,” “our,” or “us”) services, you agree to these Terms of Service.
          If you do not agree, you may not use our platform.
        </p>

        {/* Section 2 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Eligibility</h2>
        <p className="text-gray-600 mb-6">
          You must be at least 18 years old and legally employed to access KaziAdvance services.
          Employers must be authorised to provide payroll data to us.
        </p>

        {/* Section 3 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Services Provided</h2>
        <p className="text-gray-600 mb-6">
          KaziAdvance allows employees to access earned wages before payday through integrations
          with employers, banks, and mobile providers. Features may change or be updated at any
          time.
        </p>

        {/* Section 4 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>You must provide accurate information during registration.</li>
          <li>You are responsible for maintaining the confidentiality of your account.</li>
          <li>You must not use the platform for fraudulent or unlawful purposes.</li>
        </ul>

        {/* Section 5 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Fees and Payments</h2>
        <p className="text-gray-600 mb-6">
          Certain services may require payment. Fees will be disclosed transparently before
          transactions are processed.
        </p>

        {/* Section 6 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Limitation of Liability</h2>
        <p className="text-gray-600 mb-6">
          KaziAdvance is not liable for indirect damages, lost profits, or issues arising from
          third-party partners. Our maximum liability shall not exceed the fees paid to us in the
          last 6 months.
        </p>

        {/* Section 7 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Termination</h2>
        <p className="text-gray-600 mb-6">
          We may suspend or terminate your access if you violate these terms. You may also close
          your account at any time by contacting support.
        </p>

        {/* Section 8 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Governing Law</h2>
        <p className="text-gray-600 mb-6">
          These Terms shall be governed by and construed in accordance with the laws of Kenya, unless
          otherwise required by local jurisdiction.
        </p>

        {/* Section 9 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">9. Changes to Terms</h2>
        <p className="text-gray-600 mb-6">
          We may update these Terms from time to time. Material changes will be communicated via
          email or a notice on our website.
        </p>

        {/* Section 10 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">10. Contact Us</h2>
        <p className="text-gray-600">
          For questions about these Terms, contact us at{' '}
          <a href="mailto:legal@kaziadvance.com" className="text-green-600 underline">
            legal@kaziadvance.com
          </a>.
        </p>
      </motion.div>
    </div>
  );
}
