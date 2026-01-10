"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // 👈 animation import
import Calculator from "./Calc";

export default function CalculatorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-8 pt-20 transition-colors duration-300 sm:px-6 sm:py-12 sm:pt-20 lg:pt-0 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-8 sm:gap-12 lg:flex-row lg:items-start">
        {/* LEFT SIDE — TEXT + IMAGE */}
        <div className="flex w-full flex-col gap-6 sm:gap-8 lg:sticky lg:top-20 lg:w-2/3 lg:gap-10">
          <div className="flex flex-col items-center gap-5 sm:flex-col sm:gap-8 lg:flex-row lg:items-start">
            {/* IMAGE — FINAL ANIMATED FLOAT + SPACING FIX */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{
                opacity: 1,
                y: [0, -6, 0], // continuous hover loop
                scale: 1,
              }}
              transition={{
                opacity: { duration: 0.8 },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1], // bounce
                },
              }}
              className="/* bigger on mobile */ /* near navbar */ /* tight to headline */ relative order-first mt-2 mb-1 h-28 w-28 flex-shrink-0 sm:mt-6 sm:h-36 sm:w-36 md:h-48 md:w-48 lg:order-none lg:mt-0 lg:h-[220px] lg:w-[220px]"
            >
              <Image
                src="/calc.png"
                alt="EaziWage Calculator Illustration"
                fill
                className="rounded-2xl object-contain drop-shadow-md"
                priority
              />
            </motion.div>

            {/* TEXT */}
            <div className="flex-1 space-y-3 text-center sm:space-y-4 lg:text-left">
              <p className="text-xs font-semibold tracking-widest text-green-600 uppercase sm:text-sm dark:text-green-400">
                Smart Salary Insights
              </p>

              <h1 className="text-2xl leading-snug font-extrabold text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
                Precision Wage. <br />
                <span className="text-green-700 dark:text-green-500">
                  Effortless Compliance.
                </span>
              </h1>

              <p className="mx-auto max-w-prose text-sm leading-relaxed text-gray-700 sm:max-w-lg sm:text-lg lg:mx-0 dark:text-gray-300">
                The{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  EaziWage Access Calculator
                </span>{" "}
                helps employees estimate their accessible portion of earned
                wages before payday. It&apos;s clarity and confidence —
                simplified.
              </p>

              <div className="rounded-md border-l-4 border-green-500 bg-green-50/50 py-2 pl-3 text-xs text-gray-600 italic sm:text-sm dark:border-green-600 dark:bg-green-900/20 dark:text-gray-400">
                *The calculated figure is an estimate for informational purposes
                only. Actual amounts depend on payroll verification, residency
                and the EaziWage eligibility requirements.
              </div>

              <p className="mt-2 text-xs font-medium text-gray-700 sm:text-base dark:text-gray-300">
                Precision builds trust. Trust drives growth.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — CALCULATOR */}
        <div className="order-last mt-6 flex w-full justify-center lg:order-none lg:mt-0 lg:w-1/3">
          <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white/80 p-4 shadow-2xl shadow-green-200/50 backdrop-blur-xl transition-transform duration-300 hover:scale-[1.01] sm:max-w-lg sm:p-6 md:p-8 dark:border-green-800 dark:bg-gray-900/60 dark:shadow-green-900/30">
            <Calculator />
          </div>
        </div>
      </div>
    </main>
  );
}
