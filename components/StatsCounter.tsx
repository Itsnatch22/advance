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

  const [inView, setInView] = useState(false);

  return (
    <motion.section
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full overflow-hidden bg-linear-to-b from-white via-slate-50/50 to-white py-20 text-center sm:py-24 lg:py-32"
    >
      {/* Enhanced ambient background */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-linear-to-br from-emerald-100/40 via-green-100/30 to-transparent blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-50/40 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Our Impact
          </div>
        </motion.div>

        {/* Enhanced heading */}
        <motion.h2
          className="mb-12 px-4 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:mb-16 sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Connecting Africa{" "}
          <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
            To Fair & Timely Pay
          </span>
        </motion.h2>

        {/* Enhanced stats grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 lg:gap-10">
          {[
            {
              label: "Targeted Customers",
              value: stats.targeted_customers,
              suffix: "+",
            },
            {
              label: "Targeted Companies",
              value: stats.targeted_companies,
              suffix: "+",
            },
            {
              label: "Annual Advances (USD)",
              value: stats.annual_advances / 1000000,
              suffix: "M",
              prefix: "$",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onViewportEnter={() => setInView(true)}
              onViewportLeave={() => setInView(false)}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10 sm:p-10"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Decorative element */}
              <div className="absolute right-4 top-4 h-12 w-12 rounded-full bg-linear-to-br from-emerald-100/50 to-green-100/30 opacity-50 blur-xl transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Count value */}
              <h3 className="relative z-10 mb-3 font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {item.prefix}
                  {inView ? (
                    <CountUp end={item.value} duration={3.5} separator="," />
                  ) : (
                    <span>0</span>
                  )}
                  {item.suffix}
                </span>
              </h3>

              {/* Label */}
              <p className="relative z-10 text-base font-semibold text-slate-600 sm:text-lg">
                {item.label}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}