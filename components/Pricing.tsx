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
import { useParallax } from "@/hooks/use-parallax";

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
    desc: "Earned Wage Access with transparent, no hidden fees; includes up to 6% application fees and no interest, with options for advance salary access.",
  },
  {
    icon: Scale,
    title: "Up to 6% Application Fees",
    desc: "A nominal application fee of up to 6% may apply, depending on your eligibility and the amount you wish to access.",
  },
];

const PricingCard = ({
  card,
}: {
  card: {
    icon: React.ElementType;
    title: string;
    desc: string;
  };
}) => {
  const { rotateX, rotateY, spotlightBackground, handleMouseMove, handleMouseLeave } = useParallax();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-900/5 sm:p-8"
      >
        <motion.div
          style={{
            background: spotlightBackground,
          }}
          className="pointer-events-none absolute inset-0"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 shadow-sm ring-1 ring-green-500/10 transition-transform duration-300 group-hover:scale-105">
              <card.icon className="h-7 w-7 text-green-600" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-2xl bg-green-400/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>

          <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-green-600">
            {card.title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-500">{card.desc}</p>
        </div>

        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-500 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-green-50/50 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
          Transparent Pricing
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          Fast. Fair. <span className="text-green-600">Fully Transparent.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg"
        >
          It&apos;s not a loan, it&apos;s freedom — the freedom to live, plan,
          and dream without waiting for payday.
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.map((card, i) => (
            <PricingCard key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
