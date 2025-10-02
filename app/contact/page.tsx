'use client';

import { motion } from 'framer-motion';
import { FiMail, FiPhone } from 'react-icons/fi';
import { BiLocationPlus } from 'react-icons/bi';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Polygon green background */}
      <div className="absolute inset-0 bg-green-600 [clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)]"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 p-8 mt-12">
        {/* Left text / contact info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center text-white md:pr-8"
        >
          <h1 className="text-44 md:text-5xl font-bold leading-tight font-serif">
            Ready to Start with Us?
          </h1>
          <p className="mt-4 text-lg text-green-100">
            Contact us for any queries, partnerships, or support.  
            We&apos;re here to help employers and employees unlock early wage access.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <FiMail className="text-green-200 text-xl" />
              <span>support@eaziwage.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="text-green-200 text-xl" />
              <span>+254 723 154900</span>
            </div>
            <div className="flex items-center space-x-3">
              <BiLocationPlus className="text-green-200 text-2xl" />
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </motion.div>

        {/* Right contact form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900">DM Us😁</h2>
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Your email"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={4}
                placeholder="Write your message..."
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>

      {/* Map section */}
      <div className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-xl overflow-hidden shadow-xl h-96 bg-gray-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.858059240544!2d36.82194641532805!3d-1.2920659990595547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1731f0d3f64f%3A0x88f0f0af87d0!2sNairobi%20CBD!5e0!3m2!1sen!2ske!4v1633012345678!5m2!1sen!2ske"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
