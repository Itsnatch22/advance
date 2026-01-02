"use client";
import { Sparkles, ArrowRight, Wallet, ShieldCheck, BellRing } from "lucide-react";
import Link from "next/link";
export default function UI() {
    return(
        <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border dark:bg-black border-gray-200 px-3 py-1 text-xs text-gray-600 bg-white">
            <Sparkles className="h-3.5 w-3.5" /> Made for Employees
          </span>
          <h1 className="mt-4 text-3xl dark:text-white sm:text-4xl lg:text-5xl font-semibold font-serif leading-tight text-gray-900">
            Access a portion of what you&apos;ve already earned—
            <span className="block text-green-700">instantly, safely, transparently.</span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-white max-w-prose">
            No loans. No interest. Just early access to your earned wages when you need them—via Mobile wallet or bank. Reduce stress, avoid costly mobile loans, and stay in control.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/employee-dashboard" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-green-700 hover:bg-green-800 text-white font-medium shadow-sm transition-colors">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm dark:text-white text-gray-600">
            <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-green-700" /> CBK-aligned</div>
            <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-green-700" /> ODPC data protection</div>
            <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-green-700" /> No interest charges</div>
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
                <div className="text-white/90 text-xs">EaziWage</div>
                <div className="mt-auto rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/80 text-xs">Available to withdraw</div>
                      <div className="text-white text-2xl font-semibold">KSh 12,500</div>
                    </div>
                    <Wallet className="h-6 w-6 text-white/80" />
                  </div>
                  <button className="mt-3 w-full rounded-xl py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium transition-colors">Withdraw to Mobile Wallet</button>
                  <p className="mt-2 text-[11px] text-white/70">Flat fee KSh 25 • Application fee 5% • No interest</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating confirmation card (bottom-right of phone) */}
          <div className="absolute -right-6 -bottom-6 hidden sm:block">
            <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-4 w-56">
              <div className="flex items-center gap-3">
                <BellRing className="h-5 w-5 text-green-700" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payout received</p>
                  <p className="text-xs text-gray-600">Mobile wallet confirmation sent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary floating card (bottom-left of phone) */}
          <div className="absolute left+50 bottom-6 hidden sm:block">
            <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-4 w-56">
              <div className="flex items-center gap-3">
                <BellRing className="h-5 w-5 text-green-700" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Days Worked</p>
                  <p className="text-xs text-gray-600">21 days worked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </section>
    )
}