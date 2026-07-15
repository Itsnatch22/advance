"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  CalendarClock,
  ArrowUpRight,
} from "lucide-react";
import { GridSystem } from "@/components/grid";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { Input } from "@/components/ui";

const EXPECTATIONS = [
  {
    icon: TrendingUp,
    title: "Weekly updates",
    description: "The latest on EaziWage and fintech trends across Africa.",
  },
  {
    icon: Sparkles,
    title: "Expert tips",
    description: "Practical advice to help you manage your earnings smarter.",
  },
  {
    icon: CalendarClock,
    title: "Event invitations",
    description: "First access to events, product launches, and promotions.",
  },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GridSystem variant="dots" opacity={0.03} className="min-h-screen bg-white">
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb color="bg-green-100" delay={0} className="top-[-10%] left-[10%]" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="right-[10%] bottom-[10%]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-32 pb-24 text-center lg:pt-48 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          Newsletter
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          Stay updated with <span className="text-green-600">EaziWage</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 max-w-xl text-xl leading-relaxed text-slate-500"
        >
          Get the latest news, product updates, and financial tips delivered
          straight to your inbox.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-left text-green-700"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-sm font-medium">Check your inbox!</p>
                  <p className="mt-0.5 text-xs text-green-700/70">
                    We sent a confirmation link to your email. Click it to
                    complete your subscription.
                  </p>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-left text-red-700"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-sm font-medium">Subscription failed</p>
                  {errorMessage && (
                    <p className="mt-1 text-xs text-red-700/80">{errorMessage}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            {/* Honeypot field */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="sr-only"
            />

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-12 flex-1 rounded-xl border-slate-200 bg-white px-5 text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500/20"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-6 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Send
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-400">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </section>

      {/* What to expect */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What to <span className="text-green-600">expect</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {EXPECTATIONS.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200/60 bg-white/40 p-8 text-center backdrop-blur-2xl transition-shadow duration-500 hover:shadow-xl hover:shadow-green-500/10"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <item.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Further reading */}
      <section className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-32 text-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
          <Mail className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <p className="mb-6 text-lg text-slate-500">
          Not ready to subscribe? Explore our blog for guides, product
          updates, and insights on Earned Wage Access.
        </p>
        <Link
          href="/blogs"
          className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-green-200 hover:text-green-700"
        >
          <span>Visit the blog</span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </section>
    </GridSystem>
  );
}
