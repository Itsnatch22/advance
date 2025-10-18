"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import Calc from "./Calc"

export default function Calculator() {
    return(
        <section className="bg-gray-50 dark:bg-black py-20 w-full px-6 ">
            <Calc />
            
            <div className="relative mx-auto max-w-6xl px-6 grid lg:grid-cols-2 grid-cols-1 gap-12 mt-10">
  {/* Left Side Text */}
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <p className="uppercase tracking-widest text-green-600 font-semibold mb-3">
      Smart Salary Insights
    </p>

    <h2 className="leading-tight text-gray-800 dark:text-white text-4xl md:text-5xl font-bold mb-6 font-serif">
      <span className="bg-gradient-to-r from-green-700 to-gray-700 bg-clip-text text-transparent">
        Precision Wage.
      </span>{" "}
      Effortless Compliance.
    </h2>

    <p className="text-gray-600 leading-relaxed text-lg dark:text-gray-300">
      The <span className="text-green-600 font-medium">EaziWage Access Calculator</span> helps employees
      understand their potential eligibility and accessible portion of earned wages before payday.
      It provides clarity, flexibility, and transparency—giving you the confidence to plan ahead.
    </p>

    <div className="mt-6 border-l-4 border-green-500 pl-4 bg-green-50/40 dark:bg-green-900/20 rounded-md">
      <p className="text-gray-700 dark:text-white text-sm leading-relaxed italic">
        *The calculated figure is an estimate provided for informational purposes only. Final wage amounts depend on payroll verification, deductions, and company policies.*
      </p>
    </div>

    <p className="text-gray-600 leading-relaxed text-lg mt-6 dark:text-gray-400 italic">
      Precision builds trust. Trust drives growth.
    </p>
  </motion.div>

  {/* Right Side Image */}
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    className="relative flex justify-center"
    animate={{ y: [0, -8, 0] }}
    transition={{
      opacity: { duration: 0.8, ease: "easeOut" },
      x: { duration: 0.8, ease: "easeOut" },
      y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
    }}
  >
    <div className="absolute w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl top-12"></div>
    <Image
      src="/calc.png"
      alt="Calculator Illustration"
      width={500}
      height={400}
      className="object-contain drop-shadow-xl relative z-10"
    />
  </motion.div>
</div>

        </section>
    )
}