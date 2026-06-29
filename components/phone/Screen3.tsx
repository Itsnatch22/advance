"use client";
import { motion } from "framer-motion";
import { usePhoneCurrency } from "@/hooks/use-phone-currency";

const SENT_KES = 4_200;

export default function Screen3() {
  const { fmt, mobileMoney } = usePhoneCurrency();

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#F8F9F7] px-5 py-4">
      {/* Animated checkmark */}
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
        {/* Burst particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#10B981]"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((i * 60 * Math.PI) / 180) * 44,
              y: Math.sin((i * 60 * Math.PI) / 180) * 44,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.7, delay: 0.85, ease: "easeOut" }}
          />
        ))}

        <svg viewBox="0 0 56 56" className="h-full w-full">
          {/* Circle draw-on */}
          <motion.circle
            cx="28"
            cy="28"
            r="25"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* Checkmark draw-on */}
          <motion.path
            d="M17 28.5L24 36L39 20"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.55, ease: "easeOut" }}
          />
        </svg>
      </div>

      {/* Amount */}
      <p className="text-4xl font-bold text-[#0A0A0A]">{fmt(SENT_KES)} Sent</p>
      <p className="mt-1 text-sm text-[#6B7280]">
        to {mobileMoney} ending 234
      </p>
      <p className="mt-2 text-xs text-[#6B7280]">2 seconds ago</p>

      {/* Action buttons */}
      <div className="mt-8 flex w-full flex-col gap-3">
        <button className="w-full rounded-xl border border-[#E5E7EB] bg-transparent py-3">
          <span className="text-sm font-semibold text-[#0A0A0A]">
            View Receipt
          </span>
        </button>
        <button className="w-full py-2">
          <span className="text-sm text-[#6B7280]">Back to Home</span>
        </button>
      </div>
    </div>
  );
}
