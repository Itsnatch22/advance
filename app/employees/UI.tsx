"use client";
import {
  Sparkles,
  ArrowRight,
  Wallet,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UI() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Left column - enhanced typography and spacing */}
        <div className="max-w-2xl">
          {/* Hero badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            For Employees
          </div>

          {/* Enhanced heading with gradient accent */}
          <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Access a portion of what you&apos;ve already earned{""}
            <span className="mt-2 block bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              instantly, safely, transparently.
            </span>
          </h1>

          {/* Enhanced description with better contrast */}
          <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
            No loans. No interest. Just early access to your earned wages when
            you need them—via Mobile wallet or bank. Reduce stress, avoid costly
            mobile loans, and stay in control.
          </p>

          {/* Enhanced CTA button with premium styling */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/employee-dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              Get started 
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Enhanced trust indicators with refined styling */}
          <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-slate-200/60 pt-6 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-500/10">
                <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
              </div>
              <span className="font-medium">Pan-Africa Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-500/10">
                <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
              </div>
              <span className="font-medium">Data Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-500/10">
                <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
              </div>
              <span className="font-medium">No interest charges</span>
            </div>
          </div>
        </div>

        {/* Right column – Enhanced phone mock with refined styling */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          {/* Ambient glow effect behind phone */}
          <div className="absolute -inset-8 rounded-full bg-linear-to-br from-emerald-100/40 via-green-100/30 to-transparent blur-3xl"></div>

          {/* Phone frame with premium styling */}
          <div className="relative overflow-hidden rounded-[2.8rem] border-10px border-slate-900 bg-slate-950 shadow-2xl shadow-slate-900/40 ring-1 ring-slate-700/50">
            <div className="relative aspect-9/19 bg-slate-950">
              {/* Enhanced green glow from screen */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(50% 60% at 50% 45%, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.12) 40%, rgba(16,185,129,0.0) 70%)",
                }}
              />

              {/* Screen content with refined UI */}
              <div className="absolute inset-0 flex flex-col p-6">
                {/* Logo */}
                <div className="text-xs">
                  <Image src="/logo.png" alt="Logo" width={36} height={36} className="drop-shadow-lg" />
                </div>

                {/* Wallet card with enhanced glassmorphism */}
                <div className="mt-auto space-y-4 rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl backdrop-blur-xl">
                  {/* Balance display */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-white/70">
                        Available to withdraw
                      </div>
                      <div className="mt-1 text-3xl font-bold text-white">
                        USD 96.90
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                      <Wallet className="h-6 w-6 text-white/90" strokeWidth={2} />
                    </div>
                  </div>

                  {/* CTA button */}
                  <button className="w-full rounded-xl bg-linear-to-r from-emerald-600 to-green-600 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40">
                    Withdraw to Mobile Wallet
                  </button>

                  {/* Pricing info */}
                  <p className="text-center text-[11px] leading-relaxed text-white/60">
                    Flat fee USD 2 • Application fee 5% • No interest
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced floating notification card (bottom-right) */}
          <div className="absolute -right-6 -bottom-6 hidden sm:block">
            <div className="w-60 rounded-xl border border-slate-200/60 bg-white p-4 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-500/10">
                  <BellRing className="h-5 w-5 text-emerald-600" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Payout received
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                    Mobile wallet confirmation sent
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced floating info card (bottom-left) */}
          <div className="absolute -bottom-6 -left-6 hidden sm:block">
            <div className="w-60 rounded-xl border border-slate-200/60 bg-white p-4 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-500/10">
                  <BellRing className="h-5 w-5 text-emerald-600" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Days Worked
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                    21 days worked
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}