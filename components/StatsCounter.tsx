"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import CountUp from "react-countup";

export default function StatsCounter() {
  const stats = {
    targeted_customers: 4650,
    targeted_companies: 5,
    annual_advances: 4000000000,
  };

  const [inView,setInView] = useState(false);

  return (
    <motion.section
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 40 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true }}
  className="relative w-full py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-neutral-950 text-black dark:text-white text-center overflow-hidden"
>
  {/* Subtle gradient background for aura */}
  <div className="absolute inset-0 bg-gradient-to-b from-green-600/5 via-transparent to-emerald-500/5 dark:from-emerald-400/10 dark:via-transparent dark:to-green-500/5 blur-2xl"></div>

  {/* === Section Title === */}
  <motion.h2
    className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif mb-6 sm:mb-8 relative z-10 px-4"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    Connecting Africa <span className="text-green-600 dark:text-emerald-400">To Fair & Timely Pay</span>
  </motion.h2>

  {/* === Stats Grid === */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
    {[
      { label: "Targeted Customers", value: stats.targeted_customers, suffix: "+", color: "text-green-600" },
      { label: "Targeted Companies", value: stats.targeted_companies, suffix: "+", color: "text-green-600" },
      { label: "Annual Advances (USD)", value: stats.annual_advances / 1000000, suffix: "K", color: "text-green-600" },
    ].map((item, i) => (
      <motion.div
        key={i}
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 150 }}
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => setInView(true)}
        onViewportLeave={() => setInView(false)}
        className="bg-white dark:bg-neutral-900 rounded-2xl py-8 sm:py-10 shadow-sm border border-gray-100 dark:border-neutral-800"
      >
        <h3 className={`text-4xl sm:text-5xl font-bold ${item.color}`}>
          {inView ? (
          <CountUp end={item.value} duration={3.5} />
          ) : (
            <span>0</span>
          )}{item.suffix}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-base sm:text-lg font-medium px-2">{item.label}</p>
      </motion.div>
    ))}
  </div>
</motion.section>
  );
}
