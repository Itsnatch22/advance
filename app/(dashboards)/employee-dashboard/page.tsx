"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icons, MOCK_TRANSACTIONS } from "@/constants";
import Layout from "./layout";

export default function EmployeeDashboard() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("0");

  const availableBalance = 2400.0;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <header className="mb-10 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <span className="text-xl font-bold text-white">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                EaziWage
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-slate-900">
                  Sarah Jenkins
                </p>
                <p className="text-xs text-slate-500">Software Engineer</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                SJ
              </div>
            </div>
          </header>

          {/* Hero Balance Card */}
          <div className="group relative mb-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 md:p-12">
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 transition-opacity group-hover:opacity-20">
              <Icons.Wallet size={120} />
            </div>
            <p className="mb-4 text-sm font-bold tracking-widest text-slate-500 uppercase">
              Available To Withdraw
            </p>
            <h2 className="mb-8 text-5xl font-black tracking-tighter text-slate-900 md:text-7xl">
              ${availableBalance.toFixed(2)}
            </h2>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-12 py-5 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95 sm:w-auto"
              >
                <Icons.ArrowUpRight className="mr-2 h-5 w-5" />
                Withdraw Now
              </button>
              <div className="text-xs font-medium text-slate-400">
                Next payday: May 28, 2024
              </div>
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Recent History */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center font-bold text-slate-900">
                  <Icons.History className="mr-2 h-5 w-5 text-slate-400" />
                  Recent History
                </h3>
                <button className="text-xs font-bold text-green-600 uppercase hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-2xl border border-transparent bg-slate-50/50 p-4 transition-all hover:border-slate-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          tx.type === "Withdrawal"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {tx.type === "Withdrawal" ? (
                          <Icons.ArrowUpRight size={20} />
                        ) : (
                          <Icons.CheckCircle2 size={20} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {tx.type}
                        </div>
                        <div className="text-[10px] font-medium text-slate-500">
                          {tx.date}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-bold ${tx.type === "Withdrawal" ? "text-slate-900" : "text-emerald-600"}`}
                    >
                      {tx.type === "Withdrawal" ? "-" : "+"}$
                      {tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repayment Progress */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 flex items-center font-bold text-slate-900">
                <Icons.Calendar className="mr-2 h-5 w-5 text-slate-400" />
                Repayment Timeline
              </h3>
              <div className="space-y-6">
                <div className="relative pt-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-green-600 uppercase">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-xs font-semibold text-green-600">
                        70% Earned
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-slate-100 text-xs">
                    <div
                      style={{ width: "70%" }}
                      className="flex flex-col justify-center bg-blue-500 text-center whitespace-nowrap text-white shadow-none transition-all duration-500"
                    ></div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <div className="mb-4 flex items-center space-x-4">
                    <Icons.Clock className="text-green-400" />
                    <div>
                      <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        Est. Settlement
                      </div>
                      <div className="font-bold">May 28, 2024</div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Your current accessed amount of $800.00 will be
                    automatically deducted from your upcoming paycheck. No
                    action required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal - Simulated */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="animate-in fade-in zoom-in w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl duration-200">
              <h3 className="mb-6 text-center text-2xl font-black text-slate-900">
                Withdraw Funds
              </h3>
              <div className="mb-8">
                <label className="mb-2 block text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-3xl font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    className="w-full rounded-2xl border-none bg-slate-50 py-6 pr-4 pl-10 text-4xl font-black transition-all outline-none focus:ring-4 focus:ring-emerald-100"
                    placeholder="0"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="mt-2 text-center text-xs text-slate-400">
                  Max available: $2,400.00
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="rounded-2xl bg-slate-100 py-4 font-bold text-slate-600 transition-all hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Successfully withdrawn $${amount}!`);
                    setShowWithdrawModal(false);
                  }}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
