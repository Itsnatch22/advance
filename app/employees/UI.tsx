"use client";
import {
  Sparkles,
  ArrowRight,
  Wallet,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import Link from "next/link";
export default function UI() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left column */}
        <div>
          <h1 className="mt-4 font-serif text-3xl leading-tight font-semibold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Access a portion of what you&apos;ve already earned—
            <span className="block text-green-700">
              instantly, safely, transparently.
            </span>
          </h1>
          <p className="mt-4 max-w-prose text-gray-600 dark:text-white">
            No loans. No interest. Just early access to your earned wages when
            you need them—via Mobile wallet or bank. Reduce stress, avoid costly
            mobile loans, and stay in control.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/employee-dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-green-700 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-green-800"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-600 dark:text-white">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-green-700" /> Pan-Africa Ready
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-green-700" /> Data Protection
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-green-700" /> No interest charges
            </div>
          </div>
        </div>

        {/* Right column – Phone mock */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-[2.4rem] border-8 border-gray-900 bg-black shadow-2xl">
            <div className="relative aspect-[9/19] bg-gray-950">
              {/* green glow from screen */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(50% 60% at 50% 45%, rgba(21,128,61,0.55) 0%, rgba(21,128,61,0.18) 40%, rgba(21,128,61,0.0) 70%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col p-5">
                <div className="text-xs text-white/90">EaziWage</div>
                <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/80">
                        Available to withdraw
                      </div>
                      <div className="text-2xl font-semibold text-white">
                        USD 96.90
                      </div>
                    </div>
                    <Wallet className="h-6 w-6 text-white/80" />
                  </div>
                  <button className="mt-3 w-full rounded-xl bg-green-700 py-2.5 font-medium text-white transition-colors hover:bg-green-800">
                    Withdraw to Mobile Wallet
                  </button>
                  <p className="mt-2 text-[11px] text-white/70">
                    Flat fee USD 2 • Application fee 5% • No interest
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating confirmation card (bottom-right of phone) */}
          <div className="absolute -right-6 -bottom-6 hidden sm:block">
            <div className="w-56 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <BellRing className="h-5 w-5 text-green-700" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Payout received
                  </p>
                  <p className="text-xs text-gray-600">
                    Mobile wallet confirmation sent
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary floating card (bottom-left of phone) */}
          <div className="left+50 absolute bottom-6 hidden sm:block">
            <div className="w-56 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <BellRing className="h-5 w-5 text-green-700" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Days Worked
                  </p>
                  <p className="text-xs text-gray-600">21 days worked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
