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
        desc: "Earned Wage Access with transparent, no hidden fees; includes up to 5% application fees and no interest, with options for advance salary access."
    },
    {
        icon: Scale,
        title: "Up to 5% Application Fees",
        desc: "A nominal application fee of up to 5% may apply, depending on your eligibility and the amount you wish to access."
    },
]

const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

export default function Pricing () {
    return(
        <section id="pricing" className="relative py-16 sm:py-20 bg-white dark:bg-neutral-950 text-center">
            <div className="max-w-6xl px-4 sm:px-6 mx-auto">
                <motion.h2
                initial={{opacity:0 , y:20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-green-700 dark:text-green-600 font-bold font-serif">
                    Fast. Fair. <span className="text-black dark:text-white">Fully</span> Transparent.
                </motion.h2>

                <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-4 text-gray-600 dark:text-gray-300 text-base sm:text-lg px-4">
                    It&apos;s not a loan, it&apos;s freedom — the freedom to live, plan, and dream without waiting for payday.
                </motion.p>
            

            <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2 justify-items-center">
                {pricing.map((card,i) => (
                    <motion.div
                    key={i}
                    variants={item}
                    whileHover={{scale: 1.05, translateY: -5}}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-full max-w-sm bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900/30 p-6 rounded-2xl shadow hover:shadow-green-500/30 hover:border-green-400 transition-colors"
                    >
                        <div className="w-14 h-14 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                            <card.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white">
                            {card.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                            {card.desc}
                        </p>
                    </motion.div>
                ))}
            </motion.div>

            
                <Link href="/register" className="inline-block">
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mt-8 sm:mt-10 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-full font-medium shadow-md text-sm sm:text-base hover:shadow-lg"
                    >
                        Get Started
                    </motion.button>
                </Link>
            </div>
            
        </section>
    )
}