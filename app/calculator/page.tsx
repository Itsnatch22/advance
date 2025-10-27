"use client";
import React from "react";
import Image from "next/image";
import Calculator from "./Calc";

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-7xl w-full flex flex-col-reverse lg:flex-row justify-between items-stretch lg:items-center gap-8 sm:gap-12 lg:gap-10">
        
        {/* Left Side — Text + Image (now below calculator on mobile) */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start w-full lg:w-2/3 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Image — slightly smaller for mobile + aligned for balance */}
          <div className="relative flex-shrink-0 w-28 h-28 xs:w-36 xs:h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-[260px] lg:h-[260px] flex justify-center lg:justify-start">
            <Image
              src="/calc.png"
              alt="EaziWage Calculator Illustration"
              fill
              className="object-contain rounded-2xl drop-shadow-md lg:drop-shadow-lg"
              priority
            />
          </div>

          {/* Text Content — tighter spacing on mobile */}
          <div className="space-y-3 sm:space-y-4 flex-1 text-center lg:text-left px-1 sm:px-0">
            <p className="text-green-600 dark:text-green-400 font-semibold uppercase tracking-widest text-xs sm:text-sm">
              Smart Salary Insights
            </p>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-snug">
              Precision Wage. <br className="hidden sm:block" />
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

            <div className="border-l-4 border-green-500 dark:border-green-600 pl-3 text-gray-600 dark:text-gray-400 italic text-xs sm:text-sm max-w-prose sm:max-w-md mx-auto lg:mx-0 bg-green-50/50 dark:bg-green-900/20 rounded-md py-2">
              *The calculated figure is an estimate for informational purposes only. Actual amounts depend on payroll verification.
            </div>

            <p className="text-gray-700 dark:text-gray-300 font-medium mt-2 text-xs sm:text-base">
              Precision builds trust. Trust drives growth.
            </p>
          </div>
        </div>

        {/* Right Side — Calculator (shows on top for mobile) */}
        <div className="flex justify-center w-full lg:w-1/3 order-first lg:order-none">
          <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border w-full max-w-md sm:max-w-lg border-green-100 dark:border-green-800 shadow-2xl shadow-green-200/50 dark:shadow-green-900/30 rounded-3xl p-4 sm:p-6 md:p-8 hover:scale-[1.01] transition-transform duration-300">
            <Calculator />
          </div>
        </div>
      </div>
    </main>
  );
}
