"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Banner() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-60 flex w-full items-center justify-center gap-3 bg-linear-to-r from-green-700 via-emerald-500 to-green-600 py-2.5 text-sm font-medium tracking-wide text-white shadow-[0_2px_20px_rgba(22,163,74,0.3)] md:text-[15px]"
        >
          {/* Icon */}
          <Sparkles size={15} className="shrink-0 opacity-80" />

          {/* Message */}
          <span className="drop-shadow-sm">
            Introducing EaziWage — earned wage access, finally in Africa.
          </span>

          {/* CTA */}
          <Link
            href="https://app.eaziwage.com/register"
            className="group hidden items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-widest backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-green-700 sm:flex"
          >
            Get started
            <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          {/* Dismiss */}
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss banner"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white/60 transition hover:text-white"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}