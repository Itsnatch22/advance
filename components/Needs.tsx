'use client'
import { motion } from "framer-motion"
import Image from "next/image"
import gsap from "gsap";
import { useEffect, useRef } from "react";
const steps = [
    {
        icon: "/work/disbursement.png",
        title: "Instant Disbursment",
        description: "Funds available within minutes through mobile money or bank transfer. No waiting periods or complex approval processes.",
    },
    {
        icon: "/work/security.png",
        title: "Bank-Grade Security",
        description: "Military-grade encryption to ensure your financial data and transactions are completely secure.",
    },
    {
        icon: "/work/hr.png",
        title: "HR Integration",
        description: "Seamless integration with existing payroll systems. Automatic deductions and comprehensive employee management.",
    },
    {
        icon: "/work/regulatory.png",
        title: "Regulatory Compliance",
        description: "Fully compliant with local financial and data regulations. Regular audits and updates to ensure adherence to local laws.",
    },
    {
        icon: "/work/analysis.png",
        title: "Real-Time Analytics",
        description: "Detailed insights into employee earned wage usage patterns and financial health through an intuitive dashboard.",
    },
    {
        icon: "/work/access.png",
        title: "Mobile Accessibility",
        description: "Access and manage earned wages directly from your mobile device. User-friendly app designed for on-the-go financial management.",
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
        <section className="relative py-20 bg-gradient-to-b from-gray-50 via-green-50/10 to-gray-50 dark:from-black dark:to-gray-900">
  <div ref={cardRef} className="max-w-6xl mx-auto px-6 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-4xl font-bold text-gray-900 dark:text-white font-serif"
    >
      Built for the <span className="text-green-600">African Workforce</span>
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      viewport={{ once: true }}
      className="mt-4 text-gray-600 dark:text-white max-w-2xl mx-auto text-lg"
    >
      Enterprise-grade fintech built for Kenya - compliant, secure, and fully integrated with local banking
      and mobile money systems.
    </motion.p>
    <p className="text-sm mt-2 text-gray-400 dark:text-gray-500 italic">
      Integrated with mobile money applications, payroll providers & leading banks.
    </p>

    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {steps.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900/30 p-6 rounded-2xl shadow hover:shadow-green-500/30 hover:border-green-400 transition transform hover:-translate-y-2"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Image
                src={item.icon}
                alt={item.title}
                width={80}
                height={80}
                className="mb-4 object-contain"
              />
              <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-30 bg-green-400 transition"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

    )
}