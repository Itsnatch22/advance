'use client'
import { motion } from "framer-motion"
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Calculator, PhoneCall, RefreshCcw, BriefcaseBusiness } from "lucide-react";
const steps = [
    {
        icon: BriefcaseBusiness,
        step: 1,
        title: "Work Your Days",
        description: "Continue working as normal. Our system tracks the days you've worked and calculates your earned wages based on your earnings potential.",
    },
    {
        icon: Calculator,
        step: 2,
        title: "Calculate Advance",
        description: "Access upto 60% of your net earnings. Our platform automatically calculates what you're eligible for.",
    },
    {
        icon: PhoneCall,
        step: 3,
        title: "Request Your Advance",
        description: "Submit your request through our platform. Funds are disbursed instantly to your mobile or bank account.",
    },
    {
        icon: RefreshCcw,
        step: 4,
        title: "Automatic Repayments",
        description: "The advance is automatically deducted when your salary is processed. No manual repayments required.",
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
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-neutral-950 transition-colors duration-500">
  <div ref={cardRef} className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
    {/* === Title === */}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gray-900 dark:text-white"
    >
      How EaziWage <span className="text-green-700 dark:text-emerald-400">Works</span>
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      viewport={{ once: true }}
      className="mt-4 sm:mt-5 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-4"
    >
      Access your earnings effortlessly - transparent, secure, and built for your financial freedom.
    </motion.p>

    {/* === Steps Grid === */}
    <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
      {steps.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: i * 0.2 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900/30 p-6 rounded-2xl shadow hover:shadow-green-500/30 hover:border-green-400 transition transform hover:-translate-y-2"
        >
          <div className="flex flex-col items-center gap-5">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-500/20 blur-xl"></div>
              <item.icon className="w-12 h-12 text-black dark:text-white relative z-10"
              />
            </div>

            {/* Step Label */}
            <span className="font-bold text-green-600 dark:text-emerald-400 text-sm tracking-wide uppercase">
              {item.step}
            </span>

            {/* Title + Description */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-serif">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base text-center leading-relaxed">
              {item.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

    )
}