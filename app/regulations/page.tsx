'use client';

import { motion } from 'framer-motion';

export default function RegulationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-500 rounded-2xl shadow p-8 md:p-12 mt-10"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Regulations & Compliance</h1>
        <p className="text-gray-600 dark:text-white mb-12">
          At EaziWage, we prioritise compliance with financial, data, and employment regulations 
          to ensure our platform is safe, secure, and transparent for both employers and employees.
        </p>

        {/* Licensing */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">1. Licensing & Approvals</h2>
        <p className="text-gray-600 dark:text-white mb-6">
          We operate in alignment with applicable financial services regulations and seek approval 
          from relevant authorities, including the Central Bank of Kenya and telecommunications partners.
        </p>

        {/* Financial Regulations */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">2. Financial Regulations</h2>
        <p className="text-gray-600 dark:text-white mb-6">
          Our wage advance services comply with consumer protection laws, transparency in pricing, 
          and fair lending practices to ensure employees are protected at all times.
        </p>

        {/* Data Privacy */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">3. Data & Privacy Regulations</h2>
        <p className="text-gray-600 dark:text-white mb-6">
          We comply with global and local data protection laws, including GDPR and the Kenya Data 
          Protection Act. Personal data is encrypted, and users retain the right to access, correct, 
          or erase their data.
        </p>

        {/* AML & KYC */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">4. AML & KYC Compliance</h2>
        <p className="text-gray-600 dark:text-white mb-6">
          We follow Anti Money Laundering (AML) and Know Your Customer (KYC) guidelines to 
          prevent fraud, identity theft, and financial crimes.
        </p>

        {/* Employment Law */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">5. Employment Law Alignment</h2>
        <p className="text-gray-600 dark:text-white mb-6">
          KaziAdvance integrates with employers&apos; payroll systems in compliance with employment laws 
          to ensure wage advances are lawful and transparent.
        </p>

        {/* Disputes */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">6. Dispute Resolution</h2>
        <p className="text-gray-600 dark:text-white mb-6">
          In case of disputes, we provide clear channels for employees and employers to resolve 
          issues quickly and fairly, with escalation to regulators if necessary.
        </p>

        {/* Updates */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">7. Policy Updates</h2>
        <p className="text-gray-600 dark:text-white mb-6">
          This page is updated as regulations evolve. We are committed to continuous compliance 
          improvements as financial technology laws advance.
        </p>

        {/* Contact */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">8. Contact Compliance</h2>
        <p className="text-gray-600 dark:text-white">
          For regulatory or compliance-related questions, reach us at{' '}
          <a href="mailto:compliance@kaziadvance.com" className="text-green-600 dark:text-black underline">
            compliance@eaziwage.com
          </a>.
        </p>
      </motion.div>
    </div>
  );
}
