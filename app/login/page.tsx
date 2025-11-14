'use client';

import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black bg-gray-50 relative">
      <div className="fixed inset-0 w-screen h-screen bg-green-600 
  sm:[clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)] 
  [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 p-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center text-white dark:text-black md:pr-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold dark:text-black leading-tight font-serif mt-12">
            Welcome Back to EaziWage
          </h1>
          <p className="mt-4 text-lg dark:text-black text-green-100">
            Log in to access your dashboard and manage earned wages instantly.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mt-5"
        >
          <h2 className="text-2xl font-bold text-gray-900">Log In</h2>
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full px-4 py-2 border border-green-400 dark:text-black rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 bg-green-600 dark:text-black text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Log In
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
            <svg
                className="h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                fill="currentColor"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </button>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-green-600 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
