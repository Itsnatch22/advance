'use client'

import { motion } from "framer-motion"
import { Shield, Eye, Timer, CogIcon, CircleDollarSign }  from "lucide-react"

const pricing = [
    { icon: Shield,
      title: "0% Interest Charge",
      desc: "Only a nominal transaction fee applies",
    },
    {
        icon: Eye,
        title: "KES 0 Hidden Fee",
        desc:  "Transparent pricing - what you see is what you pay",
    },
    {
        icon: Timer,
        title: "1-Minute Withdrawal",
        desc: "Money in your employee's account within seconds.",
    },
    {
        icon: CircleDollarSign,
        title: "Transaction Fee",
        desc: "KES 25 – flat fee per withdrawal.",
    },
    {
        icon: CogIcon,
        title: "5% Admin Fee",
        desc:  "Processing / administration fee",
    },
]

export default function Pricing () {
    return(
        <section className="relative py-20 bg-white dark:bg-neutral-950 text-center">
            <div className="max-w-6xl px-6 mx-auto">
                <motion.h2
                initial={{opacity:0 , y:20}}
                whileInView={{opacity: 1, y: 0}}
                className="text-4xl md:text-6xl text-green-700 dark:text-green-600 font-bold font-serif">
                    Fast. Fair. Fully Transparent.
                </motion.h2>

                <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">It&apos;s not a loan, it&apos;s freedom — the freedom to live, plan, and dream without waiting for payday.</p>
            

            <div className="mt-12 grid grid-cols-3 gap-6 place-items-center">
                {pricing.slice(0,3).map((item,i) => (
                    <motion.div
                    key={i}
                    whileHover={{scale: 1.03}}
                    transition={{ type: "spring", stiffness: 200}}
                    className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-6"
                    >
                        <item.icon className="w-10 h-10 mx-auto text-green-600 dark:text-green-400 mb-4" />
                        <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                            {item.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-6 justify-center place-items-center">
                {pricing.slice(3).map((item, i) => (
                    <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-6"
                    >
                    <item.icon className="w-10 h-10 mx-auto text-green-600 dark:text-green-400 mb-4" />
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                        {item.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        {item.desc}
                    </p>
                    </motion.div>
                ))}
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-10 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium shadow-md"
                >
                    Get Started
                </motion.button>
            </div>
            
        </section>
    )
}