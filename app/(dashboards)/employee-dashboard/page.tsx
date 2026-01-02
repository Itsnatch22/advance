"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Icons, MOCK_TRANSACTIONS } from '@/constants';

export default function EmployeeDashboard() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('0');

  const availableBalance = 2400.00;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EaziWage</span>
          </Link>
          <div className="flex items-center space-x-4">
             <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-slate-900">Sarah Jenkins</p>
              <p className="text-xs text-slate-500">Software Engineer</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              SJ
            </div>
          </div>
        </header>

        {/* Hero Balance Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 text-center mb-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icons.Wallet size={120} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Available To Withdraw</p>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8">
            ${availableBalance.toFixed(2)}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="w-full sm:w-auto px-12 py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center justify-center"
            >
              <Icons.ArrowUpRight className="mr-2 w-5 h-5" />
              Withdraw Now
            </button>
            <div className="text-xs text-slate-400 font-medium">
              Next payday: May 28, 2024
            </div>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 flex items-center">
                <Icons.History className="mr-2 w-5 h-5 text-slate-400" />
                Recent History
              </h3>
              <button className="text-xs font-bold text-green-600 hover:underline uppercase">View All</button>
            </div>
            <div className="space-y-4">
              {MOCK_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'Withdrawal' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {tx.type === 'Withdrawal' ? <Icons.ArrowUpRight size={20} /> : <Icons.CheckCircle2 size={20} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{tx.type}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{tx.date}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${tx.type === 'Withdrawal' ? 'text-slate-900' : 'text-emerald-600'}`}>
                    {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repayment Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center">
              <Icons.Calendar className="mr-2 w-5 h-5 text-slate-400" />
              Repayment Timeline
            </h3>
            <div className="space-y-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-blue-100">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-600">
                      70% Earned
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
                  <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-900 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <Icons.Clock className="text-green-400" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-widest">Est. Settlement</div>
                    <div className="font-bold">May 28, 2024</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your current accessed amount of $800.00 will be automatically deducted from your upcoming paycheck. No action required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Simulated */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-6 text-center">Withdraw Funds</h3>
            <div className="mb-8">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Enter Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-400">$</span>
                <input 
                  type="number" 
                  className="w-full pl-10 pr-4 py-6 bg-slate-50 border-none rounded-2xl text-4xl font-black focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                  placeholder="0"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="mt-2 text-xs text-center text-slate-400">
                Max available: $2,400.00
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert(`Successfully withdrawn $${amount}!`);
                  setShowWithdrawModal(false);
                }}
                disabled={!amount || parseFloat(amount) <= 0}
                className="py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
