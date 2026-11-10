"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  CreditCard,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { usePhoneCurrency } from "@/hooks/use-phone-currency";

const availableWages = 18_420;
const quickAmounts = [5_000, 10_000, 15_000];

const transactions = [
  {
    label: "Wages earned",
    date: "Today, 10:42 AM",
    amount: 6_420,
    incoming: true,
  },
  {
    label: "M-Pesa withdrawal",
    date: "Yesterday, 2:18 PM",
    amount: 8_000,
    incoming: false,
  },
  {
    label: "Wages earned",
    date: "Yesterday, 9:05 AM",
    amount: 4_860,
    incoming: true,
  },
];

export default function EaziWageHeroDashboard() {
  const { fmt, mobileMoney } = usePhoneCurrency();
  const [selectedAmount, setSelectedAmount] = useState(10_000);
  const [previewReady, setPreviewReady] = useState(false);
  const platformFee = Math.round(selectedAmount * 0.06);
  const payoutAmount = selectedAmount - platformFee;

  return (
    <div className="relative min-w-0 xl:overflow-visible">
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_64px_-32px_rgba(15,23,42,0.28),0_8px_24px_-16px_rgba(16,185,129,0.22)] xl:w-[1080px] xl:max-w-none">
        <header className="flex min-h-14 items-center justify-between gap-4 border-b border-slate-200/70 bg-white px-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Wallet className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight text-slate-900">
                EaziWage
              </p>
              <p className="hidden text-[10px] text-slate-500 sm:block">
                Employee dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 sm:inline-flex">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Sample account
            </span>
            <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
              AM
            </span>
          </div>
        </header>

        <div className="grid gap-3 bg-slate-50/80 p-3 sm:gap-4 sm:p-4 md:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[360px_260px_300px] xl:gap-4">
          <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Good morning, Amina
                </p>
                <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">
                  Your earnings
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                June 1-30
              </span>
            </div>

            <div className="rounded-lg bg-emerald-700 p-4 text-white">
              <p className="text-[11px] font-medium text-emerald-50/80">
                Available earned wages
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight">
                {fmt(availableWages)}
              </p>
              <p className="mt-1 text-[10px] text-emerald-50/75">
                Ready to access, subject to your employer&apos;s limits
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-slate-800">
                  Salary progress
                </p>
                <p className="text-[10px] text-slate-500">52% of pay period</p>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Salary progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={52}
              >
                <div className="h-full w-[52%] rounded-full bg-emerald-500" />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                <span>Earned {fmt(48_600)}</span>
                <span>Monthly pay {fmt(93_500)}</span>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3">
              <div className="mb-1.5 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold text-slate-800">
                  Recent transactions
                </h3>
                <span className="text-[10px] font-medium text-emerald-700">
                  Sample activity
                </span>
              </div>
              <ul className="divide-y divide-slate-100">
                {transactions.map((transaction, index) => (
                  <li
                    key={`${transaction.label}-${transaction.date}`}
                    className={`flex items-center justify-between gap-2 py-2 ${
                      index === transactions.length - 1 ? "pb-0" : ""
                    }`}
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                        transaction.incoming
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {transaction.incoming ? (
                        <ArrowDownLeft
                          className="size-3.5"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-medium text-slate-700">
                        {transaction.label}
                      </span>
                      <span className="block text-[9px] text-slate-400">
                        {transaction.date}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-[10px] font-semibold ${
                        transaction.incoming
                          ? "text-emerald-700"
                          : "text-slate-700"
                      }`}
                    >
                      {transaction.incoming ? "+" : "-"}
                      {fmt(transaction.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <CreditCard className="size-3.5" aria-hidden="true" />
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Withdraw wages
              </h2>
            </div>
            <p className="mt-3 text-[10px] text-slate-500">
              Choose a sample amount
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  aria-pressed={selectedAmount === amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setPreviewReady(false);
                  }}
                  className={`rounded-md border px-1 py-2 text-[10px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none ${
                    selectedAmount === amount
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 text-slate-600 hover:border-emerald-300"
                  }`}
                >
                  {fmt(amount)}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Payout method</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800">
                  {mobileMoney}
                </span>
                <span className="text-[10px] text-slate-500">•••• 4821</span>
              </div>
            </div>

            <dl className="mt-3 space-y-2 border-b border-slate-100 pb-3 text-[10px]">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Requested amount</dt>
                <dd className="font-medium text-slate-800">
                  {fmt(selectedAmount)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Platform fee (6%)</dt>
                <dd className="font-medium text-slate-800">
                  {fmt(platformFee)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="font-medium text-slate-700">You receive</dt>
                <dd className="font-bold text-emerald-700">
                  {fmt(payoutAmount)}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setPreviewReady(true)}
              className="mt-3 w-full rounded-lg bg-emerald-700 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Preview withdrawal
            </button>
            <p
              aria-live="polite"
              className="mt-2 min-h-8 text-[9px] leading-4 text-slate-500"
            >
              {previewReady ? (
                <span className="flex gap-1 text-emerald-700">
                  <Check
                    className="mt-0.5 size-3 shrink-0"
                    aria-hidden="true"
                  />
                  Demo preview ready. No payout will be made.
                </span>
              ) : (
                "Sample only. No request or payment is submitted."
              )}
            </p>
          </section>

          <section className="min-w-0 rounded-xl border border-slate-200/70 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-medium text-slate-500">
                  Pay cycle
                </p>
                <h2 className="mt-1 text-sm font-bold text-slate-900">
                  Payday outlook
                </h2>
              </div>
              <Clock3 className="size-4 text-emerald-700" aria-hidden="true" />
            </div>
            <div className="mt-5 rounded-lg border border-slate-100 p-3">
              <p className="text-[10px] text-slate-500">Next payday</p>
              <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                30 June
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Salary is scheduled for the end of this pay period.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50/70 p-3">
              <ShieldCheck
                className="size-4 shrink-0 text-emerald-700"
                aria-hidden="true"
              />
              <p className="text-[10px] leading-relaxed text-slate-600">
                Your employer&apos;s access limits and payroll rules apply.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
