'use client';
import { motion } from 'framer-motion';
import Link from 'next/link'
import { Button } from './ui/button'
import { Zap, Users, Sparkles, Banknote, Star, Check,
    Wallet, ArrowRight, Play, TrendingUp, ChevronRight } 
from 'lucide-react'
import { useState } from 'react';

const heroStats = [
  { value: '50K+', label: 'Active Users', icon: Users },
  { value: '$2B+', label: 'Disbursed', icon: Banknote },
  { value: '<3s', label: 'Instant Transfer', icon: Zap },
  { value: '4.9', label: 'Rating', icon: Star },
];

export default function Hero() {
    const [ watch, handleSetWatch ] = useState(false);

    const handleVideoModal = () => {
        handleSetWatch(true);
        console.log('Video player not implemented yet')
    }
  return (
    <section className='relative pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden'>
        {/* Background effects */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-10 sm:top-20 right-0 w-[400px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] bg-primary/10 rounded-full blur-[100px] sm:blur-[120px] lg:blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[350px] sm:w-[450px] lg:w-[500px] h-[350px] sm:h-[450px] lg:h-[500px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[120px] lg:blur-[150px]" />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center'>
                {/* Left Column - Content */}
                <div className='stagger-content'>
                    {/* Badge */}
                    <div className='inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-white/20 backdrop-blur-sm mb-6 sm:mb-8'>
                        <Sparkles className='w-3 h-3 sm:w-4 sm:h-4' />
                        <span>Financial Freedom for Everyone</span>
                    </div>

                    {/* Heading */}
                    <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className='font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 mb-4 sm:mb-6'>
                        Your Money.
                        <br/>
                        <span className='text-green-600'>Your Timeline.</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed mb-8 sm:mb-10">
                        Access up to 60% of your earned wages instantly. No loans, no interest, no waiting for payday. 
                        Just your hard-earned money when you need it most.
                    </motion.p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-14">
                        <Link href="https://app.eaziwage.com/register">
                        <Button type='button' onClick={handleVideoModal} size="lg" variant="outline" className="flex items-center h-14 justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-900/20" data-testid="hero-watch-demo">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                        {heroStats.map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 + (i * 0.1) }}
                            className="text-center sm:text-left"
                        >
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mb-1">
                                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                        </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Phone Mockup */}
                <div className="relative mt-12 lg:mt-0">
                    {/* Background glow effect */}
                    <div className="absolute -top-6 sm:-top-10 -left-6 sm:-left-10 w-full h-full bg-linear-to-br from-primary/20 to-emerald-500/20 rounded-4xl sm:rounded-[3rem] transform rotate-6 blur-sm" />
                    
                    {/* Phone container */}
                    <div className="relative bg-slate-900 rounded-[1.75rem] sm:rounded-[2.5rem] p-2.5 sm:p-4 shadow-2xl shadow-slate-900/50 glow-primary">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl sm:rounded-4xl overflow-hidden">
                            {/* Phone screen header */}
                            <div className="bg-linear-to-br from-primary via-emerald-500 to-teal-600 p-5 sm:p-6 md:p-8 text-white">
                                <div className="flex justify-between items-start mb-6 sm:mb-8">
                                    <div>
                                        <p className="text-xs sm:text-sm opacity-80 mb-1">Available Balance</p>
                                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold">KES 12,450</p>
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                                        <Wallet className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                    </div>
                                </div>
                                <div className="bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5">
                                    <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-3">
                                        <span className="opacity-80">Earned this month</span>
                                        <span className="font-bold">USD 191.54</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
                                        <div className="bg-white rounded-full h-2 sm:h-3 w-1/2 shadow-lg" />
                                    </div>
                                    <p className="text-[10px] sm:text-xs mt-2 sm:mt-3 opacity-70">60% available for advance</p>
                                </div>
                            </div>
                            
                            {/* Phone screen content */}
                            <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 bg-slate-50 dark:bg-slate-900">
                                <div className="flex items-center justify-between p-3.5 sm:p-4 md:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Quick Advance</p>
                                            <p className="text-xs sm:text-sm text-slate-500">Get funds in seconds</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                                </div>
                                
                                <div className="flex items-center justify-between p-3.5 sm:p-4 md:p-5 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">USD 38.46 Sent</p>
                                            <p className="text-xs sm:text-sm text-slate-500">To Mobile Wallet · 2 sec ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating card - Hidden on mobile, visible on larger screens */}
                    <div className="hidden md:block absolute -right-4 lg:-right-8 top-1/3 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl p-3.5 sm:p-4 md:p-5 animate-float border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white whitespace-nowrap">Transfer Complete</p>
                                <p className="text-xs sm:text-sm text-slate-500">1.8 seconds</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}