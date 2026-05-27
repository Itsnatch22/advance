"use client";

import { motion, AnimatePresence } from "framer-motion";

export const MetricCard = ({
  title,
  value,
  accent = false,
  sub,
}: {
  title: string;
  value: string;
  accent?: boolean;
  sub?: string;
}) => (
  <motion.div
    layout
    className={`relative overflow-hidden rounded-4xl border p-6 transition-all duration-500 ${
      accent
        ? "border-green-500/20 bg-green-500/5 shadow-lg shadow-green-500/5 ring-1 ring-green-500/20"
        : "border-slate-100 bg-white shadow-sm"
    }`}
  >
    <p
      className={`text-[10px] font-black uppercase tracking-widest ${
        accent ? "text-green-600" : "text-slate-400"
      }`}
    >
      {title}
    </p>
    <AnimatePresence mode="wait">
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-2 text-2xl font-black tracking-tight text-slate-900"
      >
        {value}
      </motion.p>
    </AnimatePresence>
    {sub && <p className="mt-1 text-[10px] font-bold text-slate-400">{sub}</p>}
    {accent && (
      <div className="absolute top-0 right-0 h-16 w-16 -translate-y-1/2 translate-x-1/2 rounded-full bg-green-500/10 blur-2xl" />
    )}
  </motion.div>
);
