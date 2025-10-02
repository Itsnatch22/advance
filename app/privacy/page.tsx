'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 md:p-12 mt-10"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-12">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        {/* Section 1 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
        <p className="text-gray-600 mb-6">
          EaziWage (“we,” “our,” or “us”) values your privacy. This Privacy Policy explains how
          we collect, use, and safeguard your information when you use our website and services.
        </p>

        {/* Section 2 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Personal details such as name, email, and phone number when you sign up.</li>
          <li>Employment and payroll information to facilitate earned wage access.</li>
          <li>Technical information such as IP address, device type, and browser.</li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. How We Use Your Information</h2>
        <p className="text-gray-600 mb-6">
          We use your data to provide services, improve user experience, and comply with
          regulatory obligations. Your data will never be sold to third parties.
        </p>

        {/* Section 4 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Sharing of Information</h2>
        <p className="text-gray-600 mb-6">
          We may share your information with trusted partners (such as banks or mobile providers like
          Safaricom) strictly to enable earned wage access. All partners are bound by confidentiality
          agreements.
        </p>

        {/* Section 5 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Data Security</h2>
        <p className="text-gray-600 mb-6">
          We implement strong encryption and access controls to protect your data. However, no
          method of transmission over the internet is 100% secure, and we cannot guarantee absolute
          security.
        </p>

        {/* Section 6 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Your Rights</h2>
        <p className="text-gray-600 mb-6">
          You have the right to access, correct, or delete your data. You may also opt out of
          marketing communications at any time.
        </p>

        {/* Section 7 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">7. Changes to this Policy</h2>
        <p className="text-gray-600 mb-6">
          We may update this Privacy Policy from time to time. Any significant changes will be
          communicated to you via email or a notice on our website.
        </p>

        {/* Section 8 */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">8. Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@kaziadvance.com" className="text-green-600 underline">
            privacy@eaziwage.com
          </a>.
        </p>
      </motion.div>
    </div>
  );
}
