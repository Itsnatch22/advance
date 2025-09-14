'use client'
import { BiChevronRight } from "react-icons/bi"
import { useEffect,useRef } from "react"
import gsap from "gsap"
import { motion } from 'framer-motion'
import Image from "next/image"

export default function Hero() {
    const textRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(
            textRef.current,
            { y: 50, opacity: 0},
            { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out'}
        );
    }, []);
    return(
        <section className="min-h-screen flex items-center bg-gradient-to-r from-green-400 via-green-300 to-white px-6 lg:px-20">
            <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
                <div
                ref={textRef}
                className="space-y-6">
                    <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0}}
                    transition={{ duration: 0.8 }}
                    className="text-4xl lg:text-6xl font-bold text-black leading-tight">
                        Access Your <span className="text-green-700">Earned Wages</span> Before PayDay
                    </motion.h1>
                    <motion.p
                    className="max-w-lg"
                    initial={{ opacity: 0, y: 30}}
                    animate={{ opacity: 1, y: 0}}
                    transition={{ duration: 1, delay: 0.3 }}>
                        KaziAdvance helps Kenyan employees access part of their salary they've already earned, reducing financial stress and improving productivity. Not a loan - just early access to your wages.
                    </motion.p>

                    <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    >
                        <a href="/register"
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition"
                        >
                            Get Started Now
                            <BiChevronRight className="w-5 h-5 "/>
                        </a>
                        <button
                        className="bg-white border-green-500 border px-6 py-3 rounded-xl text-lg font-medium hover:bg-green-50 transition text-green-700"
                        >
                            For Employers
                        </button>
                    </motion.div>
                </div>

                <motion.div
                initial={{ opacity: 0, scale: 0.9}}
                animate={{ opacity: 1, scale: 1}}
                transition={{ duration: 1, delay: 0.5}}
                className="flex justify-center">
                    <Image
                    src="/hero-vector.png"
                    alt="business"
                    width={500}
                    height={500} 
                    className="w-full max-w-md lg:max-w-lg"
                    />
                </motion.div>
            </div>
        </section>
    )
}