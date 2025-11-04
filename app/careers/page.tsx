"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Startup from "@/public/Startup.json";
import Lottie from "lottie-react";

export default function CareersPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-10 md:px-16 lg:px-24 py-20 bg-gradient-to-br from-green-200 via-green-300 to-emerald-300 text-center">
      <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mb-6">
        <Lottie animationData={Startup} loop={true} />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-4 leading-tight"
      >
        Careers page coming soon.
      </motion.h1>

      <p className="text-base sm:text-lg md:text-xl text-neutral-800 max-w-2xl mx-auto">
        We’re growing fast and building opportunities for young, ambitious minds.  
        Keep your eyes peeled 👀 — this space is about to evolve.
      </p>

      <p className="mt-6 text-sm sm:text-base md:text-lg text-neutral-900 flex flex-wrap items-center justify-center gap-2">
        For inquiries, reach us at{" "}
        <Link
          href="mailto:support@eaziwage.com"
          className="underline underline-offset-2 hover:text-emerald-700 transition font-medium"
        >
          support@eaziwage.com
        </Link>
        <ArrowUpRight size={16} className="inline-block" />
      </p>
    </section>
  );
}
