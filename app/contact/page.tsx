'use client';

import { motion } from 'framer-motion';
import { FiMail, FiPhone } from 'react-icons/fi';
import { BiLocationPlus } from 'react-icons/bi';

export default function ContactPage() {
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black relative">
      {/* Polygon green background */}
      <div className="fixed inset-0 w-screen h-screen bg-green-600 
  sm:[clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)] 
  [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"></div>


      <div className="relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 p-8 mt-12">
        {/* Left text / contact info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center text-white dark:text-black md:pr-8"
        >
          <h1 className="text-44 md:text-5xl font-bold leading-tight font-serif">
            Ready to Start with Us?
          </h1>
          <p className="mt-4 text-lg text-green-100 dark:text-black">
            Contact us for any queries, partnerships, or support.  
            We&apos;re here to help employers and employees unlock early wage access.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <FiMail className="text-green-200 dark:text-black text-xl" />
              <span>support@eaziwage.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="text-green-200 dark:text-black text-xl" />
              <span>+254 723 154900</span>
            </div>
            <div className="flex items-center space-x-3">
              <BiLocationPlus className="text-green-200 dark:text-black text-2xl" />
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
          <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Your email"
                className="mt-1 w-full px-4 border-green-400 dark:text-black py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input 
                type="subject"
                placeholder="What's your subject"
                className="mt-1 w-full px-4 border-green-400 dark:text-black py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea 
                rows={4}
                placeholder="Write your message..."
                className="mt-1 w-full px-4 border-green-400 dark:text-black py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white dark:text-black font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>

      
    </div>
  );
}
