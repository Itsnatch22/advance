"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Calculator from "./Calc";
import { FloatingOrb } from "@/components/shared/FloatingOrb";

export default function CalculatorPage() {
  return (
    <main className="relative overflow-hidden bg-white">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb color="bg-green-100" delay={0} className="left-[10%] top-[-10%]" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="right-[10%] bottom-[10%]" />
      </div>

      {/* Hero section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">

          {/* Left — text */}
          <div className="max-w-2xl lg:sticky lg:top-24">
            {/* Eyebrow badge — identical pattern to all other pages */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Smart Salary Insights
            </div>

            {/* Heading */}
            <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Precision Wage.{" "}
              <span className="mt-2 block bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                Effortless Compliance.
              </span>
            </h1>

            <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-600 sm:text-lg">
              The{" "}
              <span className="font-semibold text-emerald-700">
                EaziWage Access Calculator
              </span>{" "}
              helps employees estimate their accessible portion of earned wages
              before payday — clarity and confidence, simplified.
            </p>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
              transition={{
                opacity: { duration: 0.8, ease: "easeOut" },
                y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              }}
              className="relative mt-8 hidden h-48 w-48 lg:block"
            >
              <div className="absolute -inset-4 rounded-full bg-linear-to-br from-emerald-100/40 via-green-100/30 to-transparent blur-2xl" />
              <Image
                src="/calc.png"
                alt="EaziWage Calculator"
                fill
                className="relative z-10 object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>

            {/* Disclaimer */}
            <div className="mt-8 rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50/50 to-green-50/30 p-4 ring-1 ring-emerald-500/5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-500/10">
                  <svg className="h-3.5 w-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="flex-1 text-xs leading-relaxed text-slate-600">
                  The calculated figure is an estimate for informational purposes
                  only. Actual amounts depend on payroll verification, residency,
                  and EaziWage eligibility requirements.
                </p>
              </div>
            </div>

            {/* Trust indicators — same pattern as employees page */}
            <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-slate-200/60 pt-6 text-sm text-slate-700">
              {["Pan-Africa Ready", "Data Protection", "No Interest Charges"].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-500/10">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — calculator (no extra card wrapper; Calc.tsx is the card) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex w-full justify-center"
          >
            <Calculator />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
