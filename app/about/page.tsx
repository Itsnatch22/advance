"use client";

import React, { useRef, MouseEvent, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ShieldCheck, Cpu, Users, Eye, Sparkles } from "lucide-react";
import { Team } from "@/components/Team";
import Image from "next/image";
import Typed from "typed.js";

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

const TiltAboutCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
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
    <motion.div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY }}
        className={`group relative h-full overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-10 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10 ${className}`}
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(400px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.06), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
        />
        {children}
        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Heartbeat", "Pulse", "Essence"],
      smartBackspace: true,
      cursorChar: "|",
      backDelay: 2000,
      typeSpeed: 100,
      backSpeed: 80,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-white">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingOrb color="bg-green-100" delay={0} className="top-[-10%] left-[10%]" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="top-[40%] right-[10%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      {/* ===== Hero ===== */}
      <motion.section 
        style={{ y: yHero, opacity: opacityHero }}
        className="relative overflow-hidden px-6 pt-32 pb-24 lg:pt-48 lg:pb-40"
      >
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2 lg:gap-32">
          <div className="text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Who We Are</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
            >
              The <span ref={typedRef} className="text-green-600 inline-block min-w-50" />
              <br /> 
              of Financial Freedom
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="max-w-xl text-xl leading-relaxed text-slate-500"
            >
              Empowering Africa&apos;s workforce to access what they&apos;ve
              earned - fairly, instantly, and securely.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-10 rounded-full bg-green-500/10 blur-3xl" />
            <Image
              width={600}
              height={450}
              src="/about/about.png"
              alt="Financial freedom illustration"
              className="relative w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200"
            />
            {/* Floating accent card */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 rounded-3xl border border-white/20 bg-white/40 p-6 backdrop-blur-2xl shadow-xl hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm font-bold text-slate-900">EaziWage ecosystem</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission & Vision Grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <TiltAboutCard>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Our Mission
            </div>
            <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
              Empowering Financial Freedom
            </h2>
            <p className="text-lg leading-relaxed text-slate-500">
              To empower employees and employers with a safe, transparent
              platform that provides early access to earned wages — reducing
              financial anxiety while strengthening workplace trust and
              productivity.
            </p>
          </TiltAboutCard>

          <TiltAboutCard>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Our Vision
            </div>
            <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
              Africa&apos;s Trusted Partner
            </h2>
            <p className="text-lg leading-relaxed text-slate-500">
              To be Africa&apos;s most trusted workplace finance partner —
              fostering financial wellness through innovation, transparency, and
              secure technology.
            </p>
          </TiltAboutCard>
        </div>
      </section>

      {/* ===== Our Story ===== */}
      <section className="relative overflow-hidden py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Our Journey
            </motion.div>
            <h2 className="font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
              Our <span className="text-green-600">Story</span>
            </h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative space-y-8 rounded-[3rem] border border-slate-200/60 bg-white p-12 shadow-2xl shadow-slate-900/5 backdrop-blur-3xl sm:p-16"
          >
            <p className="font-serif text-2xl leading-relaxed text-slate-700 italic">
              EaziWage was born from a simple truth: thousands of workers across
              Kenya and Africa face a financial gap before payday. Many turn to
              costly mobile loans — a cycle that creates stress, debt, and lost
              productivity.
            </p>

            <div className="h-px w-24 bg-green-500/30" />

            <p className="text-xl leading-relaxed text-slate-500">
              We built EaziWage to break that cycle. Our team of engineers and
              finance experts joined forces to craft a secure, scalable, and
              inclusive system that gives employees control over their earned
              income — backed by trusted banks and mobile money platforms.
            </p>
            
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-green-500/5 blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* ===== Core Values ===== */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-8">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            What Drives Us
          </motion.div>
          <h2 className="font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
            Our Core <span className="text-green-600">Values</span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Integrity",
              text: "We uphold security and transparency in every transaction.",
            },
            {
              icon: Cpu,
              title: "Innovation",
              text: "We harness technology to empower people and scale access.",
            },
            {
              icon: Users,
              title: "Accessibility",
              text: "Designed for everyone — employers, employees, and partners alike.",
            },
            {
              icon: Eye,
              title: "Transparency",
              text: "Clarity and visibility at every financial touchpoint.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <TiltAboutCard key={title} className="p-12 text-center items-center flex flex-col">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 group-hover:text-green-700 transition-colors">
                {title}
              </h3>
              <p className="text-base leading-relaxed text-slate-500">
                {text}
              </p>
            </TiltAboutCard>
          ))}
        </div>
      </section>

      <Team />
    </main>
  );
}