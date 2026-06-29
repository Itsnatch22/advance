"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Calculator,
  PhoneCall,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: BriefcaseBusiness,
    step: 1,
    title: "Work Your Days",
    description:
      "Continue working as normal. Our system tracks the days you've worked and calculates your earned wages based on your earnings potential.",
  },
  {
    icon: Calculator,
    step: 2,
    title: "Calculate Advance",
    description:
      "Access up to 60% of your net earnings. Our platform automatically calculates what you're eligible for.",
  },
  {
    icon: PhoneCall,
    step: 3,
    title: "Request Your Advance",
    description:
      "Submit your request through our platform. Funds are disbursed instantly to your mobile or bank account.",
  },
  {
    icon: RefreshCcw,
    step: 4,
    title: "Automatic Repayments",
    description:
      "The advance is automatically deducted when your salary is processed. No manual repayments required.",
  },
];

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
});

export default function WorksPanel() {
  return (
    <div className="journey-panel flex h-full w-screen shrink-0 items-center bg-slate-50/50">
      <div className="mx-auto w-full max-w-7xl px-8 lg:px-16">
        {/* header */}
        <motion.div {...fadeUp(0)} className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Simple Process
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp(1)}
          className="mb-4 text-center font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl"
        >
          How EaziWage <span className="text-green-600">Works</span>
        </motion.h2>

        <motion.p
          {...fadeUp(2)}
          className="mx-auto mb-14 max-w-2xl text-center text-lg leading-relaxed text-slate-500"
        >
          Access your earnings effortlessly — transparent, secure, and built for
          your financial freedom.
        </motion.p>

        {/* step cards */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div key={i} {...fadeUp(i + 3)}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-7 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10">
                {/* icon */}
                <div className="relative mb-6 self-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
                    <step.icon className="h-7 w-7 text-green-600" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-black text-white shadow ring-2 ring-white">
                    {step.step}
                  </div>
                </div>
                <h3 className="mb-2 text-center text-lg font-bold text-slate-900 transition-colors group-hover:text-green-700">
                  {step.title}
                </h3>
                <p className="text-center text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
