"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ----------------------------- data ----------------------------- */

const bankingPartners = [
  "/partners/equity.svg",
  "/partners/kcb.svg",
  "/partners/coop.svg",
  "/partners/stanbic.svg",
  "/partners/ncba.svg",
  "/partners/family.svg",
];

const corporatePartners = [
  "/partners/naivas.svg",
  "/partners/carrefour.png",
  "/partners/mayfair.png",
  "/partners/eabl.svg",
  "/partners/jubilee.png",
  "/partners/CIC.png",
];

const techPartners = [
  "/partners/vercel.svg",
  "/partners/next.jpg",
  "/partners/supabase.svg",
  "/partners/ts.png",
  "/partners/resend.svg",
  "/partners/drizzle.jpg",
];

/* -------------------------- components -------------------------- */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-5">
      {/* Enhanced eyebrow badge */}
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        {eyebrow}
      </div>

      {/* Enhanced heading with better typography */}
      <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-5xl">
        {title}
      </h2>

      {/* Enhanced description with better contrast */}
      <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

/* Enhanced premium logo card with refined styling */
function LogoCard({ src }: { src: string }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex h-28 items-center justify-center rounded-xl border border-slate-200/60 bg-white p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-xl hover:shadow-emerald-500/10"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      <Image
        src={src}
        alt="partner logo"
        width={140}
        height={48}
        className="relative z-10 h-12 w-auto object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.div>
  );
}

/* Enhanced section with improved layout */
function PartnerSection({
  eyebrow,
  title,
  description,
  partners,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  partners: string[];
  reverse?: boolean;
}) {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div
        className={`mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 ${
          reverse ? "lg:grid-flow-dense" : ""
        }`}
      >
        <div className={reverse ? "lg:col-start-2" : ""}>
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 ${
            reverse ? "lg:col-start-1" : ""
          }`}
        >
          {partners.map((p, i) => (
            <LogoCard key={i} src={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ page ----------------------------- */

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50/30 to-white text-slate-900">
      {/* HERO - Enhanced with refined styling */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        {/* Ambient background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-50/60 via-green-50/40 to-transparent"></div>
        <div className="absolute right-0 top-0 h-125 w-125 rounded-full bg-linear-to-br from-emerald-100/30 to-green-100/20 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-4xl text-left">
          {/* Hero badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Our Partners
          </motion.div>

          {/* Enhanced hero heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
          >
            <span className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Trusted by the teams
            </span>
            <br />
            powering Africa&apos;s workforce.
          </motion.h1>

          {/* Enhanced description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl"
          >
            Banks. Corporates. Technology platforms.  
            We partner with the people who move money securely and at scale.
          </motion.p>
        </div>
      </section>

      {/* BANKS - Enhanced section */}
      <PartnerSection
        eyebrow="Banking"
        title="Financial institutions we work with"
        description="Secure rails, regulated infrastructure and trusted partners powering wage access."
        partners={bankingPartners}
      />

      {/* Visual separator with subtle gradient */}
      <div className="mx-auto h-px max-w-7xl bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

      {/* CORPORATES - Enhanced with reverse layout */}
      <PartnerSection
        eyebrow="Enterprise"
        title="Employers enabling financial wellbeing"
        description="Organisations using EaziWage to support employees with flexible pay access."
        partners={corporatePartners}
        reverse
      />

      {/* Visual separator */}
      <div className="mx-auto h-px max-w-7xl bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

      {/* TECH - Enhanced section */}
      <PartnerSection
        eyebrow="Technology"
        title="Built with modern infrastructure"
        description="Battle-tested tools helping us scale reliably and ship fast."
        partners={techPartners}
      />

      {/* CTA - Enhanced with refined card treatment */}
      <section className="px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Enhanced CTA card */}
          <div className="rounded-3xl border border-slate-200/60 bg-white p-10 shadow-xl shadow-slate-900/5 sm:p-12 lg:p-16">
            {/* CTA badge */}
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Partner With Us
              </div>
            </div>

            {/* Enhanced heading */}
            <h3 className="mb-6 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Want to partner with EaziWage?
            </h3>

            {/* Enhanced description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              We&apos;re always open to working with forward-thinking teams.
            </p>

            {/* Enhanced CTA button */}
            <Link
              href="/partners/onboarding"
              className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              Apply for Partnership
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}