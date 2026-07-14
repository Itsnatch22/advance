"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Webhook,
  Terminal,
  Sparkles,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import Lottie from "lottie-react";
import EditDocument from "@/public/Edit-document.json";
import { GridSystem } from "@/components/grid";
import { EMAIL_CONFIG } from '@/constants/config';
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { useParallax } from "@/hooks/use-parallax";

/* ---------- Shared primitives (same as Careers) ---------- */

const TiltCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const {
    rotateX,
    rotateY,
    spotlightBackground,
    handleMouseMove,
    handleMouseLeave,
  } = useParallax();

  return (
    <motion.div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className={`group relative h-full overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10 ${className}`}
      >
        <motion.div
          style={{
            background: spotlightBackground,
          }}
          className="pointer-events-none absolute inset-0"
        />
        {children}
        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

/* ---------- Page ---------- */

export default function DocsPage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <GridSystem variant="dots" opacity={0.03} className="min-h-screen bg-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] left-[10%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="right-[10%] bottom-[10%]"
        />
      </div>

      {/* Hero */}
      <motion.section
        ref={containerRef}
        style={{ y: yHero, opacity: opacityHero }}
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-32 pb-24 text-center lg:pt-48 lg:pb-40"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-16 h-64 w-64 lg:h-80 lg:w-80"
        >
          <div className="absolute -inset-10 rounded-full bg-green-500/10 blur-3xl" />
          <Lottie animationData={EditDocument} loop className="relative z-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
        >
          Docs launching <br />
          <span className="text-green-600">soon</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-500"
        >
          Full API references, SDK guides, and integration recipes are on their
          way. <br className="hidden lg:block" />
          In the meantime, reach out and we&apos;ll walk you through everything.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col items-center gap-6 sm:flex-row"
        >
          <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">
            Need integration help?
          </span>
          <Link
            href={`mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}`}
            className="group relative flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-green-600"
          >
            <span>{EMAIL_CONFIG.SUPPORT_EMAIL}</span>
            <ArrowUpRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </motion.div>
      </motion.section>

      {/* What's Coming Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-40 lg:px-8">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            What&apos;s Coming
          </motion.div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Everything you need to{" "}
            <span className="text-green-600">integrate</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-500">
            We&apos;re writing docs that are actually worth reading — clear,
            complete, and built for developers who hate guessing.
          </p>
        </div>

        <DocsGrid />
      </section>

      {/* Why Build on EaziWage */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-40 lg:px-8">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Why EaziWage API
          </motion.div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Built for <span className="text-green-600">developers</span>
          </h2>
        </div>

        <DevPerksGrid />
      </section>
    </GridSystem>
  );
}

/* ---------- Docs sections grid ---------- */

function DocsGrid() {
  const sections = [
    {
      icon: BookOpen,
      title: "API Reference",
      description:
        "Complete REST API documentation. Every endpoint, parameter, response shape, and error code — with live examples.",
      tags: ["REST", "JSON", "OpenAPI"],
    },
    {
      icon: Terminal,
      title: "SDKs & Libraries",
      description:
        "Official SDKs for TypeScript, Python, and more. Drop-in clients that handle auth, retries, and pagination for you.",
      tags: ["TypeScript", "Python", "Node.js"],
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description:
        "Real-time event notifications for advance requests, disbursements, repayments, and status changes.",
      tags: ["Events", "Payloads", "Signatures"],
    },
    {
      icon: Code2,
      title: "Integration Guides",
      description:
        "Step-by-step recipes for HRMS integrations, payroll sync, mobile money setup, and multi-tenant onboarding.",
      tags: ["HRMS", "Payroll", "Mobile Money"],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
      {sections.map((section) => (
        <TiltCard key={section.title}>
          <div className="relative z-10">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
              <section.icon className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <h3 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-green-700">
              {section.title}
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-slate-500">
              {section.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {section.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl bg-slate-50 px-4 py-1.5 text-xs font-bold tracking-widest text-slate-400 uppercase ring-1 ring-slate-200 transition-all duration-300 ring-inset group-hover:bg-green-600 group-hover:text-white group-hover:ring-green-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </TiltCard>
      ))}
    </div>
  );
}

/* ---------- Developer perks grid ---------- */

function DevPerksGrid() {
  const perks = [
    {
      icon: Zap,
      title: "Fast by Default",
      description:
        "Sub-100ms response times. Built on edge infrastructure across East Africa.",
    },
    {
      icon: Shield,
      title: "Secure",
      description:
        "OAuth 2.0, signed webhooks, and audit logs on every request.",
    },
    {
      icon: Globe,
      title: "Multi-country",
      description:
        "One API. Kenya, Uganda, Tanzania, and Rwanda — currency and compliance handled.",
    },
    {
      icon: Sparkles,
      title: "Developer First",
      description:
        "Sandbox environment, detailed error messages, and no gotchas in production.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {perks.map((perk) => (
        <TiltCard key={perk.title} className="p-10">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition-transform duration-500 group-hover:scale-110">
              <perk.icon className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-green-700">
              {perk.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">
              {perk.description}
            </p>
          </div>
        </TiltCard>
      ))}
    </div>
  );
}
