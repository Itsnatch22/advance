'use client'
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useRef } from "react"
import Typed from "typed.js"
import { Highlighter } from "./ui/highlighter"

export default function CTA() {
    const typedRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
            strings: [
                "Transform Your Workplace",
                "Boost Retention & Reduce Turnover",
                "Increase Payroll Efficiency & Compliance",
                "Encourage Punctuality & Attendance",
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
        <section
        className="py-16 sm:py-20 min-h-screen bg-[url('/cta.jpg')] bg-cover bg-center relative flex items-center"
        >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

            <div className="max-w-4xl mx-auto text-center text-white px-4 sm:px-6 relative z-10">
                <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.7}}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl text-white lg:text-5xl font-bold font-serif"
                >
                    Ready To {" "} 
                    <Highlighter action="underline" color="#008000">
                    <span ref={typedRef} className="text-white "/> 
                    </Highlighter>
                    {" "}?
                </motion.h2>
                <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.9, delay: 0.2}}
                viewport={{ once: true }}
                className="mt-4 text-base sm:text-lg md:text-xl text-white/90 px-4 font-medium">
                    Join leading companies already using EaziWage to improve employee satisfaction and reduce turnover.
                </motion.p>

                <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4"
                >
                    <Link href="/schedule">
                        <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ boxShadow: ["0 0 0 0 rgba(255, 255, 255, 0.7)", "0 0 0 10px rgba(255, 255, 255, 0)"] }}
                        transition={{ 
                            boxShadow: { repeat: Infinity, duration: 1.5 },
                            scale: { duration: 0.2 }
                        }}
                        className="px-6 py-3 bg-white text-green-700 font-medium rounded-xl hover:bg-green-50 transition text-center shadow-lg"
                        >
                            Schedule a Demo
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}