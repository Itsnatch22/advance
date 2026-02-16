"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Typed from "typed.js";
import { useEffect, useRef } from "react";

export default function CulturePage() {
  const typedRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current!, {
      strings: ["Culture", "Vibe", "Innovation", "Identity"],
      typeSpeed: 80,
      backSpeed: 50,
      loop: true,
      backDelay: 1800,
    });

    return () => typed.destroy();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Enhanced ambient glow with refined opacity */}
      <div className="absolute right-0 top-0 h-150 w-150 rounded-full bg-linear-to-br from-emerald-100/40 via-green-100/30 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 h-150 w-150 rounded-full bg-emerald-50/40 blur-3xl" />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">

        {/* LEFT – Enhanced copy section */}
        <div className="space-y-7 text-left">
          {/* Culture badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Our Culture
          </motion.div>

          {/* Enhanced heading with better typography */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            The{" "}
            <span
              ref={typedRef}
              className="inline-block min-w-50 bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent sm:min-w-62.5 lg:min-w-75"
            />
            at EaziWage
          </motion.h1>

          {/* Enhanced description with better contrast */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl lg:leading-relaxed"
          >
            Late-night commits. Big ideas. Small team.  
            We build tools that help people breathe financially.
            No corporate theatre. Just sharp minds shipping.
          </motion.p>

          {/* Enhanced tagline with refined styling */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="text-base italic text-slate-500 sm:text-lg"
          >
            Re-writing what fintech means for Africa.
          </motion.p>

          {/* Enhanced CTA link with better interaction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-4"
          >
            <Link
              href="mailto:support@eaziwage.com"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-linear-to-r from-emerald-50 to-green-50 px-5 py-3 font-semibold text-emerald-700 ring-1 ring-emerald-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <span>support@eaziwage.com</span>
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT – Enhanced code block visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative hidden lg:block"
        >
          {/* Subtle glow behind code block */}
          <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-emerald-100/50 via-green-100/30 to-transparent blur-2xl"></div>

          {/* Enhanced code block card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-10 lg:p-12">
            {/* Code file header */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 pb-4">
              <p className="font-mono text-sm font-medium text-slate-500">
                // culture.ts
              </p>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
              </div>
            </div>

            {/* Enhanced code block with syntax-like styling */}
            <pre className="font-mono text-sm leading-relaxed text-slate-800 sm:text-base">
              <code>
                <span className="text-purple-600">const</span>{" "}
                <span className="text-blue-600">team</span>{" "}
                <span className="text-slate-600">=</span>{" "}
                <span className="text-slate-600">[</span>
                {"\n  "}
                <span className="text-emerald-600">&quot;builders&quot;</span>
                <span className="text-slate-600">,</span>
                {"\n  "}
                <span className="text-emerald-600">&quot;dreamers&quot;</span>
                <span className="text-slate-600">,</span>
                {"\n  "}
                <span className="text-emerald-600">&quot;problem solvers&quot;</span>
                {"\n"}
                <span className="text-slate-600">]</span>
                {"\n\n"}
                <span className="text-blue-600">ship</span>
                <span className="text-slate-600">()</span>
                {"\n"}
                <span className="text-blue-600">learn</span>
                <span className="text-slate-600">()</span>
                {"\n"}
                <span className="text-blue-600">coffee</span>
                <span className="text-slate-600">()</span>
                {"\n"}
                <span className="text-blue-600">repeat</span>
                <span className="text-slate-600">()</span>
              </code>
            </pre>

            {/* Decorative accent line */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}