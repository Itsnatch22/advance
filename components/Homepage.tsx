'use client'
import { BiChevronRight } from "react-icons/bi"
import { useEffect,useRef } from "react"
import gsap from "gsap"
import { motion } from 'framer-motion'
import Link from "next/link"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Typed from "typed.js"

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const textRef = useRef(null);
    const typedRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            textRef.current,
            { y: 50, opacity: 0},
            { y: 0, opacity: 1, duration: 3, ease: 'power3.out'}
        );

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
        <section className="relative h-screen flex items-center justify-center text-white bg-[url('/homepage/background.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 to-transparent"></div>
            <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
                <div
                ref={textRef}
                className="space-y-6 relative">
                    <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.2 }} 
                    className="text-4xl lg:text-6xl font-bold text-black leading-tight font-serif">
                        Access Your <span ref={typedRef} className="text-white underline"/> {""} Before PayDay
                    </motion.h1>
                    <motion.p
                    className="max-w-lg text-lg"
                    initial={{ opacity: 0, y: 30}}
                    animate={{ opacity: 1, y: 0}}
                    transition={{ duration: 1, delay: 0.3 }}>
                        EaziWage helps employees access a portion of their salary they&apos;ve already earned, anytime! Reduce financial stress, improve
                        productivity and retain top talent - just EaziWage it.
                    </motion.p>
                    <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    >
                        <Link href="/register"
                        className="flex items-center gap-2 dark:bg-black bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition"
                        >
                            Get Started Now
                            <BiChevronRight className="w-5 h-5 "/>
                        </Link>
                        <Link href="/employers"
                        className="bg-transparent gap-2 flex items-center border-green-500 border px-6 py-3 rounded-xl text-lg font-medium hover:bg-green-50 text-white hover:text-green-700 ease-in-out transition-colors"
                        >
                            For Employers
                            <BiChevronRight className="w-5 h-5"/>
                        </Link>
                    </motion.div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="animate-bounce flex flex-col items-center">
                    <span className="text-sm text-white mb-2">Scroll Down</span>
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white rounded-full mt-2" />
                    </div>
                    </div>
                </div>
            </div>
        </section>
    )
}