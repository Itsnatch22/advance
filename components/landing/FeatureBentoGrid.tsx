"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  BadgeCheck,
  Bell,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

/* ─── tiny helpers ─────────────────────────────────────────── */

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
});

/* ─── sub-components used only in this file ────────────────── */

function AdvanceCalculatorMockup() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      {/* Slider */}
      <p className="mb-1 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        Request Amount
      </p>
      <p className="mb-3 text-2xl font-bold text-slate-900">
        KES 8,500
      </p>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="eaziwage-gradient absolute inset-y-0 left-0 rounded-full"
          style={{ width: "68%" }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-green-600 shadow"
          style={{ left: "68%" }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>KES 1,000</span>
        <span>KES 12,500</span>
      </div>
      {/* Breakdown */}
      <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3">
        {[
          ["You receive", "KES 8,500"],
          ["Processing fee", "KES 255"],
          ["Repay on payday", "KES 8,755"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{label}</span>
            <span className="font-semibold text-slate-800">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlagRow() {
  const countries = [
    { flag: "🇰🇪", code: "KES" },
    { flag: "🇺🇬", code: "UGX" },
    { flag: "🇷🇼", code: "RWF" },
    { flag: "🇹🇿", code: "TZS" },
  ];
  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex gap-3">
        {countries.map(({ flag, code }) => (
          <div
            key={code}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 py-3"
          >
            <span className="text-2xl">{flag}</span>
            <span className="font-mono text-[10px] font-bold text-slate-500">
              {code}
            </span>
          </div>
        ))}
      </div>
      {/* minimal East Africa SVG map outline */}
      <svg
        viewBox="0 0 120 100"
        className="mx-auto h-20 w-auto opacity-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path d="M60 10 L80 18 L90 30 L85 50 L75 65 L60 85 L45 70 L35 55 L38 35 L50 20 Z" />
        <path d="M50 20 L60 10 L70 8 L75 18" />
        <path d="M80 18 L90 15 L95 28 L90 30" />
      </svg>
    </div>
  );
}

function DisbursementFlow() {
  const steps = [
    { label: "Request sent", done: true },
    { label: "Approved", done: true },
    { label: "Funds sent", done: false, active: true },
  ];
  return (
    <div className="mt-6 space-y-3">
      {steps.map(({ label, done, active }) => (
        <div key={label} className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              done
                ? "bg-green-500 text-white"
                : active
                  ? "animate-pulse border-2 border-green-500 bg-green-50 text-green-600"
                  : "border border-slate-200 bg-slate-50 text-slate-400"
            )}
          >
            {done ? "✓" : "→"}
          </div>
          <span
            className={cn(
              "text-sm",
              done || active
                ? "font-semibold text-slate-800"
                : "text-slate-400"
            )}
          >
            {label}
          </span>
          {active && (
            <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
              In progress
            </span>
          )}
        </div>
      ))}
      <div className="mt-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2">
        <p className="text-[11px] font-semibold text-green-700">
          via DusuPay · avg. 3 minutes
        </p>
      </div>
    </div>
  );
}

function PayrollMockup() {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Payroll Impact — October
        </p>
      </div>
      <div className="space-y-2 p-4">
        {[
          ["Total advances", "KES 2.4M", "text-slate-800"],
          ["Employees advanced", "187", "text-slate-800"],
          ["Payroll commitment", "18.4%", "text-green-600"],
        ].map(([label, value, cls]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{label}</span>
            <span className={cn("font-bold", cls)}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── card wrapper ──────────────────────────────────────────── */

function BentoCard({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index: number;
}) {
  return (
    <motion.div
      {...fadeUp(index)}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm",
        "transition-shadow duration-300 hover:shadow-xl hover:shadow-green-500/5",
        className
      )}
    >
      {/* hover gradient wash */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-green-50/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

/* ─── icon pill ─────────────────────────────────────────────── */

function IconPill({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
      <Icon className="h-5 w-5 text-green-700" strokeWidth={1.5} />
    </div>
  );
}

/* ─── main component ────────────────────────────────────────── */

export default function FeatureBentoGrid() {
  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-32">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-green-100/30 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-emerald-100/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* section header */}
        <div className="mb-16 text-center">
          <motion.div
            {...fadeUp(0)}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Everything You Need</span>
          </motion.div>

          <motion.h2
            {...fadeUp(1)}
            className="font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl"
          >
            Built for Africa&apos;s{" "}
            <span className="text-green-600">Workforce</span>
          </motion.h2>

          <motion.p
            {...fadeUp(2)}
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-500"
          >
            One platform. Four countries. Real wages, on demand.
          </motion.p>
        </div>

        {/* bento grid */}
        <div
          className={cn(
            "grid gap-4",
            // mobile: single column
            "grid-cols-1",
            // tablet: 2 columns
            "md:grid-cols-2",
            // desktop: 4 columns with explicit placement
            "lg:grid-cols-4 lg:[grid-template-rows:repeat(3,auto)]"
          )}
          style={
            {
              "--area": "auto",
            } as React.CSSProperties
          }
        >
          {/* ── Card 1 — Hero (2×2) ───────────────────────────────── */}
          <BentoCard
            index={0}
            className="lg:col-span-2 lg:row-span-2 md:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold tracking-wide text-green-700 uppercase">
                  Core Feature
                </span>
                <h3 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                  Your salary,
                  <br />
                  before payday.
                </h3>
                <p className="mt-3 leading-relaxed text-slate-500">
                  No loans. No interest. Just your earned wages, exactly when
                  you need them.
                </p>
              </div>
            </div>
            <AdvanceCalculatorMockup />
            <div className="mt-auto pt-6">
              <button className="group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 transition-colors hover:text-green-700">
                See how it works
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </BentoCard>

          {/* ── Card 2 — Multi-Country (1×2) ─────────────────────── */}
          <BentoCard index={1} className="lg:col-span-1 lg:row-span-2">
            <h3 className="text-lg font-bold text-slate-900">
              One Platform,
              <br />
              Four Countries
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Kenya, Uganda, Rwanda, Tanzania. Local currencies, local
              compliance.
            </p>
            <FlagRow />
          </BentoCard>

          {/* ── Card 3 — Instant Disbursement (1×2) ──────────────── */}
          <BentoCard index={2} className="lg:col-span-1 lg:row-span-2">
            <h3 className="text-lg font-bold text-slate-900">
              Funds in Minutes
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Mobile money or bank transfer. Powered by DusuPay. No waiting.
            </p>
            <DisbursementFlow />
          </BentoCard>

          {/* ── Card 4 — Employer Dashboard (2×1 on lg) ──────────── */}
          <BentoCard index={3} className="lg:col-span-2 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">
              Full Payroll Visibility
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              See advance commitments before payday runs. No surprises.
            </p>
            <PayrollMockup />
          </BentoCard>

          {/* ── Card 5 — Fraud Protection (1×1) ──────────────────── */}
          <BentoCard index={4} className="lg:col-span-1">
            <IconPill icon={ShieldCheck} />
            <h3 className="font-bold text-slate-900">
              Real-Time Fraud Engine
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Every request screened before it moves.
            </p>
          </BentoCard>

          {/* ── Card 6 — Encryption (1×1) ─────────────────────────── */}
          <BentoCard index={5} className="lg:col-span-1">
            <IconPill icon={Lock} />
            <h3 className="font-bold text-slate-900">
              Bank-Grade Security
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              PII encrypted at rest. Zero plaintext exposure.
            </p>
          </BentoCard>

          {/* ── Card 7 — CBK Compliant (1×1) ─────────────────────── */}
          <BentoCard index={6} className="lg:col-span-1">
            <IconPill icon={BadgeCheck} />
            <h3 className="font-bold text-slate-900">
              Regulatory Ready
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Built for East African financial regulation from day one.
            </p>
          </BentoCard>

          {/* ── Card 8 — Notifications (1×1) ─────────────────────── */}
          <BentoCard index={7} className="lg:col-span-1">
            <IconPill icon={Bell} />
            <h3 className="font-bold text-slate-900">
              Always In the Loop
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              27 notification events. Push, email, in-app. Nothing slips
              through.
            </p>
          </BentoCard>

          {/* ── Card 9 — Zero Interest (1×1) ─────────────────────── */}
          <BentoCard index={8} className="lg:col-span-1">
            <IconPill icon={Sparkles} />
            <h3 className="font-bold text-slate-900">
              No Hidden Costs
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Just a small processing fee. No interest, ever.
            </p>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
