"use client";

import { motion } from "framer-motion";

export default function RegulationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16 dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white p-8 shadow md:p-12 dark:bg-gray-500"
      >
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
          Regulations & Compliance
        </h1>
        <p className="mb-12 text-gray-600 dark:text-white">
          At EaziWage, we prioritise compliance with financial, data, and
          employment regulations to ensure our platform is safe, secure, and
          transparent for both employers and employees.
        </p>

        {/* Licensing */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
          1. Licensing & Approvals
        </h2>
        <p className="mb-6 text-gray-600 dark:text-white">
          We operate in alignment with applicable financial services regulations
          and seek approval from relevant authorities, including the Central
          Bank of Kenya and telecommunications partners.
        </p>

        {/* Financial Regulations */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
          2. Financial Regulations
        </h2>
        <p className="mb-6 text-gray-600 dark:text-white">
          Our wage advance services comply with consumer protection laws,
          transparency in pricing, and fair lending practices to ensure
          employees are protected at all times.
        </p>

        {/* Data Privacy */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
          3. Data & Privacy Regulations
        </h2>
        <p className="mb-6 text-gray-600 dark:text-white">
          We comply with global and local data protection laws, including GDPR
          and the Kenya Data Protection Act. Personal data is encrypted, and
          users retain the right to access, correct, or erase their data.
        </p>

        {/* AML & KYC */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
          4. AML & KYC Compliance
        </h2>
        <p className="mb-6 text-gray-600 dark:text-white">
          We follow Anti Money Laundering (AML) and Know Your Customer (KYC)
          guidelines to prevent fraud, identity theft, and financial crimes.
        </p>

        {/* Employment Law */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
          5. Employment Law Alignment
        </h2>
        <p className="mb-6 text-gray-600 dark:text-white">
          KaziAdvance integrates with employers&apos; payroll systems in
          compliance with employment laws to ensure wage advances are lawful and
          transparent.
        </p>

        {/* Disputes */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
          6. Dispute Resolution
        </h2>
        <p className="mb-6 text-gray-600 dark:text-white">
          In case of disputes, we provide clear channels for employees and
          employers to resolve issues quickly and fairly, with escalation to
          regulators if necessary.
        </p>

        {/* Updates */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
          7. Policy Updates
        </h2>
        <p className="mb-6 text-gray-600 dark:text-white">
          This page is updated as regulations evolve. We are committed to
          continuous compliance improvements as financial technology laws
          advance.
        </p>

        {/* Contact */}
        <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
          8. Contact Compliance
        </h2>
        <p className="text-gray-600 dark:text-white">
          For regulatory or compliance-related questions, reach us at{" "}
          <a
            href="mailto:compliance@kaziadvance.com"
            className="text-green-600 underline dark:text-black"
          >
            compliance@eaziwage.com
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
