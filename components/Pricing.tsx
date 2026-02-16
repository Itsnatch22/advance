// Pricing.tsx - Enhanced
"use client";

import { motion } from "framer-motion";
import {
  Percent,
  RefreshCw,
  ReceiptIcon,
  Database,
  ShieldCheck,
  Scale,
} from "lucide-react";

const pricing = [
  {
    icon: Percent,
    title: "0% Interest Charges",
    desc: "Enjoy the freedom of borrowing without the burden of interest. Our transparent fee structure ensures you don't have to pay interest.",
  },
  {
    icon: RefreshCw,
    title: "No Subscription Fees",
    desc: "Access our services without any recurring subscription fees. Pay only for what you use, when you use it.",
  },
  {
    icon: ReceiptIcon,
    title: "Transaction Fees",
    desc: "A small fee applies per transaction to cover processing costs, ensuring you get your funds quickly and securely.",
  },
  {
    icon: Database,
    title: "No Data Retrieval Fees",
    desc: "We believe in transparency. There are no hidden fees for accessing or retrieving your data from our platform.",
  },
  {
    icon: ShieldCheck,
    title: "No Hidden Fees",
    desc: "Earned Wage Access with transparent, no hidden fees; includes up to 5% application fees and no interest, with options for advance salary access.",
  },
  {
    icon: Scale,
    title: "Up to 5% Application Fees",
    desc: "A nominal application fee of up to 5% may apply, depending on your eligibility and the amount you wish to access.",
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-white py-20 text-center sm:py-24 lg:py-32"
    >
      {/* Ambient background */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-100/30 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Transparent Pricing
          </div>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-5 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          Fast. Fair.{" "}
          <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
            Fully Transparent.
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl"
        >
          It&apos;s not a loan, it&apos;s freedom — the freedom to live, plan,
          and dream without waiting for payday.
        </motion.p>

        {/* Pricing cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
        >
          {pricing.map((card, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Icon */}
              <div className="relative z-10 mx-auto mb-6 inline-flex">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
                  <card.icon className="h-8 w-8 text-emerald-600" strokeWidth={2} />
                </div>
              </div>

              {/* Content */}
              <h3 className="relative z-10 mb-3 text-xl font-bold text-slate-900">
                {card.title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-slate-600">
                {card.desc}
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