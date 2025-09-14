'use client'
import { motion } from "framer-motion"
import Link from "next/link"

export default function CTA() {
    return(
        <section
        className="py-20 bg-gradient-to-r from-green-500 via-green-400 to-green-600"
        >
            <div className="max-w-4xl mx-auto text-center text-white px-6">
                <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.7}}
                viewport={{ once: true }}
                className="text-3xl  lg:text-5xl font-bold"
                >
                    Ready To Transform Your Workplace?
                </motion.h2>
                <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.9, delay: 0.2}}
                viewport={{ once: true }}
                className="mt-4 text-lg md:text-xl">
                    Join leading Kenyan companies already using KaziAdvance to improve employee satisfaction and reduce turnover.
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
                    <Link href="/case-studies"className="px-6 py-3 bg-green-700 text-white font-medium rounded-xl hover:bg-green-800 transition">
                        View Case Studies
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}