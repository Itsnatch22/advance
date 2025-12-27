'use client'
import { BiChevronRight } from "react-icons/bi"
import { useEffect, useRef } from "react"
import { motion } from 'framer-motion'
import Link from "next/link"
import Typed from "typed.js"

export default function Hero() {
    const typedRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
        strings: [
            "Earned Wages",
            "Salary Advances",
            "Money You've Worked For",
        ],
        typeSpeed: 100,
        backSpeed: 80,
        loop: true,
        smartBackspace: true,
        cursorChar: '|',
        backDelay: 2000,
    });

    return () => typed.destroy();
    }, []);

    return(
        <section className="relative min-h-screen flex items-center justify-center text-white bg-[url('/homepage/background.jpg')] bg-cover bg-center px-4 sm:px-6 lg:px-8 py-20 lg:py-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 to-transparent"></div>
            
            {/* Parallax-like effect for background or subtle movement could be added here if desired, 
                but keeping it simple for performance as per request to maintain content/UI */}

            <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto relative z-10">
                <div
                className="space-y-4 sm:space-y-6">
                    <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }} 
                    className="text-3xl sm:text-4xl lg:text-6xl font-bold text-black leading-tight font-serif">
                        Access Your <span ref={typedRef} className="text-white underline"/> {""} Before PayDay
                    </motion.h1>
                    <motion.p
                    className="max-w-lg text-base sm:text-lg"
                    initial={{ opacity: 0, y: 30}}
                    whileInView={{ opacity: 1, y: 0}}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}>
                         EaziWage helps employees access a portion of their salary they&apos;ve already earned, anytime! 
                         Reduce financial stress, improve productivity and retain top talent - just EaziWage it.
                    </motion.p>
                    <motion.div
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link href="/register">
                            <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 dark:bg-black bg-green-600 text-white px-6 py-3 rounded-xl text-base sm:text-lg font-medium hover:bg-green-700 transition w-full sm:w-auto"
                            >
                                Get Started Now
                                <BiChevronRight className="w-5 h-5 "/>
                            </motion.button>
                        </Link>
                        <Link href="/employers">
                             <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-transparent gap-2 flex items-center justify-center border-green-500 border px-6 py-3 rounded-xl text-base sm:text-lg font-medium hover:bg-green-50 text-white hover:text-green-700 ease-in-out transition-colors w-full sm:w-auto"
                            >
                                For Employers
                                <BiChevronRight className="w-5 h-5"/>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="hidden lg:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="flex flex-col items-center">
                    <span className="text-sm text-white mb-2">Scroll Down</span>
                    <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white rounded-full mt-2" />
                    </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}