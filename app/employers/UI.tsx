"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import PhoneShell from "@/components/phone/PhoneShell";
import { useParallax } from "@/hooks/use-parallax";
import { usePhoneCurrency } from "@/hooks/use-phone-currency";

// ── Employer Screen 1 — HR Dashboard ────────────────────────────────────────

function EmployerScreen1() {
  const { fmt } = usePhoneCurrency();
  return (
    <div className="flex h-full flex-col bg-[#F8F9F7] px-5 py-3">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#6B7280]">HR Dashboard</p>
          <p className="text-[15px] font-bold text-[#0A0A0A]">EaziWage</p>
          <p className="text-[10px] text-[#6B7280]">Monday, 30 Jun</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A]">
          <span className="text-[11px] font-bold text-white">HR</span>
        </div>
      </div>

      {/* Adoption card */}
      <div className="mb-3 rounded-2xl bg-[#0A0A0A] p-4 text-white">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-white/50">
          Staff adoption (active)
        </p>
        <p className="text-3xl font-bold leading-none">63%</p>
        <p className="mt-1 text-[11px] text-white/60">157 of 248 staff enrolled</p>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#10B981]"
            initial={{ width: 0 }}
            animate={{ width: "63%" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      <button className="mb-3 w-full rounded-xl bg-[#0A0A0A] py-3 text-sm font-semibold text-white">
        Configure Limits &amp; Controls
      </button>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Pending", value: "3" },
          { label: "Settled", value: fmt(1_200_000) },
          { label: "Payday", value: "8 days" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-[#F3F4F6] p-2.5">
            <p className="mb-0.5 text-[9px] leading-tight text-[#6B7280]">{label}</p>
            <p className="text-[11px] font-semibold leading-tight text-[#0A0A0A]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Employer Screen 2 — Request Review ──────────────────────────────────────

function EmployerScreen2() {
  const { fmt } = usePhoneCurrency();
  const request = 8_500;
  const fee = Math.round(request * 0.01);

  return (
    <div className="flex h-full flex-col bg-[#F8F9F7] px-5 py-3">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6]">
          <ChevronLeft className="h-4 w-4 text-[#0A0A0A]" strokeWidth={2.5} />
        </div>
        <p className="text-[15px] font-bold text-[#0A0A0A]">Review Request</p>
      </div>

      {/* Employee chip */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#F3F4F6] p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A0A0A]">
          <span className="text-[11px] font-bold text-white">AM</span>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#0A0A0A]">Alice M.</p>
          <p className="text-[10px] text-[#6B7280]">Finance · within 40% limit ✓</p>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4 text-center">
        <p className="text-[10px] uppercase tracking-widest text-[#6B7280]">Requested amount</p>
        <p className="my-1 text-3xl font-bold text-[#0A0A0A]">{fmt(request)}</p>
      </div>

      {/* Breakdown */}
      <div className="mb-4 rounded-2xl bg-[#F3F4F6] p-3">
        <div className="flex justify-between py-1">
          <span className="text-xs text-[#6B7280]">Deducted on payday</span>
          <span className="text-xs font-semibold text-[#0A0A0A]">{fmt(request)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-xs text-[#6B7280]">Platform fee (1%)</span>
          <span className="text-xs font-semibold text-[#0A0A0A]">{fmt(fee)}</span>
        </div>
      </div>

      {/* Approve / Decline */}
      <div className="flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0A0A0A] py-3">
          <Check className="h-4 w-4 text-[#10B981]" strokeWidth={2.5} />
          <span className="text-sm font-semibold text-white">Approve</span>
        </button>
        <button className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] px-4 py-3">
          <X className="h-4 w-4 text-[#6B7280]" strokeWidth={2.5} />
          <span className="text-sm font-semibold text-[#0A0A0A]">Decline</span>
        </button>
      </div>
    </div>
  );
}

// ── Employer Screen 3 — Payroll Synced ──────────────────────────────────────

function EmployerScreen3() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#F8F9F7] px-5 py-4">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
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
          <motion.circle
            cx="28" cy="28" r="25"
            fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.path
            d="M17 28.5L24 36L39 20"
            fill="none" stroke="#10B981" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.55, ease: "easeOut" }}
          />
        </svg>
      </div>

      <p className="text-2xl font-bold text-[#0A0A0A]">Payroll Synced</p>
      <p className="mt-1 text-sm text-[#6B7280]">248 employees updated</p>
      <p className="mt-1 text-xs text-[#6B7280]">Auto-deductions ready for payday</p>

      <div className="mt-8 flex w-full flex-col gap-3">
        <button className="w-full rounded-xl border border-[#E5E7EB] bg-transparent py-3">
          <span className="text-sm font-semibold text-[#0A0A0A]">View Report</span>
        </button>
        <button className="w-full py-2">
          <span className="text-sm text-[#6B7280]">Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
}

// ── Floating notification (employer-specific) ────────────────────────────────

function EmployerFloatingNotification() {
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
            3 requests pending
          </p>
          <p className="text-[10px] text-[#6B7280]">awaiting your review</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Screen config ─────────────────────────────────────────────────────────────

const SCREENS = [EmployerScreen1, EmployerScreen2, EmployerScreen3];

const screenVariants = {
  enter: { y: 20, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

// ── Main export ───────────────────────────────────────────────────────────────

export default function UI() {
  const [screenIndex, setScreenIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useParallax();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yPhone = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotatePhone = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const opacityPhone = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(
      () => setScreenIndex((i) => (i + 1) % SCREENS.length),
      3000
    );
    return () => clearInterval(id);
  }, [prefersReduced]);

  const ActiveScreen = SCREENS[screenIndex];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

        {/* Left column — content unchanged */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            For Employers
          </div>

          <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Boost productivity, retention &amp; wellbeing
            <span className="mt-2 block bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              with earned wage access that&apos;s payroll-integrated.
            </span>
          </h1>

          <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
            Provide staff early access to their already-earned salary — no
            loans, no interest. Transparent fees, automatic settlement on
            payday, and strong controls for HR/Finance.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`${process.env.NEXT_PUBLIC_DASHBOARD_APP_URL ?? "https://app.eaziwage.com"}/register`}
              className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-slate-200/60 pt-6 text-sm text-slate-700">
            {["Pan-African-Ready", "Data Protection", "No interest charges"].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-500/10">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
                </div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — animated employer phone mock */}
        <div
          ref={containerRef}
          className="relative hidden lg:flex lg:justify-center"
        >
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              y: prefersReduced ? 0 : yPhone,
              rotate: prefersReduced ? 0 : rotatePhone,
              opacity: prefersReduced ? 1 : opacityPhone,
            }}
            className="perspective-1000"
          >
            <motion.div
              style={{
                rotateX: prefersReduced ? 0 : rotateX,
                rotateY: prefersReduced ? 0 : rotateY,
              }}
            >
              <PhoneShell>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screenIndex}
                    variants={screenVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full"
                  >
                    <ActiveScreen />
                  </motion.div>
                </AnimatePresence>
              </PhoneShell>
            </motion.div>
          </motion.div>

          {/* Screen progress dots */}
          <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-1.5">
            {SCREENS.map((_, i) => (
              <button
                key={i}
                onClick={() => setScreenIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === screenIndex
                    ? "w-5 bg-emerald-600"
                    : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Screen ${i + 1}`}
              />
            ))}
          </div>

          <EmployerFloatingNotification />

          {/* Ambient glow */}
          <div className="absolute -bottom-10 -left-10 -z-10 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
