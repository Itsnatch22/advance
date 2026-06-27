'use client';

import { motion } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Smartphone,
    LineChart,
    Bot,
    Wallet,
    ArrowRight,
    Lock,
    BadgeCheck,
    Bell,
    Sparkles,
} from 'lucide-react';
import React from 'react';
import { GridSystem } from './grid';
import { TiltCard } from '@/components/shared/TiltCard';
import { cn } from '@/lib/utils/utils';

/* ─── fadeUp helper ──────────────────────────────────────────── */

const fadeUp = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
});

/* ─── sub-components ─────────────────────────────────────────── */

function AdvanceCalculatorMockup() {
    return (
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="mb-1 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Request Amount
            </p>
            <p className="mb-3 text-2xl font-bold text-slate-900">KES 8,500</p>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: "68%" }}
                />
                <div
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-green-600 shadow"
                    style={{ left: "68%" }}
                />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>KES 1,000</span>
                <span>KES 12,500</span>
            </div>
            <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3">
                {[
                    ["You receive", "KES 8,500"],
                    ["Processing fee", "KES 255"],
                    ["Repay on payday", "KES 8,755"],
                ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">{label}</span>
                        <span className="font-semibold text-slate-800">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DisbursementFlow() {
    const steps = [
        { label: "Request sent", done: true },
        { label: "Approved", done: true },
        { label: "Funds sent", done: false, active: true },
    ];
    return (
        <div className="mt-4 space-y-3">
            {steps.map(({ label, done, active }) => (
                <div key={label} className="flex items-center gap-3">
                    <div
                        className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                            done
                                ? "bg-green-500 text-white"
                                : active
                                    ? "animate-pulse border-2 border-green-500 bg-green-50 text-green-600"
                                    : "border border-slate-200 bg-slate-50 text-slate-400"
                        )}
                    >
                        {done ? "✓" : "→"}
                    </div>
                    <span
                        className={cn(
                            "text-sm",
                            done || active
                                ? "font-semibold text-slate-800"
                                : "text-slate-400"
                        )}
                    >
                        {label}
                    </span>
                    {active && (
                        <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                            In progress
                        </span>
                    )}
                </div>
            ))}
            <div className="mt-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2">
                <p className="text-[11px] font-semibold text-green-700">
                    via DusuPay · avg. 3 minutes
                </p>
            </div>
        </div>
    );
}

function PayrollMockup() {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
            <div className="border-b border-white/20 px-4 py-3">
                <p className="text-xs font-bold text-white/70 uppercase tracking-wide">
                    Payroll Impact — October
                </p>
            </div>
            <div className="space-y-2 p-4">
                {[
                    ["Total advances", "KES 2.4M", "text-white"],
                    ["Employees advanced", "187", "text-white"],
                    ["Payroll commitment", "18.4%", "text-emerald-200"],
                ].map(([label, value, cls]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{label}</span>
                        <span className={cn("font-bold", cls)}>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FlagRow() {
    const countries = [
        { flag: "🇰🇪", code: "KES" },
        { flag: "🇺🇬", code: "UGX" },
        { flag: "🇷🇼", code: "RWF" },
        { flag: "🇹🇿", code: "TZS" },
    ];
    return (
        <div className="mt-4 flex flex-col gap-3">
            <div className="flex gap-2">
                {countries.map(({ flag, code }) => (
                    <div
                        key={code}
                        className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 py-3"
                    >
                        <span className="text-xl">{flag}</span>
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                            {code}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── icon pill ──────────────────────────────────────────────── */

function IconPill({ icon: Icon }: { icon: React.ElementType }) {
    return (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
            <Icon className="h-5 w-5 text-green-700" strokeWidth={1.5} />
        </div>
    );
}

/* ─── main component ─────────────────────────────────────────── */

export default function FeaturesBento() {
    return (
        <GridSystem variant="dots" opacity={0.02} className="py-24 bg-slate-50">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-100/40 rounded-full blur-[120px] opacity-70 translate-x-1/2 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[100px] opacity-70 -translate-x-1/2 translate-y-1/4" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-700 mb-6"
                    >
                        <Zap className="w-4 h-4" />
                        <span>The EaziWage Difference</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 font-serif"
                    >
                        Everything you need for <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600">financial freedom.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600"
                    >
                        We've engineered a platform that doesn't just advance wages—it transforms how employees and employers interact with money.
                    </motion.p>
                </div>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">

                    {/* BENTO ITEM 1: Instant Transfers (Large Column, hero) */}
                    <motion.div
                        {...fadeUp(0)}
                        className="md:col-span-2 lg:col-span-2 row-span-2"
                    >
                        <TiltCard className="h-full overflow-hidden flex flex-col bg-white border-slate-200 shadow-xl">
                            <div className="p-8 lg:p-10 z-10">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mb-6 shadow-inner border border-green-100/50">
                                    <Zap className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Lightning Fast Transfers</h3>
                                <p className="text-slate-600 leading-relaxed max-w-sm">
                                    Say goodbye to waiting. Once approved, funds are disbursed directly to M-PESA, MTN Mobile Money, or local bank accounts in under 3 seconds.
                                </p>
                                <AdvanceCalculatorMockup />
                            </div>
                            {/* DisbursementFlow + animated floating slip */}
                            <div className="relative mt-auto px-8 pb-6 pt-4 border-t border-slate-100 bg-slate-50 flex items-start gap-6">
                                <div className="flex-1 min-w-0">
                                    <DisbursementFlow />
                                </div>
                                <motion.div
                                    className="shrink-0 w-44 bg-white rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-4 flex flex-col justify-between"
                                    animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <Wallet className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="h-2 w-12 bg-slate-200 rounded-full" />
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600">+ KES 4,500</span>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <div className="h-2 w-full bg-slate-100 rounded-full" />
                                        <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-green-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                                        Completed • 1s
                                    </div>
                                </motion.div>
                            </div>
                            {/* Gradient flare on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </TiltCard>
                    </motion.div>

                    {/* BENTO ITEM 2: Smart AI Wiza (Square) — dark bg-slate-900 */}
                    <motion.div
                        {...fadeUp(1)}
                        className="md:col-span-1 lg:col-span-1 row-span-1"
                    >
                        <TiltCard className="h-full overflow-hidden flex flex-col bg-slate-900 border-slate-800 shadow-xl">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/40 via-slate-900 to-slate-900 pointer-events-none" />
                            <div className="p-6 lg:p-8 relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10 text-white">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Wiza AI Coach</h3>
                                    <p className="text-slate-400 text-sm">
                                        Your 24/7 personal financial assistant. Get advice, budget tips, and advance eligibility instantly.
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-semibold hover:text-green-300 cursor-pointer w-fit">
                                    Chat with Wiza <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* BENTO ITEM 3: Multi-Country (Square) */}
                    <motion.div
                        {...fadeUp(2)}
                        className="md:col-span-1 lg:col-span-1 row-span-1"
                    >
                        <TiltCard className="h-full overflow-hidden flex flex-col bg-white border-slate-200 shadow-sm">
                            <div className="p-6 lg:p-8 flex flex-col h-full">
                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 border border-slate-200 text-slate-600">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">One Platform, Four Countries</h3>
                                <p className="text-slate-600 text-sm flex-1">
                                    Kenya, Uganda, Rwanda, Tanzania. Local currencies, local compliance.
                                </p>
                                <FlagRow />
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* BENTO ITEM 4: Employer Dashboard (Horizontal) — emerald bg */}
                    <motion.div
                        {...fadeUp(3)}
                        className="md:col-span-2 lg:col-span-2 row-span-1"
                    >
                        <TiltCard className="h-full overflow-hidden text-white bg-emerald-600 border-emerald-500 shadow-xl pattern-boxes pattern-emerald-700 pattern-bg-emerald-600 pattern-size-4 pattern-opacity-20">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-transparent pointer-events-none" />
                            <div className="p-6 lg:p-8 h-full flex gap-6 relative z-10">
                                <div className="flex flex-col justify-center w-1/2 shrink-0">
                                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20">
                                        <LineChart className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Automated HR Dashboard</h3>
                                    <p className="text-emerald-50 text-sm leading-relaxed">
                                        Zero operational overhead for employers. Deductions happen automatically through payroll integrations.
                                    </p>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <PayrollMockup />
                                </div>
                            </div>
                            {/* Abstract UI cut-off on the right edge */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 hidden sm:block w-28 h-40 bg-white rounded-l-2xl shadow-2xl p-3 border-l border-y border-emerald-400 z-20">
                                <div className="flex gap-1.5 mb-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-3/4 bg-slate-100 rounded-full" />
                                    <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                                    <div className="h-8 w-full bg-emerald-50 rounded-lg mt-3" />
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* BENTO ITEM 5: Omni-channel Access (Horizontal) */}
                    <motion.div
                        {...fadeUp(4)}
                        className="md:col-span-1 lg:col-span-2 row-span-1"
                    >
                        <TiltCard className="h-full overflow-hidden flex items-center bg-white border-slate-200 shadow-sm">
                            <div className="p-6 lg:p-8 flex items-center gap-6 w-full">
                                <div className="hidden sm:flex shrink-0 w-20 h-20 rounded-2xl bg-amber-50 border border-amber-100 items-center justify-center text-amber-600 relative overflow-hidden">
                                    <Smartphone className="w-8 h-8 relative z-10" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-100 to-transparent opacity-50" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">App, Web, or USSD</h3>
                                    <p className="text-slate-600 text-sm">
                                        Built for everyone. Access your advance via our sleek smartphone app, desktop, or any feature phone using our dedicated USSD shortcodes. No internet? No problem.
                                    </p>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* BENTO ITEMS 6–10: Small cards — IconPill pattern */}
                    {([
                        { icon: ShieldCheck, title: "Real-Time Fraud Engine",  desc: "Every request screened before it moves." },
                        { icon: Lock,        title: "Bank-Grade Security",      desc: "PII encrypted at rest. Zero plaintext exposure." },
                        { icon: BadgeCheck,  title: "Regulatory Ready",         desc: "Built for East African financial regulation from day one." },
                        { icon: Bell,        title: "Always In the Loop",       desc: "27 notification events. Push, email, in-app. Nothing slips through." },
                        { icon: Sparkles,    title: "No Hidden Costs",          desc: "Just a small processing fee. No interest, ever." },
                    ] as const).map(({ icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            {...fadeUp(5 + i)}
                            className="md:col-span-1 lg:col-span-1"
                        >
                            <TiltCard className="h-full flex flex-col p-6 bg-white border-slate-200 shadow-sm">
                                <IconPill icon={icon} />
                                <h3 className="font-bold text-slate-900">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
                            </TiltCard>
                        </motion.div>
                    ))}

                </div>
            </div>
        </GridSystem>
    );
}
