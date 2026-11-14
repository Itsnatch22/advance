"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { BorderBeam } from "./ui/border-beam";
import EaziWageProductPreview from "./EaziWageProductPreview";

export default function Hero() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const appUrl =
      process.env.NEXT_PUBLIC_DASHBOARD_APP_URL ?? "https://app.eaziwage.com";
    router.push(`${appUrl}/register?email=${encodeURIComponent(email)}`);
  };

  useEffect(() => {
    const subscribed = searchParams.get("subscribed");
    if (!subscribed) return;

    if (subscribed === "confirmed") {
      toast.success("Subscription confirmed! Welcome to EaziWage updates.", {
        duration: 6000,
      });
    } else if (subscribed === "expired") {
      toast.error(
        "Confirmation link expired. Your link was valid for 24 hours, please subscribe again.",
        { duration: 6000 }
      );
    } else if (subscribed === "invalid") {
      toast.error("Invalid confirmation link. Please try subscribing again.", {
        duration: 6000,
      });
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("subscribed");
    window.history.replaceState({}, "", url.toString());
  }, [searchParams]);

  const entrance = prefersReducedMotion ? false : { opacity: 0, y: 18 };

  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24">
      <div className="relative z-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-[-10%] h-200 w-200 rounded-full bg-green-50/50 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] h-150 w-150 rounded-full bg-emerald-50/50 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
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
            initial={entrance}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
            className="mx-auto max-w-5xl font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
          >
            Your earned pay,{" "}
            <span className="text-green-600">ready before payday</span>
          </motion.h1>

          <motion.p
            initial={entrance}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-500 sm:text-xl"
          >
            Access up to 60% of your earned wages instantly. No loans, no
            interest, no waiting for payday. Just your hard-earned money when
            you need it most.
          </motion.p>

          <motion.form
            onSubmit={handleContinue}
            initial={entrance}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.16,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            className="relative mx-auto mt-10 w-full max-w-xl"
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
                className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-5 py-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm"
              />
              <motion.button
                type="submit"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                className="group relative flex min-h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-green-600 px-8 py-4 font-bold text-white shadow-xl shadow-green-500/20 transition-all duration-300 hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                <span className="relative z-10">Continue</span>
                <ChevronRight
                  className="relative z-10 size-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.button>
            </div>
          </motion.form>

          <motion.figure
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.24,
              ease: [0.2, 0.7, 0.2, 1],
            }}
            className="mx-auto mt-12 max-w-7xl sm:mt-16"
          >
            <EaziWageProductPreview />
            <figcaption className="mt-4 px-2 text-center text-xs leading-5 text-slate-500 sm:text-sm">
              Product illustration above is informational only. Navigate to the
              main app for full experience
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
