"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import Calc from "./Calc"

export default function Calculator() {
    return(
        <section className="bg-gray-50 dark:bg-black py-20 w-full px-6 ">
            <Calc />
            
            <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 grid-cols-1">
                <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
                >
                    <h2 className="leading-tight text-gray-800 dark:text-green-500 text-4xl md:text-5xl font-bold mb-6 font-serif">
                        Precision Wage. Effortless Compliance.
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg dark:text-white">
                        The EaziWage Access Calculator is designed to help employees understand their potential eligibility and accessible portion of earned wages before payday.
                        It provides quick insight into what you may be able to claim based on your work period, 
                        pay rate, and company payout policies giving you more financial clarity and flexibility when you 
                        need it most.</p>
                    <p className="text-gray-600 leading-relaxed text-lg mt-4 dark:text-white">
                        Disclaimer:
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg mt-4 dark:text-white">
                        The calculated figure is a tentative estimate provided for informational purposes only. 
                        It does not represent a confirmed or guaranteed amount. Actual eligibility and disbursed values 
                        may vary depending on: Verified payroll data, Deductions and statutory contributions, Company 
                        specific early wage access policies.</p>
                    <p className="text-gray-600 leading-relaxed text-lg mt-4 dark:text-white">
                        All final wage amounts are determined after internal validation and approval by your 
                        employer or payroll provider.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg mt-4 dark:text-white">
                        Precision builds trust. Trust drives growth.
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