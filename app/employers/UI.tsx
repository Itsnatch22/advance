"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import EaziWageHeroDashboard from "@/components/EaziWageHeroDashboard";

export default function UI() {
  return (
    <section className="relative w-full overflow-x-clip py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-w-0 gap-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-center xl:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold tracking-wider text-emerald-700 uppercase ring-1 ring-emerald-500/10">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              For Employers
            </div>

            <h1 className="font-serif text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
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
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-slate-200/60 pt-6 text-sm text-slate-700">
              {[
                "Pan-African-Ready",
                "Data Protection",
                "No interest charges",
              ].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-500/10">
                    <ShieldCheck
                      className="size-4 text-emerald-600"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 xl:relative xl:z-10">
            <EaziWageHeroDashboard audience="employer" />
          </div>
        </div>
      </div>
    </section>
  );
}
