"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import { ArrowRight, Calendar } from "lucide-react";

export default function CTA() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Transform Your Workplace",
        "Boost Retention",
        "Increase Payroll Efficiency",
        "Encourage Punctuality & Attendance",
      ],
      typeSpeed: 100,
      backSpeed: 80,
      loop: true,
      smartBackspace: true,
      cursorChar: "|",
      backDelay: 2000,
    });
    return () => typed.destroy();
  }, []);

  return (
    <section className="relative flex items-center overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 py-24 sm:py-32 lg:py-40">
      {/* Enhanced overlay with gradient */}
      
      
      {/* Ambient glow effects */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl"></div>
      
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* CTA Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 flex justify-center sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-white/20 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
            Get Started Today
          </div>
        </motion.div>

        {/* Enhanced heading with typed effect */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-6 font-serif text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-6xl"
        >
          Ready To{" "}
            <span 
              ref={typedRef} 
              className="inline-block min-w-70 bg-linear-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent sm:min-w-100 lg:min-w-150"
            />
          ?
        </motion.h2>

        {/* Enhanced description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg lg:text-xl"
        >
          Join leading companies already using EaziWage to improve employee
          satisfaction and reduce turnover.
        </motion.p>

        {/* Enhanced CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
        >
          {/* Primary CTA */}
          <Link href="mailto:support@eaziwage.com">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-green-500 px-8 py-4 font-semibold text-white shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:shadow-emerald-500/60"
            >
              <Calendar className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
              <span>Schedule a Demo</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </motion.button>
          </Link>

          {/* Secondary CTA */}
          <Link href="/contact/sales">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
            >
              <span>Contact Sales</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8 text-sm text-slate-300 sm:gap-12"
        >
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Free setup</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">24/7 support</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">No long-term contracts</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">ROI guaranteed</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}