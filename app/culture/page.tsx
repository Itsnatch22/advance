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
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-green-50">
      {/* soft light glow */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-3xl" />

      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-2">

        {/* LEFT — COPY */}
        <div className="space-y-6 text-left">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-neutral-900 lg:text-6xl"
          >
            The{" "}
            <span
              ref={typedRef}
              className="text-emerald-600"
            />{" "}
            at EaziWage
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-lg text-neutral-600"
          >
            Late-night commits. Big ideas. Small team.  
            We build tools that help people breathe financially.
            No corporate theatre. Just sharp minds shipping.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="italic text-neutral-500"
          >
            Re-writing what fintech means for Africa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Link
              href="mailto:support@eaziwage.com"
              className="group inline-flex items-center gap-2 font-medium text-emerald-700"
            >
              support@eaziwage.com
              <ArrowUpRight className="transition group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — VISUAL / ACCENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative hidden lg:block"
        >
          <div className="rounded-3xl border border-emerald-100 bg-white/70 p-10 backdrop-blur-xl shadow-xl">
            <p className="font-mono text-sm text-neutral-500">
              // culture.ts
            </p>

            <pre className="mt-4 text-sm text-neutral-800">
              {`const team = [
                "builders",
                "dreamers",
                "problem solvers"
              ]

              ship()
              learn()
              repeat()`}
            </pre>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
