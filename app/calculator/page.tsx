"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Calculator() {
    return(
        <section className="bg-gray-50 py-20 w-full px-6 lg:px-20">
            <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 grid-cols-1">
                <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
                >
                    <h2 className="leading-tight text-gray-800 text-4xl md:text-5xl font-bold mb-6 font-serif">
                        Precision Payroll. Effortless Compliance.
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Eliminate the spreadsheets and manual calculations. Our intelligent PAYE Calculator delivers instant, 
                        KRA-compliant computations for PAYE, NSSF, NHIF, and levies. We ensure absolute accuracy and compliance, 
                        giving your HR and finance teams the freedom to focus on strategic goals—your people and your profits.
                        Experience seamless integration, real-time analytics, and corporate-grade security in one powerful platform. 
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg mt-4">
                        Precision builds trust. Trust drives growth.
                    </p>
                </motion.div>
                <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
                className="flex justify-center"
                >
                    <Image
                    src="/calc.png"
                    alt="Calculator Illustration"
                    width={500}
                    height={400}
                    className="object-contain drop-shadow-lg"
                    />
                </motion.div>
            </div>
        </section>
    )
}