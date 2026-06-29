"use client";
import { motion } from "framer-motion";

export default function FloatingNotification() {
  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5, ease: "easeOut" }}
      className="absolute -right-4 top-1/4 z-30 xl:-right-10"
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
          <p className="whitespace-nowrap text-[12px] font-semibold text-[#0A0A0A]">
            KES 4,200 sent
          </p>
          <p className="text-[10px] text-[#6B7280]">2s ago</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
