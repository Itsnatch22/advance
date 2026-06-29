"use client";

import React from "react";
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
    desc: "Earned Wage Access with transparent fees; includes up to 5% application fees and no interest, with options for advance salary access.",
  },
  {
    icon: Scale,
    title: "Up to 5% Application Fees",
    desc: "A nominal application fee of up to 5% may apply, depending on your eligibility and the amount you wish to access.",
  },
];

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
});

export default function PricingPanel() {
  return (
    <div id="pricing" className="journey-panel flex h-full w-screen shrink-0 items-center bg-slate-50/70">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-green-50/60 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 lg:px-16">
        {/* header */}
        <motion.div {...fadeUp(0)} className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Transparent Pricing
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp(1)}
          className="mb-3 text-center font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl"
        >
          Fast. Fair.{" "}
          <span className="text-green-600">Fully Transparent.</span>
        </motion.h2>

        <motion.p
          {...fadeUp(2)}
          className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-slate-500"
        >
          It&apos;s not a loan, it&apos;s freedom — the freedom to live, plan,
          and dream without waiting for payday.
        </motion.p>

        {/* pricing grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {pricing.map((card, i) => (
            <motion.div key={i} {...fadeUp(i + 3)}>
              <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-6 text-center backdrop-blur-xl transition-shadow duration-500 hover:shadow-xl hover:shadow-green-500/10">
                <div className="mb-5">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
                    <card.icon className="h-7 w-7 text-green-600" strokeWidth={1.5} />
                    <div className="absolute inset-0 rounded-2xl bg-green-400/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900 transition-colors group-hover:text-green-700">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {card.desc}
                </p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
