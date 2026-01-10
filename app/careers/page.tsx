"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Startup from "@/public/Startup.json";
import Lottie from "lottie-react";

export default function CareersPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-emerald-300 px-6 py-20 text-center sm:px-10 md:px-16 lg:px-24">
      <div className="mb-6 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72">
        <Lottie animationData={Startup} loop={true} />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-4 font-serif text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl md:text-5xl"
      >
        Careers page coming soon.
      </motion.h1>

      <p className="mx-auto max-w-2xl text-base text-neutral-800 sm:text-lg md:text-xl">
        We’re growing fast and building opportunities for young, ambitious
        minds. Keep your eyes peeled 👀 — this space is about to evolve.
      </p>

      <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-900 sm:text-base md:text-lg">
        For inquiries, reach us at{" "}
        <Link
          href="mailto:support@eaziwage.com"
          className="font-medium underline underline-offset-2 transition hover:text-emerald-700"
        >
          support@eaziwage.com
        </Link>
        <ArrowUpRight size={16} className="inline-block" />
      </p>
    </section>
  );
}
