"use client";
import { Building2, ArrowRight, BarChart, ShieldCheck, BellRing, FileCheck2 } from "lucide-react";
import Link from "next/link"

const BRAND = "#15803D";
export default function UI() {
    return(
        <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left column */}
        <div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-serif lg:text-5xl font-semibold leading-tight dark:text-white text-gray-900">
            Boost productivity, retention & wellbeing—
            <span className="block" style={{ color: BRAND }}>
              with earned wage access that&apos;s payroll-integrated.
            </span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-white max-w-prose">
            Provide staff early access to their already-earned salary—no loans, no interest.
            Transparent fees, automatic settlement on payday, and strong controls for HR/Finance.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/employer-dashboard" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white font-medium shadow-sm" style={{ backgroundColor: BRAND }}>
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm dark:text-white text-gray-600">
            <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" style={{ color: BRAND }} /> Pan-African-Ready</div>
            <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" style={{ color: BRAND }} /> Data Protection</div>
            <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" style={{ color: BRAND }} /> No interest charges</div>
          </div>
        </div>

        {/* Right column – Phone mock */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="rounded-[2.4rem] border-8 border-gray-900 shadow-2xl bg-black overflow-hidden">
            <div className="relative aspect-[9/19] bg-gray-950">
              {/* green glow from screen */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(50% 60% at 50% 45%, rgba(21,128,61,0.55) 0%, rgba(21,128,61,0.18) 40%, rgba(21,128,61,0.0) 70%)",
                }}
              />
              <div className="absolute inset-0 p-5 flex flex-col">
                <div className="text-white/90 text-xs">EaziWage • Employer</div>
                <div className="mt-auto rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/80 text-xs">Adoption (active)</div>
                      <div className="text-white text-2xl font-semibold">63%</div>
                    </div>
                    <BarChart className="h-6 w-6 text-white/80" />
                  </div>
                  <button className="mt-3 w-full rounded-xl py-2.5 text-white font-medium" style={{ backgroundColor: BRAND }}>
                    Configure limits & controls
                  </button>
                  <p className="mt-2 text-[11px] text-white/70">Flat fee $0.8 • Application fee 5% • No interest</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating confirmation card (bottom-right of phone) */}
          <div className="absolute -right-6 -bottom-6 hidden sm:block">
            <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-4 w-56">
              <div className="flex items-center gap-3">
                <BellRing className="h-5 w-5" style={{ color: BRAND }} />
                <div>
                  <p className="text-sm font-medium text-gray-900">New request policy</p>
                  <p className="text-xs text-gray-600">Limit updated: 40% of earned wages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary floating card (bottom-left of phone) */}
          <div className="absolute left-6 bottom-6 hidden sm:block">
            <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-4 w-56">
              <div className="flex items-center gap-3">
                <FileCheck2 className="h-5 w-5" style={{ color: BRAND }} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payroll synced</p>
                  <p className="text-xs text-gray-600">Auto-deductions ready for payday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </section>
    )
}