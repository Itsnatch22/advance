'use client';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Zap, Users, Sparkles, Banknote, Star, Check, Wallet, TrendingUp, ChevronRight } from 'lucide-react';
import React, { useState, useRef, Suspense, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import HeroStats from './HeroStats'; // async server component

export default function Hero() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    const containerRef = useRef<HTMLElement>(null);

    // Scroll parallax for phone mockup
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yPhone = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const rotatePhone = useTransform(scrollYProgress, [0, 1], [0, -5]);
    const opacityPhone = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Mouse parallax for the mockup
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 30 });

    function onMouseMove(event: MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
        mouseX.set(event.clientX - rect.left);
        mouseY.set(event.clientY - rect.top);
    }

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        router.push(`https://app.eaziwage.com/register?email=${encodeURIComponent(email)}`);
    };

    return (
        <section
            ref={containerRef}
            className='relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white'
        >
            {/* Architectural Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-[-10%] w-200 h-200 bg-green-50/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-150 h-150 bg-emerald-50/50 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>
                <div className='grid lg:grid-cols-2 gap-16 lg:gap-24 items-center'>

                    {/* Content Column */}
                    <div className='relative z-10'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className='inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600 mb-8'
                        >
                            <Sparkles className='w-4 h-4' />
                            <span>Financial Freedom for Everyone</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className='font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-8'
                        >
                            Your Money. <br />
                            <span className='text-green-600'>Your Timeline.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className='text-lg leading-relaxed text-slate-500 max-w-lg mb-12'
                        >
                            Access up to 60% of your earned wages instantly. No loans, no interest, no waiting for payday. 
                            Just your hard-earned money when you need it most.
                        </motion.p>

                        <motion.form
                            onSubmit={handleContinue}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative w-full max-w-xl mb-16"
                        >
                            <div className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white/50 p-2 backdrop-blur-xl transition-all duration-500 focus-within:border-green-500/30 focus-within:shadow-2xl focus-within:shadow-green-500/10 sm:flex-row">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 rounded-xl border-0 bg-transparent px-5 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-green-600 px-8 py-4 font-bold text-white shadow-xl shadow-green-500/20 transition-all duration-300 hover:bg-green-500"
                                >
                                    <span className="relative z-10">Continue</span>
                                    <ChevronRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                </motion.button>
                            </div>
                        </motion.form>

                        {/* Stats Row — async server component wrapped in Suspense */}
                        <div className="pt-8 border-t border-slate-100">
                            <Suspense fallback={<StatsFallback />}>
                                <HeroStats />
                            </Suspense>
                        </div>
                    </div>

                    {/* Visual Column */}
                    <motion.div
                        onMouseMove={onMouseMove}
                        onMouseLeave={() => { x.set(0); y.set(0); }}
                        style={{ y: yPhone, rotate: rotatePhone, opacity: opacityPhone }}
                        className="relative perspective-1000 hidden lg:block"
                    >
                        {/* 3D Phone Frame */}
                        <motion.div
                            style={{ rotateX, rotateY }}
                            className="relative z-20 mx-auto w-full max-w-85 rounded-[3rem] border-12 border-slate-900 bg-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]"
                        >
                            <div className="relative overflow-hidden rounded-[2.2rem] bg-slate-50">
                                {/* App Interface */}
                                <div className="bg-linear-to-br from-green-600 to-emerald-700 p-8 text-white">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Available Balance</p>
                                            <p className="text-3xl font-bold">KES 12,450</p>
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                            <Wallet className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/10">
                                        <div className="flex justify-between text-xs font-bold mb-3">
                                            <span className="opacity-70">Earned this month</span>
                                            <span>KSH 24,708.66</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "60%" }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-tighter mt-3 opacity-50 text-center">60% available for advance</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Quick Advance</p>
                                                <p className="text-xs text-slate-400">Instant Disbursement</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-green-50/50 rounded-2xl border border-green-100">
                                        <div className="h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center text-white">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">KSH 4,961.34 Sent</p>
                                            <p className="text-xs text-green-600 font-bold">Transfer Complete · 2s ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Notification */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-12 top-1/4 z-30 hidden xl:block"
                        >
                            <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 backdrop-blur-xl shadow-2xl shadow-slate-900/10">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                        <Check className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Transfer Complete</p>
                                        <p className="text-xs font-bold text-green-600">1.8 seconds</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Ambient decorative elements */}
                        <div className="absolute -z-10 -bottom-10 -left-10 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// Shown while HeroStats is streaming in — matches the stats grid layout
function StatsFallback() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-7 w-16 rounded-lg bg-slate-100" />
                    <div className="h-3 w-20 rounded-lg bg-slate-100" />
                </div>
            ))}
        </div>
    );
}