"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FaGoogle, FaSpinner } from "react-icons/fa";

export default function RegisterPage() {
 

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black bg-gray-50 relative">
      <div className="fixed inset-0 w-screen h-screen bg-green-600 sm:[clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"></div>
      <div className="relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 p-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }} 
          className="flex flex-col justify-center text-white dark:text-black md:pr-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight font-serif mt-12 dark:text-black">Join EaziWage Today</h1>
          <p className="mt-4 text-lg text-green-100 dark:text-black">Empower your employees with instant wage access. Sign up to unlock the future of payroll.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }} 
          className="bg-white rounded-2xl shadow-lg p-8 mt-5"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Your Account</h2>

          <form className="mt-6 space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input 
                placeholder="Full name" 
                className="mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                placeholder="Email" 
                className="mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                autoComplete="new-password" 
                placeholder="Password" 
                className="mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" 
              />
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input 
                  type="password" 
                  autoComplete="new-password" 
                  placeholder="Confirm Password" 
                  className="mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" 
                />
              </div>
            <button 
              type="submit" 
              className="w-full mt-6 px-4 py-2 flex items-center justify-center gap-2  bg-green-600 text-white font-semibold rounded-lg transition"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
          >
            <FaGoogle className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </button>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 font-semibold hover:underline">
              Log in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}