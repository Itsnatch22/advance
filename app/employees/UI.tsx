"use client";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import HeroPhone from "@/components/HeroPhone";

export default function UI() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

        {/* Left column — content unchanged */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            For Employees
          </div>

          <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Access a portion of what you&apos;ve already earned{" "}
            <span className="mt-2 block bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              instantly, safely, transparently.
            </span>
          </h1>

          <p className="mt-6 max-w-prose text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
            No loans. No interest. Just early access to your earned wages when
            you need them — via Mobile wallet or bank. Reduce stress, avoid
            costly mobile loans, and stay in control.
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
            {["Pan-Africa Ready", "Data Protection", "No interest charges"].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-500/10">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
                </div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — animated HeroPhone (Screen1 → Screen2 → Screen3) */}
        <HeroPhone />
      </div>
    </section>
  );
}
