'use client';

import { motion } from 'framer-motion';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';

export default function RegisterPage() {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 relative'>
            <div className='absolute inset-0 bg-green-600 [clip-path:polygon(0_0,70%_0,100%_100%,0%_100%)]'></div>
            <div className='relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 p-8'>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-col justify-center text-white md:pr-8'
                >
                    <h1 className='text-4xl md:text-5xl font-bold leading-tight font-serif'>Join EaziWage Today</h1>
                    <p className="mt-4 text-lg text-green-100">Empower your employees with instant wage access. Sign up to unlock the future of payroll.</p>
                </motion.div>

                <motion.div
                initial={{ opacity:0, x:30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay:0.2 }}
                className='bg-white rounded-2xl shadow-lg p-8 mt-15'
                >
                    <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Create Your Account</h2>
                    <form action="" className='mt-6 space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Email</label>
                            <input 
                            type='email'
                            className='mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                            placeholder='john@example.com'/>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Password</label>
                            <input 
                            type='password'
                            className='mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                            placeholder='.........'/>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Confirm Password</label>
                            <input 
                            type='password'
                            className='mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                            placeholder='.........'/>
                        </div>
                        <button
                        type="submit"
                        className="w-full mt-6 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
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
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition mt-3"
                    >
                        <FaLinkedin className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-700">Sign in with LinkedIn</span>
                    </button>

                    <p className="text-sm text-gray-500 mt-6 text-center">
                        Already have an account?{' '}
                        <a href="/login" className="text-green-600 font-semibold hover:underline">
                        Log in
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}