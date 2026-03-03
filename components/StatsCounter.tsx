"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatsCounter() {
  const stats = {
    targeted_customers: 4650,
    targeted_companies: 5,
    annual_advances: 4000000000,
  };

  const [inView, setInView] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-white py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-50/50 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Our Impact
          </div>
        </motion.div>

        <motion.h2
          className="mb-24 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Connecting Africa{" "}
          <span className="text-green-600">To Fair & Timely Pay</span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onViewportEnter={() => setInView(true)}
              className="group relative flex flex-col items-center"
            >
              <div className="mb-4">
                <span className="font-serif text-6xl font-bold tracking-tighter text-slate-900 sm:text-7xl lg:text-8xl transition-transform duration-500 group-hover:scale-105 inline-block">
                  <span className="bg-linear-to-b from-slate-900 to-slate-500 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-green-500">
                    {item.prefix}
                    {inView ? (
                      <CountUp end={item.value} duration={3} separator="," />
                    ) : (
                      "0"
                    )}
                    {item.suffix}
                  </span>
                </span>
              </div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-green-600 transition-colors">
                {item.label}
              </p>
              
              {/* aesthetic divider for mobile */}
              <div className="mt-8 h-px w-12 bg-slate-100 sm:hidden" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
