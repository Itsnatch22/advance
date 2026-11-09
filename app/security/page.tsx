"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Database,
  FileClock,
  KeyRound,
  LockKeyhole,
  Network,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { FloatingOrb } from "@/components/shared/FloatingOrb";

const trustIndicators = [
  {
    title: "AES-256 encryption",
    description: "Encryption for stored data, as implemented.",
    icon: LockKeyhole,
  },
  {
    title: "TLS 1.3",
    description: "Protection for data moving between systems.",
    icon: Network,
  },
  {
    title: "Role-based access",
    description: "Permissions help limit access to what is needed.",
    icon: KeyRound,
  },
  {
    title: "Administrative audit logs",
    description: "Relevant administrative actions are recorded.",
    icon: FileClock,
  },
];

const securityLayers = [
  {
    id: "infrastructure",
    title: "Infrastructure Security",
    icon: Network,
    description:
      "Managed infrastructure and operational safeguards support availability and resilience.",
    customerImpact:
      "These measures help keep the service dependable and better prepared for common disruptions.",
    details: [
      "Supabase-hosted infrastructure",
      "Automated backups and point-in-time recovery, where configured",
      "Cloudflare DDoS protection",
      "Service and uptime monitoring",
    ],
  },
  {
    id: "encryption",
    title: "Data Encryption",
    icon: LockKeyhole,
    description:
      "Encryption helps protect sensitive information while stored and as it travels between systems.",
    customerImpact:
      "It reduces the risk of information being read if it is accessed outside its intended context.",
    details: [
      "AES-256 encryption at rest",
      "TLS 1.3 for data in transit",
      "Safeguards for sensitive identifiers and financial information",
      "Controls intended to limit unnecessary plaintext exposure",
    ],
  },
  {
    id: "access",
    title: "Access Control",
    icon: KeyRound,
    description:
      "Authentication, defined roles, and database-level policies help keep information within permitted boundaries.",
    customerImpact:
      "People and systems should only access the information their role and permissions allow.",
    details: [
      "Row Level Security (RLS) policies",
      "Administrator, employer, and employee roles",
      "Separation of privileged service access",
      "Supabase authentication",
    ],
  },
  {
    id: "accountability",
    title: "Compliance & Accountability",
    icon: FileClock,
    description:
      "Operational controls and clear responsibilities support the careful handling of customer information.",
    customerImpact:
      "Relevant administrative actions can be reviewed, and personal financial data is not sold or rented.",
    details: [
      "Administrative audit trails",
      "Data handling subject to applicable obligations",
      "Personal financial data is not sold or rented",
    ],
  },
];

const protectionPractices = [
  {
    title: "Protecting information",
    description:
      "Encryption helps protect information stored by the service and data sent between systems.",
    icon: Database,
  },
  {
    title: "Limiting access",
    description:
      "Authentication and access policies help restrict information to permitted users and services.",
    icon: KeyRound,
  },
  {
    title: "Maintaining accountability",
    description:
      "Administrative audit logs support visibility into relevant actions taken in the platform.",
    icon: FileClock,
  },
  {
    title: "Supporting resilience",
    description:
      "Backups, recovery capabilities, and service monitoring help support reliable operations.",
    icon: Activity,
  },
];

export default function SecurityPage() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-white text-slate-900"><div className="relative z-10">
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] right-[10%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="bottom-[12%] left-[8%]"
        />
      </div>

      <section className="relative px-6 py-24 sm:py-28 lg:py-36">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-7 text-left">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-700 uppercase"
            >
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Security &amp; Trust</span>
            </motion.div>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.05 }}
              className="max-w-2xl font-serif text-5xl leading-tight font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
            >
              Your trust. Our responsibility.
            </motion.h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.15 }}
              className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl"
            >
              EaziWage helps employees access earned wages with confidence.
              Protecting the information entrusted to us is central to how we
              build and operate our platform.
            </motion.p>
            <p className="max-w-xl text-base leading-relaxed text-slate-500">
              We use layered security measures, controlled access, and
              established data-protection practices to safeguard customer
              information.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="#security-architecture"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-green-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 active:translate-y-0"
              >
                Explore our security
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="#privacy"
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-bold text-green-700 transition hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
              >
                Our privacy commitment
              </Link>
            </div>
          </div>

          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.1 }}
            aria-labelledby="security-at-a-glance"
            className="rounded-[2rem] border border-slate-200/60 bg-white/75 p-6 shadow-xl shadow-green-900/5 backdrop-blur-2xl sm:p-8"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-700 ring-1 ring-green-500/10">
                <ShieldCheck size={22} aria-hidden="true" />
              </div>
              <h2
                id="security-at-a-glance"
                className="font-serif text-xl font-bold text-slate-900"
              >
                Security at a glance
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {trustIndicators.map((indicator) => (
                <div
                  key={indicator.title}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <indicator.icon
                    size={20}
                    strokeWidth={1.7}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-green-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {indicator.title}
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {indicator.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div></section>

      <section
        id="security-architecture"
        className="relative z-10 scroll-mt-20 px-6 py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <h2 className="mb-4 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Security works in layers.
            </h2>
            <p className="text-lg leading-relaxed text-slate-500">
              Protecting financial information takes more than one safeguard.
              These measures work across infrastructure, data, access, and
              operational practices.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {securityLayers.map((layer, index) => {
              const isActive = activeLayer === layer.id;
              return (
                <motion.article
                  key={layer.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: reduceMotion ? 0 : (index % 2) * 0.06,
                  }}
                  className={`overflow-hidden rounded-[2rem] border p-6 transition-all duration-300 sm:p-8 ${
                    isActive
                      ? "border-green-600/40 bg-white shadow-lg shadow-green-900/5"
                      : "border-slate-200/80 bg-white/80 shadow-sm hover:border-green-500/40 hover:shadow-lg hover:shadow-green-900/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700"
                    >
                      <layer.icon size={23} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-bold text-slate-900">
                        {layer.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 border-l-2 border-green-600/50 pl-4 text-sm leading-6 text-slate-600">
                    {layer.customerImpact}
                  </p>
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`security-details-${layer.id}`}
                    onClick={() => {
                      setActiveLayer(isActive ? null : layer.id);
                    }}
                    className="mt-5 inline-flex min-h-10 items-center gap-2 rounded text-sm font-bold text-green-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-600 hover:text-green-800"
                  >
                    {isActive ? "Hide details" : "View measures"}
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                      className={`transition-transform duration-300 ${
                        isActive ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`security-details-${layer.id}`}
                        initial={
                          reduceMotion ? false : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 mb-4 h-px w-full bg-slate-100" />
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {layer.details.map((detail) => (
                            <li
                              key={detail}
                              className="flex items-start gap-2 text-sm leading-5 text-slate-600"
                            >
                              <CheckCircle2
                                size={16}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-green-500"
                              />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div></section>

      <section className="relative z-10 border-y border-slate-200 bg-slate-50/80 px-6 py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl">
              Protection is built into the details.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
              Security controls matter when they make a practical difference to
              how information is handled.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {protectionPractices.map((practice) => (
              <div key={practice.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm ring-1 ring-slate-200">
                  <practice.icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    {practice.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {practice.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div></section>

      <section
        id="privacy"
        className="relative z-10 scroll-mt-20 px-6 py-24 lg:py-32"
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-slate-900 px-7 py-12 shadow-2xl shadow-slate-900/15 sm:px-12 sm:py-16"
        >
          <div className="pointer-events-none absolute -top-16 -right-12 h-72 w-72 rounded-full bg-green-500/15 blur-[80px]" />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                <Database size={25} aria-hidden="true" />
              </div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your data stays yours.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Your financial information is personal. EaziWage uses customer
                information to provide its services and improve the experience,
                subject to applicable requirements and our privacy practices. We
                do not sell or rent personal financial data.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Information may be processed or disclosed as needed to deliver
                the service or meet legal obligations. See our Privacy Policy
                for details.
              </p>
            </div>
            <Link
              href="/data-privacy-protection"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-6 text-sm font-bold text-green-300 transition hover:bg-green-500/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400"
            >
              Read our Privacy Policy
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 pb-20">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl border border-slate-200/80 bg-white/70 p-7 shadow-sm sm:p-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Security is an ongoing responsibility.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              Operational controls and administrative audit trails support
              responsible platform operations. Our data-handling practices are
              subject to applicable privacy obligations.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-green-700"
              />
              <p className="text-sm leading-6 text-slate-600">
                Security and privacy practices are part of how we operate the
                service.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <FileClock
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-green-700"
              />
              <p className="text-sm leading-6 text-slate-600">
                Relevant administrative actions are recorded for accountability.
              </p>
            </div>
          </div>
        </div></section>

      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2.5rem] bg-green-700 px-8 py-10 text-white shadow-xl shadow-green-900/10 sm:px-12 sm:py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Confidence starts with transparency.
            </h2>
            <p className="mt-3 text-base leading-7 text-green-50/90">
              Understand how your information is protected and how it is used.
              Our security and privacy practices are part of our responsibility
              to you.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/data-privacy-protection"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-green-800 transition hover:-translate-y-0.5 hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Contact EaziWage
            </Link>
          </div>
        </div></section>
      </div></section>
  );
}
