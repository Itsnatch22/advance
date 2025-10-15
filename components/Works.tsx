'use client'
import { motion } from "framer-motion"
import gsap from "gsap";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
const steps = [
    {
        icon: "/work/work.png",
        step: 1,
        title: "Work Your Days",
        description: "Continue working as normal. Our system tracks the days you've worked and calculates your earned wages based on your earnings potential.",
    },
    {
        icon: "/work/calculate.png",
        step: 2,
        title: "Calculate Available Amount",
        description: "Access upto 60% of your net earnings. Our platform automatically calculates what you're eligible for.",
    },
    {
        icon: "/work/request.png",
        step: 3,
        title: "Request Your Advance",
        description: "Submit your request through our platform. Funds are disbursed instantly to your M-PESA or bank account.",
    },
    {
        icon: "/work/repayment.png",
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
                className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
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
                            <div className="flex flex-col items-center gap-4 mt-10">
                                <Image
                                src={item.icon}
                                alt={item.title}
                                width={80}
                                height={80}
                                className="mb-4 object-contain"
                                />
                                <span className="text-sm font-medium text-green-600">{item.step}</span>
                                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 text-lg text-center">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}