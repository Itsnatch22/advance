"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Calculator from "./Calc";

export default function CalculatorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-linear-to-b from-slate-50 via-white to-slate-50/30 px-4 py-12 pt-24 sm:px-6 sm:py-16 lg:px-8 lg:pt-32">
      <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-10 sm:gap-14 lg:flex-row lg:items-start lg:gap-16">
        
        {/* LEFT SIDE – Enhanced text + image section */}
        <div className="flex w-full flex-col gap-8 sm:gap-10 lg:sticky lg:top-24 lg:w-3/5 lg:gap-12">
          <div className="flex flex-col items-center gap-6 sm:flex-col sm:gap-8 lg:flex-row lg:items-start lg:gap-10">
            
            {/* IMAGE – Enhanced with refined animation and styling */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: [0, -8, 0],
                scale: 1,
              }}
              transition={{
                opacity: { duration: 0.8, ease: "easeOut" },
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              className="relative order-first mt-0 h-32 w-32 shrink-0 sm:h-40 sm:w-40 md:h-52 md:w-52 lg:order-0 lg:h-64 lg:w-64"
            >
              {/* Ambient glow behind image */}
              <div className="absolute -inset-4 rounded-full bg-linear-to-br from-emerald-100/40 via-green-100/30 to-transparent blur-2xl"></div>
              
              <Image
                src="/calc.png"
                alt="EaziWage Calculator Illustration"
                fill
                className="relative z-10 rounded-2xl object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* TEXT – Enhanced typography and styling */}
            <div className="flex-1 space-y-4 text-center sm:space-y-5 lg:text-left">
              {/* Enhanced eyebrow badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Smart Salary Insights
                </div>
              </div>

              {/* Enhanced heading with gradient accent */}
              <h1 className="font-serif text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Precision Wage. <br />
                <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Effortless Compliance.
                </span>
              </h1>

              {/* Enhanced description with better contrast */}
              <p className="mx-auto max-w-prose text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0 lg:text-xl lg:leading-relaxed">
                The{" "}
                <span className="font-semibold text-emerald-700">
                  EaziWage Access Calculator
                </span>{" "}
                helps employees estimate their accessible portion of earned
                wages before payday. It&apos;s clarity and confidence —
                simplified.
              </p>

              {/* Enhanced disclaimer card */}
              <div className="rounded-xl border border-emerald-100 bg-linear-to-br from-emerald-50/50 to-green-50/30 p-4 shadow-sm ring-1 ring-emerald-500/5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-500/10">
                    <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    The calculated figure is an estimate for informational purposes
                    only. Actual amounts depend on payroll verification, residency
                    and the EaziWage eligibility requirements.
                  </p>
                </div>
              </div>

              {/* Enhanced trust statement */}
              <p className="text-sm font-semibold text-slate-700 sm:text-base">
                Precision builds trust. Trust drives growth.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – Enhanced calculator card */}
        <div className="order-last mt-8 flex w-full justify-center lg:order-0 lg:mt-0 lg:w-2/5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Enhanced calculator container with premium card treatment */}
            <div className="relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 rounded-3xl bg-linear-to-br from-emerald-100/50 via-green-100/30 to-transparent blur-xl"></div>
              
              <div className="relative rounded-3xl border border-slate-200/60 bg-white p-6 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 transition-all duration-300 hover:shadow-emerald-500/10 sm:p-8 lg:p-10">
                <Calculator />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}