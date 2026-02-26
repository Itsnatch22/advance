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
        console.error('Video player not implemented yet')
    }
  return (
    <section className='relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden'>
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid lg:grid-cols-2 gap-16 items-center'>
                <div className='stagger-content'>
                    <div className='inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-white/20 backdrop-blur-sm'>
                        <span className='h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse'/>
                        <Sparkles className='w-4 h-4' />
                        <span>Financial Freedom for Everyone</span>
                    </div>

                    <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className='font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl'>
                        Your Money.
                        <br/>
                        <span className='text-green-600'>Your Timeline</span>
                    </motion.h1>

                    <motion.p
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-xl text-slate-600 mt-4 mb-10 max-w-xl leading-relaxed">
                        Access up to 60% of your earned wages instantly. No loans, no interest, no waiting for payday. 
                        Just your hard-earned money when you need it most.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-14">
                        <Link href="https://app.eaziwage.com/register">
                        <Button size="lg" className="flex items-center h-14 justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40" data-testid="hero-get-started">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        </Link>
                        <Button type='button' onClick={handleVideoModal} size="lg" variant="outline" className="flex items-center h-14 justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-900/20" data-testid="hero-watch-demo">
                            <Play className="w-5 h-5 mr-2" />
                            Watch Demo
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {heroStats.map((stat, i) => (
                        <motion.div key={i} className="text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <stat.icon className="w-5 h-5 text-primary" />
                            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                        </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative hidden lg:block">
              <div className="absolute -top-10 -left-10 w-full h-full bg-linear-to-br from-primary/20 to-emerald-500/20 rounded-[3rem] transform rotate-6 blur-sm" />
              <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl shadow-slate-900/50 glow-primary">
                <div className="bg-white dark:bg-slate-800 rounded-4xl overflow-hidden">
                  {/* Phone screen */}
                  <div className="bg-linear-to-br from-primary via-emerald-500 to-teal-600 p-8 text-white">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-sm opacity-80 mb-1">Available Balance</p>
                        <p className="text-4xl font-bold">KES 12,450</p>
                      </div>
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Wallet className="w-7 h-7" />
                      </div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="opacity-80">Earned this month</span>
                        <span className="font-bold">USD 191.54</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="bg-white rounded-full h-3 w-1/2 shadow-lg" />
                      </div>
                      <p className="text-xs mt-3 opacity-70">60% available for advance</p>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Quick Advance</p>
                          <p className="text-sm text-slate-500">Get funds in seconds</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                    
                    <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                          <Check className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">USD 38.46 Sent</p>
                          <p className="text-sm text-slate-500">To Mobile Wallet · 2 sec ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating card */}
              <div className="absolute -right-8 top-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-5 animate-float border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Transfer Complete</p>
                    <p className="text-sm text-slate-500">1.8 seconds</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
        </div>
    </section>
  )
}