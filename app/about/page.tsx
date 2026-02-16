"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Users, Eye } from "lucide-react";
import gsap from "gsap";
import * as React from "react";
import { Team } from "@/components/Team";
import Image from "next/image";
import Typed from "typed.js";

export default function AboutPage() {
  const storyRef = React.useRef<HTMLDivElement>(null);
  const valuesRef = React.useRef<HTMLDivElement>(null);
  const typedRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    gsap.fromTo(
      storyRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
    );

    gsap.fromTo(
      valuesRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.3 }
    );

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
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50/30">
      {/* ===== Hero ===== */}
      {/* Enhanced: refined gradient overlay, improved spacing system, better contrast */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        {/* Refined gradient background with layered depth */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-50/60 via-green-50/40 to-transparent"></div>
        <div className="absolute right-0 top-0 h-125 w-125 rounded-full bg-linear-to-br from-emerald-100/30 to-green-100/20 blur-3xl"></div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: Text - improved typography scale and spacing */}
          <div className="text-left">
            <motion.h1
              className="bg-linear-to-r from-emerald-700 via-green-600 to-emerald-500 bg-clip-text font-serif text-5xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              The <span ref={typedRef} className="inline-block min-w-50" />
              of
              <br /> 
              Financial Freedom
            </motion.h1>

            {/* Enhanced subheading with better contrast and spacing */}
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
              Empowering Africa&apos;s workforce to access what they&apos;ve
              earned - fairly, instantly, and securely.
            </p>
          </div>

          {/* Right: Image - added card treatment with shadow depth */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Subtle glow effect behind image */}
              <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-emerald-100/50 to-green-100/30 blur-2xl"></div>
              <Image
                width={550}
                height={400}
                src="/about/about.png"
                alt="Financial freedom illustration"
                className="relative w-full max-w-md rounded-2xl shadow-2xl shadow-emerald-500/10 ring-1 ring-slate-900/5"
              />
            </div>
          </motion.div>

          {/* Mission card - elevated card design with better hierarchy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 lg:p-10"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Our Mission
            </div>
            <h2 className="mb-5 font-serif text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Empowering Financial Freedom
            </h2>
            <p className="text-base leading-relaxed text-slate-600 lg:text-lg">
              To empower employees and employers with a safe, transparent
              platform that provides early access to earned wages — reducing
              financial anxiety while strengthening workplace trust and
              productivity.
            </p>
          </motion.div>

          {/* Vision card - matching elevated treatment */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 lg:p-10"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Our Vision
            </div>
            <h2 className="mb-5 font-serif text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Africa&apos;s Trusted Partner
            </h2>
            <p className="text-base leading-relaxed text-slate-600 lg:text-lg">
              To be Africa&apos;s most trusted workplace finance partner —
              fostering financial wellness through innovation, transparency, and
              secure technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== Our Story ===== */}
      {/* Enhanced: layered card on subtle gradient, improved readability */}
      <section className="relative bg-linear-to-b from-slate-50 to-white px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Section badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Our Journey
            </div>
          </div>

          <h2 className="mb-8 text-center font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Our Story
          </h2>

          {/* Story content in elevated card */}
          <div className="space-y-6 rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10 lg:p-12">
            <p className="text-lg leading-relaxed text-slate-700 lg:text-xl lg:leading-relaxed">
              EaziWage was born from a simple truth: thousands of workers across
              Kenya and Africa face a financial gap before payday. Many turn to
              costly mobile loans — a cycle that creates stress, debt, and lost
              productivity.
            </p>

            <p className="text-lg leading-relaxed text-slate-700 lg:text-xl lg:leading-relaxed">
              We built EaziWage to break that cycle. Our team of engineers and
              finance experts joined forces to craft a secure, scalable, and
              inclusive system that gives employees control over their earned
              income — backed by trusted banks and mobile money platforms.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Core Values ===== */}
      {/* Enhanced: refined card system, better hover states, improved visual hierarchy */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        {/* Section badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            What Drives Us
          </div>
        </div>

        <h2 className="mb-16 text-center font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Our Core Values
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Integrity",
              text: "We uphold security and transparency in every transaction.",
              color: "emerald",
            },
            {
              icon: Cpu,
              title: "Innovation",
              text: "We harness technology to empower people and scale access.",
              color: "green",
            },
            {
              icon: Users,
              title: "Accessibility",
              text: "Designed for everyone — employers, employees, and partners alike.",
              color: "teal",
            },
            {
              icon: Eye,
              title: "Transparency",
              text: "Clarity and visibility at every financial touchpoint.",
              color: "emerald",
            },
          ].map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative flex flex-col items-start overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:border-emerald-200/80 hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-50/0 via-green-50/0 to-emerald-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* Icon with accent background */}
              <div className="relative z-10 mb-5 inline-flex rounded-xl bg-linear-to-br from-emerald-50 to-green-50 p-3 ring-1 ring-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-7 w-7 text-emerald-600" strokeWidth={2} />
              </div>

              {/* Content */}
              <h3 className="relative z-10 mb-3 text-xl font-bold tracking-tight text-slate-900">
                {title}
              </h3>
              <p className="relative z-10 text-sm leading-relaxed text-slate-600">
                {text}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:w-full"></div>
            </motion.div>
          ))}
        </div>
      </section>

      <Team />
    </div>
  );
}