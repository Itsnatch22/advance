'use client'
import { motion } from "framer-motion"
import { FiCalendar, FiClipboard, FiPhone, FiCheckCircle } from "react-icons/fi"
import gsap from "gsap";
import { useEffect, useRef } from "react";
import Link from "next/link";
const steps = [
    {
        icon: <FiCalendar className="w-10 h-10 text-green-600"/>,
        step: 1,
        title: "Work Your Days",
        description: "Continue working as normal. Our system tracks the days you've worked and calculates your earned wages based on your salary earning.",
    },
    {
        icon: <FiClipboard className="w-10 h-10 text-green-600"/>,
        step: 2,
        title: "Calculate Available Amount",
        description: "Access upto 50% of your earned wages.The platform automatically calculates what you're eligible for.",
    },
    {
        icon: <FiPhone className="w-10 h-10 text-green-600"/>,
        step: 3,
        title: "Request Your Advance",
        description: "Submit your request through our platform. Funds are disbursed instantly to your M-PESA or bank account.",
    },
    {
        icon: <FiCheckCircle className="w-10 h-10 text-green-600"/>,
        step: 4,
        title: "Automatic Repayments",
        description: "Amount is automatically deducted when your salary is processed. No manual repayments required.",
    },
];

export default function Works() {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current, 
            {y: -50, opacity: 0},
            {y: 0, opacity: 1, duration: 1.2, ease: "power2.out"}
        )
    })
    return(
        <section className="py-20 bg-gray-50">
            <div ref={cardRef} className="max-w-6xl mx-auto px-6 text-center">
                <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.7}}
                viewport={{ once: true }}
                className="text-4xl font-bold text-gray-900 font-serif">
                    How EaziWage <span className="text-green-600">Works</span>
                </motion.h2>
                <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.9, delay: 0.2}}
                viewport={{ once: true }}
                className="mt-4 text-gray-600 max-w-2xl mx-auto">
                    EaziWage makes accessing your earnings simple, transparent, and stress-free. Here&apos;s how you can take control of your pay in just a few steps.
                </motion.p>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {steps.map((item,i) => (
                        <motion.div
                        key={i}
                        initial={{opacity:0,y:40}}
                        whileInView={{opacity: 1,y: 0}}
                        transition={{duration: 0.6, delay: i * 0.2}}
                        viewport={{once:true}}
                        className="bg-white p-6 rounded-2xl shadow hover:shadow-green-400/40 transition transform hover:-translate-y-2"
                        >
                            <div className="flex flex-col items-center gap-4">
                                {item.icon}
                                <span className="text-sm font-medium text-green-600">{item.step}</span>
                                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 text-sm text-center">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Link
                href="/how-it-works"
                className="mt-10 inline-block text-green-600 hover:underline text-lg font-bold"
                >
                    View how our system works in details 
                </Link>
            </div>
        </section>
    )
}