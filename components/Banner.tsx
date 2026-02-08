"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
          className="relative z-60 flex w-full items-center justify-center gap-3 bg-linear-to-r from-green-700 via-emerald-500 to-green-600 py-2 text-sm font-medium tracking-wide text-white shadow-[0_2px_20px_rgba(22,163,74,0.3)] md:text-[15px]"
        >
          <span className="drop-shadow-sm">
            🚀 <strong>EaziWage 2.0</strong> is live — early access to your pay,
            now simpler & faster! 💸
          </span>
          <button
            onClick={() => setVisible(false)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 transition hover:text-white"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
