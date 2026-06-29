"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { label: "Targeted Customers", value: 4650, suffix: "+", prefix: "" },
  { label: "Targeted Companies", value: 5, suffix: "+", prefix: "" },
  { label: "Annual Advances (USD)", value: 4000, suffix: "M", prefix: "$" },
];

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" as const },
});

export default function StatsPanel() {
  const [inView, setInView] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <div className="journey-panel flex h-full w-screen shrink-0 items-center bg-slate-900">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[140px]" />
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 lg:px-16">
        {/* badge */}
        <motion.div {...fadeUp(0)} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-400 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Our Impact
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp(1)}
          className="mb-20 text-center font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
        >
          Connecting Africa{" "}
          <span className="text-green-400">To Fair &amp; Timely Pay</span>
        </motion.h2>

        {/* stat grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(i + 2)}
              onViewportEnter={() => setInView(true)}
              className="group flex flex-col items-center"
            >
              <span className="mb-3 inline-block font-serif text-7xl font-bold tracking-tighter text-white transition-transform duration-500 group-hover:scale-105 sm:text-8xl">
                <span className="bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent group-hover:from-green-400 group-hover:to-green-600">
                  {item.prefix}
                  {inView ? (
                    <CountUp
                      end={item.value}
                      duration={prefersReduced ? 0.01 : 2.5}
                      separator=","
                    />
                  ) : (
                    "0"
                  )}
                  {item.suffix}
                </span>
              </span>
              <p className="text-sm font-black tracking-[0.3em] text-slate-400 uppercase transition-colors group-hover:text-green-400">
                {item.label}
              </p>
              <div className="mt-6 h-px w-10 bg-slate-700 sm:hidden" />
            </motion.div>
          ))}
        </div>

        {/* decorative separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" as const }}
          className="mx-auto mt-20 h-px w-64 origin-center bg-linear-to-r from-transparent via-green-500/40 to-transparent"
        />
      </div>
    </div>
  );
}
