'use client'

import { motion } from "framer-motion"
import Link from "next/link";
import { Percent, RefreshCw, ReceiptIcon, Database, ShieldCheck, Scale }  from "lucide-react"

const pricing = [
    {
        icon: Percent,
        title: "0% Interest Charges",
        desc: "Enjoy the freedom of borrowing without the burden of interest. Our transparent fee structure ensures you don't have to pay interest."
    },
    {
        icon: RefreshCw,
        title: "No Subscription Fees",
        desc: "Access our services without any recurring subscription fees. Pay only for what you use, when you use it."
    },
    {
        icon: ReceiptIcon,
        title: "Transaction Fees",
        desc: "A small fee applies per transaction to cover processing costs, ensuring you get your funds quickly and securely."
    },
    {
        icon: Database,
        title: "No Data Retrieval Fees",
        desc: "We believe in transparency. There are no hidden fees for accessing or retrieving your data from our platform."
    },
    {
        icon: ShieldCheck,
        title: "No Hidden Fees",
        desc: "We pride ourselves on our transparent pricing model. What you see is what you get, no surprises, no hidden costs."
    },
    {
        icon: Scale,
        title: "Up to 5% Application Fees",
        desc: "A nominal application fee of up to 5% may apply, depending on your eligibility and the amount you wish to access."
    },
]

export default function Pricing () {
    return(
        <section className="relative py-16 sm:py-20 bg-white dark:bg-neutral-950 text-center">
            <div className="max-w-6xl px-4 sm:px-6 mx-auto">
                <motion.h2
                initial={{opacity:0 , y:20}}
                whileInView={{opacity: 1, y: 0}}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-green-700 dark:text-green-600 font-bold font-serif">
                    Fast. Fair. Fully Transparent.
                </motion.h2>

                <p className="mt-4 text-gray-600 dark:text-gray-300 text-base sm:text-lg px-4">It&apos;s not a loan, it&apos;s freedom — the freedom to live, plan, and dream without waiting for payday.</p>
            

            <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2 justify-items-center">
                {pricing.map((item,i) => (
                    <motion.div
                    key={i}
                    whileHover={{scale: 1.03}}
                    transition={{ type: "spring", stiffness: 200}}
                    className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-5 sm:p-6"
                    >
                        <item.icon className="w-9 h-9 sm:w-10 sm:h-10 mx-auto text-black dark:text-white mb-4" />
                        <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white">
                            {item.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            
                <Link href="/register" className="inline-block">
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mt-8 sm:mt-10 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-full font-medium shadow-md text-sm sm:text-base"
                    >
                        Get Started
                    </motion.button>
                </Link>
            </div>
            
        </section>
    )
}