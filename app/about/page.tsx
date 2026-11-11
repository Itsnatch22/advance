"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Users, Eye, Sparkles } from "lucide-react";
import { Team } from "@/components/Team";
import Image from "next/image";
import Typed from "typed.js";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { useParallax } from "@/hooks/use-parallax";

const TiltAboutCard = ({
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
        className={`group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-900/5 sm:p-8 ${className}`}
      >
        <motion.div
          style={{
            background: spotlightBackground,
          }}
          className="pointer-events-none absolute inset-0 rounded-2xl"
        />
        {children}
        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function AboutPage() {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = typedRef.current;
    if (!el) return;
    // Guard against React Strict Mode's dev-only double-invoke of effects:
    // if a previous instance's destroy() hasn't fully flushed before this
    // one initializes, its cursor element can end up stripped from the DOM.
    // Clearing the node first guarantees a clean slate either way.
    el.innerHTML = "";
    const typed = new Typed(el, {
      strings: ["Heartbeat", "Pulse", "Essence"],
      smartBackspace: true,
      backDelay: 2000,
      typeSpeed: 100,
      backSpeed: 80,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative z-10">
        <div className="pointer-events-none absolute inset-0">
          <FloatingOrb
            color="bg-green-100"
            delay={0}
            className="top-[-10%] left-[10%]"
          />
          <FloatingOrb
            color="bg-emerald-100"
            delay={2}
            className="top-[40%] right-[10%]"
          />
        </div>

        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
              >
                <Sparkles size={14} className="animate-pulse" />
                <span>Who We Are</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
              >
                The{" "}
                <span
                  ref={typedRef}
                  className="inline-block min-w-44 text-green-600"
                />
                <br />
                of Financial Freedom
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
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
              <div className="absolute -inset-6 rounded-full bg-green-500/10 blur-3xl" />
              <Image
                width={600}
                height={450}
                src="/about/about.png"
                alt="Financial freedom illustration"
                className="relative w-full max-w-lg rounded-2xl shadow-xl ring-1 shadow-slate-900/10 ring-slate-200"
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-5 -left-5 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                  <p className="text-sm font-bold text-slate-900">
                    EaziWage ecosystem
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            <TiltAboutCard>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Our Mission
              </div>
              <h2 className="mb-4 font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Empowering Financial Freedom
              </h2>
              <p className="text-base leading-relaxed text-slate-600">
                To empower employees and employers with a safe, transparent
                platform that provides early access to earned wages — reducing
                financial anxiety while strengthening workplace trust and
                productivity.
              </p>
            </TiltAboutCard>

            <TiltAboutCard>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Our Vision
              </div>
              <h2 className="mb-4 font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Africa&apos;s Trusted Partner
              </h2>
              <p className="text-base leading-relaxed text-slate-600">
                To be Africa&apos;s most trusted workplace finance partner —
                fostering financial wellness through innovation, transparency,
                and secure technology.
              </p>
            </TiltAboutCard>
          </div>
        </section>

        <section className="relative overflow-hidden py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
                Our Journey
              </motion.div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Our <span className="text-green-600">Story</span>
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <p className="font-serif text-xl leading-relaxed text-slate-700 italic sm:text-2xl">
                EaziWage was born from a simple truth: thousands of workers
                across Kenya and Africa face a financial gap before payday. Many
                turn to costly mobile loans — a cycle that creates stress, debt,
                and lost productivity.
              </p>

              <div className="h-px w-24 bg-green-500/30" />

              <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                We built EaziWage to break that cycle. Our team of engineers and
                finance experts joined forces to craft a secure, scalable, and
                inclusive system that gives employees control over their earned
                income — backed by trusted banks and mobile money platforms.
              </p>

              <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/5 blur-3xl" />
            </motion.div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mb-10 text-center sm:mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
              What Drives Us
            </motion.div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Our Core <span className="text-green-600">Values</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <TiltAboutCard
                key={title}
                className="flex flex-col items-center p-5 text-center sm:p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-green-600">
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
      </div>
    </section>
  );
}
