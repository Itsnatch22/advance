"use client";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import React, { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroStats from "./HeroStats";
import HeroPhone from "./HeroPhone";
import { GridSystem } from "./grid";
import { BorderBeam } from "./ui/border-beam";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function Hero() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const appUrl = process.env.NEXT_PUBLIC_DASHBOARD_APP_URL ?? "https://app.eaziwage.com";
    router.push(`${appUrl}/register?email=${encodeURIComponent(email)}`);
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const subscribed = searchParams.get("subscribed");
    if (!subscribed) return;

    if (subscribed === "confirmed") {
      toast.success("Subscription confirmed! Welcome to EaziWage updates.", {
        duration: 6000,
      });
    } else if (subscribed === "expired") {
      toast.error("Confirmation link expired. Your link was valid for 24 hours — please subscribe again.", {
        duration: 6000,
      });
    } else if (subscribed === "invalid") {
      toast.error("Invalid confirmation link. Please try subscribing again.", {
        duration: 6000,
      });
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("subscribed");
    window.history.replaceState({}, "", url.toString());
  }, [searchParams]);

  return (
    <GridSystem
      variant="dots"
      opacity={0.03}
      className="bg-white py-40"
    >
      {/* Architectural Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-[-10%] h-200 w-200 rounded-full bg-green-50/50 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-150 w-150 rounded-full bg-emerald-50/50 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Content Column */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
            >
              <Sparkles className="h-4 w-4" />
              <span>Financial Freedom for Everyone</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-10 font-serif text-6xl leading-tight font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
            >
              Your Money. <br />
              <span className="text-green-600">Your Timeline.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-16 max-w-xl text-xl leading-relaxed text-slate-500"
            >
              Access up to 60% of your earned wages instantly. No loans, no
              interest, no waiting for payday. Just your hard-earned money when
              you need it most.
            </motion.p>

            <motion.form
              onSubmit={handleContinue}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mb-20 w-full max-w-xl"
            >
              <div className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 p-2 backdrop-blur-xl transition-all duration-500 focus-within:border-green-500/30 focus-within:shadow-2xl focus-within:shadow-green-500/10 sm:flex-row">
                <BorderBeam
                  size={120}
                  duration={8}
                  colorFrom="#00B37E"
                  colorTo="#006F42"
                />
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
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </motion.button>
              </div>
            </motion.form>

            {/* Stats Row — async server component wrapped in Suspense */}
            <div className="border-t border-slate-100 pt-8">
              <Suspense fallback={<StatsFallback />}>
                <HeroStats />
              </Suspense>
            </div>
          </div>

          {/* Visual Column */}
          <HeroPhone autoPlay cycleInterval={3000} />
        </div>
      </div>
    </GridSystem>
  );
}

function StatsFallback() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-7 w-16 rounded-lg bg-slate-100" />
          <div className="h-3 w-20 rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
