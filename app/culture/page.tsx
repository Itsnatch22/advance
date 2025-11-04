"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Typed from "typed.js";
import { useRef, useEffect } from "react";

export default function CulturePage() {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Culture", "Vibe", "Innovation", "Identity"],
      typeSpeed: 100,
      backSpeed: 80,
      loop: true,
      backDelay: 2000,
      smartBackspace: true,
    });
    return () => typed.destroy();
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-20 bg-gradient-to-br from-green-200 via-green-300 to-emerald-300 text-center md:text-left">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="w-full max-w-3xl"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 leading-tight">
          The <span ref={typedRef} className="text-emerald-700" />{" "}
          <span className="text-neutral-900">at EaziWage</span>
        </h1>

        <p className="leading-relaxed text-base sm:text-lg md:text-xl text-neutral-800">
          It all started with a single speck of an idea, to a bunch of{" "}
          <code className="text-sm sm:text-base font-mono bg-white/30 px-1 py-0.5 rounded">
            code
          </code>{" "}
          to late-night commits mixed with caffeine and brainstorming — thanks to{" "}
          <Link
            href="https://github.com"
            target="_blank"
            className="text-purple-700 underline underline-offset-2 hover:text-purple-800 transition"
          >
            GitHub
          </Link>{" "}
          and{" "}
          <Link
            href="https://nextjs.org"
            target="_blank"
            className="text-purple-700 underline underline-offset-2 hover:text-purple-800 transition"
          >
            Next.js
          </Link>
          . Our culture isn’t just about *how* we work; it’s about *why* we build.
        </p>

        <p className="mt-4 italic text-sm sm:text-base md:text-lg text-neutral-900">
          Here's to re-writing what fintech means to Africa.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="mt-10 p-4 sm:p-6 border border-dashed border-black rounded-lg bg-white/30 backdrop-blur-md"
        >
          <p className="font-mono text-xs sm:text-sm tracking-wide mb-3 sm:mb-4 text-neutral-700">
            // The full story is currently loading... Stay tuned for updates!
          </p>
          <p className="mt-1 font-semibold text-base sm:text-lg">Coming Soon 🚧</p>
        </motion.div>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-900 flex flex-wrap items-center justify-center md:justify-start gap-2">
          For inquiries, reach us at{" "}
          <Link
            href="mailto:info@eaziwage.com"
            className="font-medium text-neutral-950 hover:underline underline-offset-2"
          >
            support@eaziwage.com
          </Link>
          <ArrowUpRight size={16} className="inline-block ml-1" />
        </p>
      </motion.div>
    </section>
  );
}
