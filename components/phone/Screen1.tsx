"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { usePhoneCurrency } from "@/hooks/use-phone-currency";
import {
  FEE_RATE,
  TRANSACTION_COST_KES,
  TRANSACTION_COST_USD,
} from "./transaction";

export default function Screen1() {
  const { fmt } = usePhoneCurrency();

  return (
    <div className="flex h-full flex-col bg-[#F8F9F7] px-5 py-3">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-widest text-[#6B7280] uppercase">
            Good morning,
          </p>
          <p className="text-[15px] font-bold text-[#0A0A0A]">James</p>
          <p className="text-[10px] text-[#6B7280]">Monday, 30 Jun</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A]">
          <span className="text-[11px] font-bold text-white">JM</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="mb-3 rounded-2xl bg-[#0A0A0A] p-4 text-white">
        <p className="mb-2 text-[10px] tracking-widest text-white/50 uppercase">
          Earned this period
        </p>
        <p className="text-3xl leading-none font-bold">{fmt(18_400)}</p>
        <p className="mt-1 text-[11px] text-white/60">
          of {fmt(24_000)} total salary
        </p>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#10B981]"
            initial={{ width: 0 }}
            animate={{ width: "76%" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="text-[9px] text-white/40">0%</span>
          <span className="text-[9px] font-semibold text-[#10B981]">
            76% earned
          </span>
        </div>
      </div>

      {/* CTA */}
      <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A0A0A] py-3">
        <span className="text-sm font-semibold text-white">Access Wages</span>
        <ArrowRight className="h-4 w-4 text-white" strokeWidth={2.5} />
      </button>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Next payday", value: "8 days" },
          { label: "Available", value: fmt(9_200) },
          { label: "Advances", value: "1 active" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-[#F3F4F6] p-2.5">
            <p className="mb-0.5 text-[9px] leading-tight text-[#6B7280]">
              {label}
            </p>
            <p className="text-[11px] leading-tight font-semibold text-[#0A0A0A]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-[9px] text-[#6B7280]">
        {FEE_RATE * 100}% fee · ${TRANSACTION_COST_USD.toFixed(2)} transaction
        cost (~{fmt(TRANSACTION_COST_KES)})
      </p>
    </div>
  );
}
