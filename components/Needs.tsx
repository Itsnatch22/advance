'use client'
import { motion } from "framer-motion"
import { BiTimer,BiShield,BiUser } from "react-icons/bi";
import { Lock, ChartBar, Phone } from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
const steps = [
    {
        icon: <BiTimer className="w-10 h-10 text-green-600"/>,
        title: "Instant Disbursment",
        description: "Funds available within minutes through M-PESA or bank transfer. No waiting periods or complex approval processes.",
    },
    {
        icon: <BiShield className="w-10 h-10 text-green-600"/>,
        title: "Bank-Grade Security",
        description: "Military-grade encryption ensure your financial data and transactions are completely secure.",
    },
    {
        icon: <BiUser className="w-10 h-10 text-green-600"/>,
        title: "HR Integration",
        description: "Seamless integration with existing payroll systems. Automatic deductions and comprehensive employee management.",
    },
    {
        icon: <Lock className="w-10 h-10 text-green-600"/>,
        title: "Regulatory Compliance",
        description: "Fully compliant with Kenyan financial regulations. Regular audits and updates to ensure adherence to local laws.",
    },
    {
        icon: <ChartBar className="w-10 h-10 text-green-600"/>,
        title: "Real-Time Analytics",
        description: "Detailed insights into loan performance, employee usage patterns, and financial health through an intuitive dashboard.",
    },
    {
        icon: <Phone className="w-10 h-10 text-green-600"/>,
        title: "Mobile Accessibility",
        description: "Access and manage loans directly from your mobile device. User-friendly app designed for on-the-go financial management.",
    }
];

export default function Needs() {
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
                    Built for the Kenyan Market
                </motion.h2>
                <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0}}
                transition={{ duration: 0.9, delay: 0.2}}
                viewport={{ once: true }}
                className="mt-4 text-gray-600 max-w-2xl mx-auto">
                   Enterprise-grade features designed specifically for the Kenyan market, ensuring compliance, security, and seamless integration with local systems.
                </motion.p>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
                                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 text-sm text-center">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}