// Works.tsx - Refactored with Needs.tsx UI Flow
"use client";
import { motion } from "framer-motion";
import {
  Calculator,
  PhoneCall,
  RefreshCcw,
  BriefcaseBusiness,
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
      "Access upto 60% of your net earnings. Our platform automatically calculates what you're eligible for.",
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Works() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50/30 py-20 sm:py-24 lg:py-32">
      {/* Ambient background effect */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-100/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Section badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <Sparkles className="h-4 w-4" />
            <span>Simple Process</span>
          </div>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          How EaziWage{" "}
          <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
            Works
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl"
        >
          Access your earnings effortlessly - transparent, secure, and built for
          your financial freedom.
        </motion.p>

        {/* Feature cards grid - 4 columns to match content */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Icon + Step Number */}
              <div className="relative z-10 mb-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="h-7 w-7 text-emerald-600" strokeWidth={2} />
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 -z-10 rounded-xl bg-emerald-400/30 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>

                {/* Step Number */}
                <span className="text-sm font-bold tracking-wider text-emerald-600 uppercase">
                  {step.step}
                </span>
              </div>

              {/* Content */}
              <h3 className="relative z-10 mb-3 text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}