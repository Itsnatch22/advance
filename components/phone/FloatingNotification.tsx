"use client";
import { motion } from "framer-motion";
import { usePhoneCurrency } from "@/hooks/use-phone-currency";
import {
  DISBURSED_AMOUNT_KES,
  FEE_RATE,
  TRANSACTION_COST_KES,
  TRANSACTION_COST_USD,
} from "./transaction";

export default function FloatingNotification() {
  const { fmt } = usePhoneCurrency();

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5, ease: "easeOut" }}
      className="absolute top-1/4 -right-4 z-30 xl:-right-10"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2.2,
        }}
        className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      >
        <div className="h-2 w-2 shrink-0 rounded-full bg-[#10B981]" />
        <div>
          <p className="text-[12px] font-semibold whitespace-nowrap text-[#0A0A0A]">
            {fmt(DISBURSED_AMOUNT_KES)} sent
          </p>
          <p className="text-[9px] whitespace-nowrap text-[#6B7280]">
            {FEE_RATE * 100}% fee · ${TRANSACTION_COST_USD.toFixed(2)} (~
            {fmt(TRANSACTION_COST_KES)})
          </p>
          <p className="text-[10px] text-[#6B7280]">2s ago</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
