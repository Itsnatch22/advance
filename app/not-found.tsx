'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white px-6 text-center">
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-8xl font-extrabold text-green-600"
      >
        404
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 text-2xl md:text-3xl font-semibold text-gray-900"
      >
        Page Not Found
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-2 text-gray-600 max-w-md"
      >
        Oops 👀 The page you&apos;re looking for doesn&apos;t exist or has been moved.  
        Don&apos;t worry, we&apos;ll get you back on track.
      </motion.p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition"
        >
          Back Home
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 border border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
