"use client";

import React, { useRef, MouseEvent } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Building2, Cpu } from "lucide-react";

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
  "/partners/mayfair.svg",
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
  "/partners/mpesa.svg",
];

/* -------------------------- components -------------------------- */

const FloatingOrb = ({ color, delay, className }: { color: string; delay: number; className?: string }) => (
  <motion.div
    animate={{
      y: [0, -40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 10 + Math.random() * 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={`absolute h-125 w-125 rounded-full blur-[120px] opacity-20 ${color} ${className}`}
  />
);

const TiltLogoCard = ({ src }: { src: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <motion.div style={{ perspective: 1000 }} className="h-28">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY }}
        className="group relative flex h-full items-center justify-center rounded-2xl border border-slate-200/60 bg-white/50 p-6 backdrop-blur-xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(200px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.08), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none"
        />
        
        <Image
          src={src}
          alt="partner logo"
          width={120}
          height={40}
          className="relative z-10 h-10 w-auto object-contain opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

function SectionHeader({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description: string; icon: any }) {
  return (
    <div className="max-w-xl space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
      >
        <Icon size={14} className="animate-pulse" />
        <span>{eyebrow}</span>
      </motion.div>

      <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
        {title}
      </h2>

      <p className="text-xl leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

function PartnerSection({ eyebrow, title, description, partners, icon, reverse = false }: { eyebrow: string; title: string; description: string; partners: string[]; icon: any; reverse?: boolean }) {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className={`mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center lg:px-8 ${reverse ? "lg:grid-flow-dense" : ""}`}>
        <div className={reverse ? "lg:col-start-2" : ""}>
          <SectionHeader eyebrow={eyebrow} title={title} description={description} icon={icon} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 ${reverse ? "lg:col-start-1" : ""}`}
        >
          {partners.map((p, i) => (
            <TiltLogoCard key={i} src={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------ page ----------------------------- */

export default function PartnersPage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-white text-slate-900">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb color="bg-green-100" delay={0} className="top-[-10%] left-[10%]" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="top-[30%] right-[5%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      {/* HERO */}
      <motion.section 
        style={{ y: yHero, opacity: opacityHero }}
        className="relative overflow-hidden px-6 pt-40 pb-32 lg:pt-56 lg:pb-48"
      >
        <div className="relative z-10 mx-auto max-w-5xl text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Our Partners
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
          >
            <span className="text-green-600">Trusted by the teams</span>
            <br />
            powering Africa&apos;s workforce.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-500"
          >
            Banks. Corporates. Technology platforms. <br className="hidden lg:block"/>
            We partner with the people who move money securely and at scale.
          </motion.p>
        </div>
      </motion.section>

      {/* BANKS */}
      <PartnerSection
        eyebrow="Banking"
        title="Financial institutions we work with"
        description="Secure rails, regulated infrastructure and trusted partners powering wage access."
        partners={bankingPartners}
        icon={ShieldCheck}
      />

      {/* Visual separator */}
      <div className="mx-auto h-px max-w-7xl bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

      {/* CORPORATES */}
      <PartnerSection
        eyebrow="Enterprise"
        title="Employers enabling financial wellbeing"
        description="Organisations using EaziWage to support employees with flexible pay access."
        partners={corporatePartners}
        icon={Building2}
        reverse
      />

      {/* Visual separator */}
      <div className="mx-auto h-px max-w-7xl bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

      {/* TECH */}
      <PartnerSection
        eyebrow="Technology"
        title="Built with modern infrastructure"
        description="Battle-tested tools helping us scale reliably and ship fast."
        partners={techPartners}
        icon={Cpu}
      />

      {/* CTA */}
      <section className="px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[3rem] border border-slate-200/60 bg-white p-12 text-center backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-green-500/10 lg:p-24"
          >
            <div className="absolute inset-0 bg-linear-to-br from-green-50/20 via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative z-10">
              <div className="mb-10 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Partner With Us
                </div>
              </div>

              <h3 className="mb-8 font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Want to partner with <span className="text-green-600">EaziWage?</span>
              </h3>

              <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-500">
                We&apos;re always open to working with forward-thinking teams.
              </p>

              <Link
                href="/partners/onboarding"
                className="group relative inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-10 py-5 font-bold text-white shadow-2xl transition-all duration-300 hover:bg-green-600 hover:scale-105 hover:shadow-green-500/25"
              >
                <span>Apply for Partnership</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
