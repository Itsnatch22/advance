"use client";

import React from "react";
import { motion } from "framer-motion";

const LABELS = ["How It Works", "Our Impact", "Why EaziWage", "Pricing"];

interface PanelProgressProps {
  activeIndex: number;
  onDotClick: (i: number) => void;
}

export default function PanelProgress({
  activeIndex,
  onDotClick,
}: PanelProgressProps) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-5 py-2.5 backdrop-blur-md">
        {LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            aria-label={`Go to ${label}`}
            className="group flex items-center gap-2"
          >
            <motion.div
              animate={{
                width: activeIndex === i ? 28 : 8,
                backgroundColor:
                  activeIndex === i
                    ? "rgb(34 197 94)"
                    : "rgba(255,255,255,0.4)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-2 rounded-full"
            />
            {activeIndex === i && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="hidden text-[10px] font-bold tracking-widest whitespace-nowrap text-white uppercase sm:block"
              >
                {label}
              </motion.span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
