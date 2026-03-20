"use client";

import React, { useRef, MouseEvent } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Code2, Palette, Sparkles, TrendingUp, Users, Zap, ChevronRight } from "lucide-react";
import Lottie from "lottie-react";
import Rocket from "@/public/Rocket.json";

const RevealText = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    viewport={{ once: true }}
    className="inline-block"
  >
    {text}
  </motion.span>
);

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

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
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
    <motion.div
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY }}
        className={`group relative h-full overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10 ${className}`}
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(400px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.06), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none"
        />
        {children}
        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function CareersPage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-white">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb color="bg-green-100" delay={0} className="top-[-10%] left-[10%]" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="bottom-[10%] right-[10%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      {/* Hero Section */}
      <motion.section 
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
          <Lottie animationData={Rocket} loop className="relative z-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
        >
          Careers launching <br/>
          <span className="text-green-600">soon</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-8 max-w-3xl text-xl leading-relaxed text-slate-500"
        >
          We&apos;re building something meaningful — tools that help people access their
          money faster. <br className="hidden lg:block"/>
          If you&apos;re sharp, curious, and allergic to mid work, you&apos;ll fit right in.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col items-center gap-6 sm:flex-row"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Want early access?</span>
          <Link
            href="mailto:support@eaziwage.com"
            className="group relative flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white shadow-2xl transition-all duration-300 hover:bg-green-600 hover:scale-105"
          >
            <span>support@eaziwage.com</span>
            <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.section>

      {/* Open Roles Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-8">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Open Roles
          </motion.div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            What we&apos;re <span className="text-green-600">building for</span>
          </h2>
          <p className="mt-6 mx-auto max-w-3xl text-xl text-slate-500">
            We&apos;re assembling a small, ambitious team. If you ship fast, think deeply, and care about impact — let&apos;s talk.
          </p>
        </div>

        <OpenRolesGrid />
      </section>

      {/* Why Join Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-8">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Why EaziWage
          </motion.div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            What you&apos;ll <span className="text-green-600">get here</span>
          </h2>
        </div>

        <PerksGrid />
      </section>
    </main>
  );
}

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
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
      {roles.map((role, index) => (
        <TiltCard key={role.title}>
          <div className="relative z-10">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
              <role.icon className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <h3 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 group-hover:text-green-700 transition-colors">
              {role.title}
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-slate-500">
              {role.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {role.tags.map((tag) => (
                <span key={tag} className="rounded-xl bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 ring-1 ring-inset ring-slate-200 group-hover:bg-green-600 group-hover:text-white group-hover:ring-green-600 transition-all duration-300">
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
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {perks.map((perk, index) => (
        <TiltCard key={perk.title} className="p-10">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition-transform duration-500 group-hover:scale-110">
              <perk.icon className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors">
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
