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
        className="py-20 bg-[url('/cta.jpg')] bg-cover bg-center relative"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 to-transparent"></div>
            <div className="max-w-4xl mx-auto text-center text-white px-6 relative">
                <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.7}}
                viewport={{ once: true }}
                className="text-3xl text-white dark:text-black lg:text-5xl font-bold font-serif"
                >
                    Ready To {" "} 
                    <Highlighter action="underline" color="#008000">
                    <span ref={typedRef} className="dark:text-white text-black"/> 
                    </Highlighter>
                    {" "}?
                </motion.h2>
                <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.9, delay: 0.2}}
                viewport={{ once: true }}
                className="mt-4 text-lg md:text-xl dark:text-black">
                    Join leading Kenyan companies already using EaziWage to improve employee satisfaction and reduce turnover.
                </motion.p>

                <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Link href="/schedule" className="px-6 py-3 bg-white text-green-700 font-medium rounded-xl hover:bg-green-50 transition">
                        Schedule a Demo
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}