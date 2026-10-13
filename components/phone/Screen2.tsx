"use client";
import { ChevronLeft } from "lucide-react";
import { usePhoneCurrency } from "@/hooks/use-phone-currency";
import {
  DISBURSED_AMOUNT_KES,
  FEE_RATE,
  PLATFORM_FEE_KES,
  REQUESTED_AMOUNT_KES,
  SALARY_DEDUCTION_KES,
  TRANSACTION_COST_KES,
  TRANSACTION_COST_USD,
} from "./transaction";
const MAX_KES = 9_200;

export default function Screen2() {
  const { fmt, mobileMoney } = usePhoneCurrency();

  return (
    <div className="flex h-full flex-col bg-[#F8F9F7] px-5 py-3">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6]">
          <ChevronLeft className="h-4 w-4 text-[#0A0A0A]" strokeWidth={2.5} />
        </div>
        <p className="text-[15px] font-bold text-[#0A0A0A]">Request Wages</p>
      </div>

      {/* Amount */}
      <div className="mb-5 text-center">
        <p className="text-[10px] tracking-widest text-[#6B7280] uppercase">
          Request amount
        </p>
        <p className="my-2 text-4xl font-bold text-[#0A0A0A]">
          {fmt(REQUESTED_AMOUNT_KES)}
        </p>

        {/* +/− with mini track */}
        <div className="mx-auto flex w-fit items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-lg font-bold text-[#0A0A0A] select-none">
            −
          </div>
          <div className="h-1 w-28 overflow-hidden rounded-full bg-[#E5E7EB]">
            <div className="h-full w-[46%] rounded-full bg-[#10B981]" />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6] text-lg font-bold text-[#0A0A0A] select-none">
            +
          </div>
        </div>
        <p className="mt-2 text-[11px] text-[#6B7280]">
          Max available: {fmt(MAX_KES)}
        </p>
      </div>

      {/* Breakdown card */}
      <div className="mb-4 rounded-2xl bg-[#F3F4F6] p-4">
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#6B7280]">You receive</span>
          <span className="text-sm font-semibold text-[#0A0A0A]">
            {fmt(DISBURSED_AMOUNT_KES)}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#6B7280]">
            Fee ({FEE_RATE * 100}%)
          </span>
          <span className="text-sm font-semibold text-[#0A0A0A]">
            {fmt(PLATFORM_FEE_KES)}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#6B7280]">Transaction cost</span>
          <span className="text-right text-xs font-semibold text-[#0A0A0A]">
            ${TRANSACTION_COST_USD.toFixed(2)} (~{fmt(TRANSACTION_COST_KES)})
          </span>
        </div>
        <div className="my-2 h-px bg-[#E5E7EB]" />
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#6B7280]">Salary deduction</span>
          <span className="text-sm font-semibold text-[#0A0A0A]">
            {fmt(SALARY_DEDUCTION_KES)}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#6B7280]">To</span>
          <span className="text-sm font-semibold text-[#0A0A0A]">
            {mobileMoney} · *** *** 234
          </span>
        </div>
      </div>

      {/* CTA */}
      <button className="mb-2 flex w-full items-center justify-center rounded-xl bg-[#0A0A0A] py-3">
        <span className="text-sm font-semibold text-white">
          Confirm Request
        </span>
      </button>
      <p className="text-center text-[11px] text-[#6B7280]">
        Arrives in under 60 seconds
      </p>
    </div>
  );
}
