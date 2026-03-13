'use client';

import { motion } from 'framer-motion';
import { 
    Zap, 
    ShieldCheck, 
    Smartphone, 
    LineChart, 
    Bot,
    Wallet,
    ArrowRight
} from 'lucide-react';
import React from 'react';

export default function FeaturesBento() {
    return (
        <section className="py-24 relative overflow-hidden bg-slate-50">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-100/40 rounded-full blur-[120px] opacity-70 translate-x-1/2 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[100px] opacity-70 -translate-x-1/2 translate-y-1/4" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
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
                    
                    {/* BENTO ITEM 1: Instant Transfers (Large Column) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="group relative md:col-span-2 lg:col-span-2 row-span-2 rounded-[2rem] bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="p-8 lg:p-10 flex-1 z-10">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mb-6 shadow-inner border border-green-100/50">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Lightning Fast Transfers</h3>
                            <p className="text-slate-600 leading-relaxed max-w-sm">
                                Say goodbye to waiting. Once approved, funds are disbursed directly to M-PESA, MTN Mobile Money, or local bank accounts in under 3 seconds.
                            </p>
                        </div>
                        {/* Visual for Item 1 */}
                        <div className="relative h-64 mt-auto overflow-hidden bg-slate-50 border-t border-slate-100">
                            {/* Animated Payment Slips */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div 
                                    className="relative w-64 h-32 bg-white rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-4 flex flex-col justify-between"
                                    animate={{ 
                                        y: [0, -10, 0], 
                                        rotate: [0, 2, 0] 
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <Wallet className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="h-2 w-16 bg-slate-200 rounded-full" />
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
                        </div>
                        {/* Gradient flare on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>

                    {/* BENTO ITEM 2: Smart AI Wiza (Square) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.1 }}
                        className="group relative md:col-span-1 lg:col-span-1 row-span-1 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/40 via-slate-900 to-slate-900" />
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
                    </motion.div>

                    {/* BENTO ITEM 3: No Hidden Fees (Square) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.2 }}
                        className="group relative md:col-span-1 lg:col-span-1 row-span-1 rounded-[2rem] bg-white border border-slate-200 shadow-xs overflow-hidden"
                    >
                        <div className="p-6 lg:p-8 flex flex-col h-full">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100 text-blue-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Zero Interest. Zero Traps.</h3>
                            <p className="text-slate-600 text-sm flex-1">
                                We are not a loan. You only pay a flat, transparent transaction fee. No compound interest, ever.
                            </p>
                            
                            {/* Mini visual indicator */}
                            <div className="mt-4 flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <div className="text-sm font-bold text-slate-900">100%</div>
                                <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-full rounded-full" />
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transparent</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* BENTO ITEM 4: Employer Dashboard (Horizontal Rectangle) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.3 }}
                        className="group relative md:col-span-2 lg:col-span-2 row-span-1 rounded-[2rem] bg-emerald-600 overflow-hidden text-white pattern-boxes pattern-emerald-700 pattern-bg-emerald-600 pattern-size-4 pattern-opacity-20"
                    >
                         <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-transparent" />
                         <div className="p-6 lg:p-8 h-full flex flex-col justify-center relative z-10 w-full sm:w-2/3">
                            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20">
                                <LineChart className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Automated HR Dashboard</h3>
                            <p className="text-emerald-50 text-sm leading-relaxed mb-4">
                                Zero operational overhead for employers. Deductions happen automatically through payroll integrations.
                            </p>
                         </div>
                         {/* Abstract UI cut-off on the right */}
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 hidden sm:block w-64 h-48 bg-white rounded-l-3xl shadow-2xl p-4 border-l border-y border-emerald-400">
                             <div className="flex gap-2 mb-4">
                                 <div className="w-3 h-3 rounded-full bg-slate-200" />
                                 <div className="w-3 h-3 rounded-full bg-slate-200" />
                                 <div className="w-3 h-3 rounded-full bg-slate-200" />
                             </div>
                             <div className="space-y-3">
                                 <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                                 <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                                 <div className="h-12 w-full bg-emerald-50 rounded-xl mt-4" />
                             </div>
                         </div>
                    </motion.div>

                    {/* BENTO ITEM 5: Omni-channel Access (Horizontal Rectangle) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: 0.4 }}
                        className="group relative md:col-span-1 lg:col-span-2 row-span-1 rounded-[2rem] bg-white border border-slate-200 shadow-xs overflow-hidden flex items-center"
                    >
                        <div className="p-6 lg:p-8 flex items-center gap-6 w-full">
                            <div className="hidden sm:flex shrink-0 w-24 h-24 rounded-2xl bg-amber-50 border border-amber-100 items-center justify-center text-amber-600 relative overflow-hidden">
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
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
