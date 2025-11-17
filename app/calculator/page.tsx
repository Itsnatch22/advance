"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion"; // 👈 animation import
import Calculator from "./Calc";

export default function CalculatorPage() {
  return (
    <main className="pt-20 sm:pt-20 lg:pt-0 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 transition-colors duration-300">
      
      <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 sm:gap-12">

        {/* LEFT SIDE — TEXT + IMAGE */}
        <div className="flex flex-col lg:w-2/3 w-full gap-6 sm:gap-8 lg:gap-10 lg:sticky lg:top-20">
          
          <div className="flex flex-col sm:flex-col lg:flex-row items-center lg:items-start gap-5 sm:gap-8">
            
            {/* IMAGE — FINAL ANIMATED FLOAT + SPACING FIX */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{
                opacity: 1,
                y: [0, -6, 0],     // continuous hover loop
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
              className="
                relative order-first lg:order-none flex-shrink-0
                w-28 h-28              /* bigger on mobile */
                sm:w-36 sm:h-36
                md:w-48 md:h-48
                lg:w-[220px] lg:h-[220px]

                mt-2 sm:mt-6 lg:mt-0   /* near navbar */
                mb-1                  /* tight to headline */
              "
            >
              <Image
                src="/calc.png"
                alt="EaziWage Calculator Illustration"
                fill
                className="object-contain rounded-2xl drop-shadow-md"
                priority
              />
            </motion.div>

            {/* TEXT */}
            <div className="space-y-3 sm:space-y-4 flex-1 text-center lg:text-left">
              <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-widest text-xs sm:text-sm">
                Smart Salary Insights
              </p>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-snug">
                Precision Wage. <br />
                <span className="text-green-700 dark:text-green-500">
                  Effortless Compliance.
                </span>
              </h1>

              <p className="text-gray-700 dark:text-gray-300 max-w-prose sm:max-w-lg mx-auto lg:mx-0 leading-relaxed text-sm sm:text-lg">
                The{" "}
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  EaziWage Access Calculator
                </span>{" "}
                helps employees estimate their accessible portion of earned wages
                before payday. It&apos;s clarity and confidence — simplified.
              </p>

              <div className="border-l-4 border-green-500 dark:border-green-600 pl-3 text-gray-600 dark:text-gray-400 italic text-xs sm:text-sm bg-green-50/50 dark:bg-green-900/20 rounded-md py-2">
                *The calculated figure is an estimate for informational purposes only. Actual amounts depend on payroll verification, residency and the EaziWage eligibility requirements.
              </div>

              <p className="text-gray-700 dark:text-gray-300 font-medium mt-2 text-xs sm:text-base">
                Precision builds trust. Trust drives growth.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — CALCULATOR */}
        <div className="flex justify-center w-full lg:w-1/3 order-last lg:order-none mt-6 lg:mt-0">
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border w-full max-w-md sm:max-w-lg border-green-100 dark:border-green-800 shadow-2xl shadow-green-200/50 dark:shadow-green-900/30 rounded-3xl p-4 sm:p-6 md:p-8 hover:scale-[1.01] transition-transform duration-300">
            <Calculator />
          </div>
        </div>

      </div>
    </main>
  );
}
