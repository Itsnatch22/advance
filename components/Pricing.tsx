"use client";

import React, { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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

const PricingCard = ({ card }: { card: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY }}
        className="group relative h-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 p-8 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(350px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.06), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110 shadow-sm">
              <card.icon className="h-8 w-8 text-green-600" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-2xl bg-green-400/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </div>

          <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors">
            {card.title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-500">
            {card.desc}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-white py-32"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-green-50/50 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Transparent Pricing
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          Fast. Fair.{" "}
          <span className="text-green-600">Fully Transparent.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-xl text-slate-500 max-w-3xl mx-auto"
        >
          It&apos;s not a loan, it&apos;s freedom — the freedom to live, plan,
          and dream without waiting for payday.
        </motion.p>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.map((card, i) => (
            <PricingCard key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
