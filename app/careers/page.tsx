"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Code2, Palette, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Lottie from "lottie-react";
import Startup from "@/public/Startup.json";

/*
  Structure:
  - Page wrapper
  - HeroAnimation
  - Heading
  - Description
  - CTA
  - OpenRolesGrid (what we're looking for)
  - Values/Perks Section
*/

export default function CareersPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-50 via-white to-emerald-50/30">
      {/* Enhanced ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-175 w-175 -translate-x-1/2 rounded-full bg-linear-to-br from-emerald-100/40 via-green-100/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-125 w-125 rounded-full bg-emerald-50/40 blur-3xl" />

      {/* Hero Section */}
      <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-32">
        <HeroAnimation />
        <HeroTitle />
        <HeroDescription />
        <ContactCTA />
      </section>

      {/* What We're Looking For Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Open Roles
            </div>
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            What we&apos;re <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">building for</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            We&apos;re assembling a small, ambitious team. If you ship fast, think deeply, and care about impact — let&apos;s talk.
          </p>
        </div>

        <OpenRolesGrid />
      </section>

      {/* Why Join Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Why EaziWage
            </div>
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            What you&apos;ll <span className="bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">get here</span>
          </h2>
        </div>

        <PerksGrid />
      </section>
    </main>
  );
}

/* ----------------------------- Hero Components ----------------------------- */

function HeroAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mb-10 h-56 w-56 sm:h-72 sm:w-72"
    >
      {/* Glow behind animation */}
      <div className="absolute -inset-6 rounded-full bg-linear-to-br from-emerald-100/50 via-green-100/30 to-transparent blur-2xl"></div>
      <div className="relative">
        <Lottie animationData={Startup} loop />
      </div>
    </motion.div>
  );
}

function HeroTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
    >
      Careers launching <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">soon</span>
    </motion.h1>
  );
}

function HeroDescription() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.8 }}
      className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl"
    >
      We&apos;re building something meaningful — tools that help people access their
      money faster.  
      If you&apos;re sharp, curious, and allergic to mid work, you&apos;ll fit right in.
    </motion.p>
  );
}

function ContactCTA() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-2"
    >
      <span className="text-sm text-slate-600 sm:text-base">Want early access?</span>

      <Link
        href="mailto:support@eaziwage.com"
        className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-50 to-green-50 px-5 py-2.5 font-semibold text-emerald-700 ring-1 ring-emerald-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
      >
        <span className="text-sm sm:text-base">support@eaziwage.com</span>
        <ArrowUpRight
          size={18}
          className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
          strokeWidth={2.5}
        />
      </Link>
    </motion.div>
  );
}

/* ----------------------------- Open Roles Grid ----------------------------- */

function OpenRolesGrid() {
  const roles = [
    {
      icon: Code2,
      title: "Development",
      description: "Full-stack engineers building scalable fintech infrastructure. TypeScript, React, Node.js, payment integrations.",
      tags: ["Frontend", "Backend", "APIs"],
    },
    {
      icon: Palette,
      title: "Design",
      description: "Product designers crafting intuitive experiences for financial wellness. User research, prototyping, design systems.",
      tags: ["UI/UX", "Product", "Branding"],
    },
    {
      icon: Sparkles,
      title: "Creativity",
      description: "Brand storytellers and content creators. Social strategy, copywriting, visual content that resonates across Africa.",
      tags: ["Content", "Marketing", "Brand"],
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "Growth hackers and partnership builders. Scale user acquisition, optimize funnels, forge strategic partnerships.",
      tags: ["Marketing", "Partnerships", "Analytics"],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
      {roles.map((role, index) => (
        <motion.div
          key={role.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          {/* Icon */}
          <div className="relative z-10 mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-emerald-50 to-green-50 shadow-sm ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
            <role.icon className="h-7 w-7 text-emerald-600" strokeWidth={2} />
          </div>

          {/* Content */}
          <h3 className="relative z-10 mb-3 text-2xl font-bold tracking-tight text-slate-900">
            {role.title}
          </h3>
          <p className="relative z-10 mb-5 text-sm leading-relaxed text-slate-600">
            {role.description}
          </p>

          {/* Tags */}
          <div className="relative z-10 flex flex-wrap gap-2">
            {role.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
        </motion.div>
      ))}
    </div>
  );
}

/* ----------------------------- Perks Grid ----------------------------- */

function PerksGrid() {
  const perks = [
    {
      icon: Zap,
      title: "Ship Fast",
      description: "No bureaucracy. Ideas to production in days, not quarters.",
    },
    {
      icon: Users,
      title: "Small Team",
      description: "Your work matters. Every contribution shapes the product.",
    },
    {
      icon: TrendingUp,
      title: "Real Impact",
      description: "Build tools that help millions across Africa manage money better.",
    },
    {
      icon: Sparkles,
      title: "Ownership",
      description: "Equity stakes. You share in what we build together.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {perks.map((perk, index) => (
        <motion.div
          key={perk.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

          {/* Icon */}
          <div className="relative z-10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-emerald-50 to-green-50 ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
            <perk.icon className="h-6 w-6 text-emerald-600" strokeWidth={2} />
          </div>

          {/* Content */}
          <h3 className="relative z-10 mb-2 text-lg font-bold text-slate-900">
            {perk.title}
          </h3>
          <p className="relative z-10 text-sm leading-relaxed text-slate-600">
            {perk.description}
          </p>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
        </motion.div>
      ))}
    </div>
  );
}