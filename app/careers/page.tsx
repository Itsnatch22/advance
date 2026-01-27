"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Lottie from "lottie-react";
import Startup from "@/public/Startup.json";

/*
  Structure:
  - Page wrapper
  - HeroAnimation
  - Heading
  - Description
  - CTA
  Later you can add:
  - OpenRolesGrid
  - CultureSection
  - BenefitsSection
*/

export default function CareersPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 via-green-100 to-green-200 px-6">
      {/* soft background glow for Stripe-tier luxury feel */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl" />

      <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <HeroAnimation />

        <HeroTitle />

        <HeroDescription />

        <ContactCTA />
      </section>
    </main>
  );
}

/* ----------------------------- pieces ----------------------------- */

function HeroAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-8 h-52 w-52 sm:h-64 sm:w-64"
    >
      <Lottie animationData={Startup} loop />
    </motion.div>
  );
}

function HeroTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
    >
      Careers launching soon
    </motion.h1>
  );
}

function HeroDescription() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mt-5 max-w-2xl text-base text-neutral-700 sm:text-lg"
    >
      We’re building something meaningful — tools that help people access their
      money faster.  
      If you’re sharp, curious, and allergic to mid work, you’ll fit right in.
    </motion.p>
  );
}

function ContactCTA() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-8 flex items-center gap-2 text-sm sm:text-base"
    >
      <span className="text-neutral-600">Want early access?</span>

      <Link
        href="mailto:support@eaziwage.com"
        className="group inline-flex items-center gap-1 font-medium text-emerald-700 transition hover:text-emerald-900"
      >
        support@eaziwage.com
        <ArrowUpRight
          size={16}
          className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </Link>
    </motion.div>
  );
}
