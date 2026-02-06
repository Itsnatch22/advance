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
  "/partners/mpesa.svg",
  "/partners/supabase.svg",
  "/partners/aws.svg",
  "/partners/resend.svg",
  "/partners/visa.svg"
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
    <div className="max-w-2xl space-y-4">
      <p className="text-sm font-medium tracking-wide text-emerald-600 dark:text-white uppercase">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
        {title}
      </h2>

      <p className="text-neutral-600 dark:text-white">{description}</p>
    </div>
  );
}

/* calm premium logo card */
function LogoCard({ src }: { src: string }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <Image
        src={src}
        alt="partner logo"
        width={120}
        height={40}
        className="h-10 w-auto object-contain opacity-80"
      />
    </div>
  );
}

/* reusable section */
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
    <section className="py-28">
      <div
        className={`mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-12 ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-5 sm:grid-cols-3"
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
    <main className="bg-gray-50 py-16 dark:bg-black text-neutral-900 dark:text-white">
      {/* HERO */}
      <section className="py-32">
        <div className="mx-auto max-w-4xl px-6 text-left lg:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            <span className="text-green-600">Trusted by the teams</span>
            <br />
            powering Africa&apos;s workforce.
          </motion.h1>

          <p className="mt-6 max-w-xl text-neutral-600 dark:text-white">
            Banks. Corporates. Technology platforms.  
            We partner with the people who move money securely and at scale.
          </p>
        </div>
      </section>

      {/* BANKS */}
      <PartnerSection
        eyebrow="Banking"
        title="Financial institutions we work with"
        description="Secure rails, regulated infrastructure and trusted partners powering wage access."
        partners={bankingPartners}
      />

      {/* CORPORATES (layout rhythm change) */}
      <PartnerSection
        eyebrow="Enterprise"
        title="Employers enabling financial wellbeing"
        description="Organisations using EaziWage to support employees with flexible pay access."
        partners={corporatePartners}
        reverse
      />

      {/* TECH */}
      <PartnerSection
        eyebrow="Technology"
        title="Built with modern infrastructure"
        description="Battle-tested tools helping us scale reliably and ship fast."
        partners={techPartners}
      />

      {/* CTA */}
      <section className="py-32 text-center">
        <div className="mx-auto max-w-2xl space-y-6 px-6">
          <h3 className="font-serif text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Want to partner with EaziWage?
          </h3>

          <p className="text-neutral-600 dark:text-white">
            We&apos;re always open to working with forward-thinking teams.
          </p>

          <Link
            href="/partners/onboarding"
            className="inline-block rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            Apply for Partnership
          </Link>
        </div>
      </section>
    </main>
  );
}