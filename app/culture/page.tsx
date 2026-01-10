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
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-emerald-300 px-6 py-20 text-center sm:px-10 md:px-16 md:text-left lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="w-full max-w-3xl"
      >
        <h1 className="mb-6 font-serif text-3xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl">
          The <span ref={typedRef} className="text-emerald-700" />{" "}
          <span className="text-neutral-900">at EaziWage</span>
        </h1>

        <p className="text-base leading-relaxed text-neutral-800 sm:text-lg md:text-xl">
          It all started with a single speck of an idea, to a bunch of{" "}
          <code className="rounded bg-white/30 px-1 py-0.5 font-mono text-sm sm:text-base">
            code
          </code>{" "}
          to late-night commits mixed with caffeine and brainstorming — thanks
          to{" "}
          <Link
            href="https://github.com"
            target="_blank"
            className="text-purple-700 underline underline-offset-2 transition hover:text-purple-800"
          >
            GitHub
          </Link>{" "}
          and{" "}
          <Link
            href="https://nextjs.org"
            target="_blank"
            className="text-purple-700 underline underline-offset-2 transition hover:text-purple-800"
          >
            Next.js
          </Link>
          . Our culture isn’t just about *how* we work; it’s about *why* we
          build.
        </p>

        <p className="mt-4 text-sm text-neutral-900 italic sm:text-base md:text-lg">
          Here's to re-writing what fintech means to Africa.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="mt-10 rounded-lg border border-dashed border-black bg-white/30 p-4 backdrop-blur-md sm:p-6"
        >
          <p className="mb-3 font-mono text-xs tracking-wide text-neutral-700 sm:mb-4 sm:text-sm">
            // The full story is currently loading... Stay tuned for updates!
          </p>
          <p className="mt-1 text-base font-semibold sm:text-lg">
            Coming Soon 🚧
          </p>
        </motion.div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-base text-neutral-900 sm:text-lg md:justify-start md:text-xl">
          For inquiries, reach us at{" "}
          <Link
            href="mailto:support@eaziwage.com"
            className="font-medium text-neutral-950 underline-offset-2 hover:underline"
          >
            support@eaziwage.com
          </Link>
          <ArrowUpRight size={16} className="ml-1 inline-block" />
        </p>
      </motion.div>
    </section>
  );
}
