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
    <div className="min-h-screen bg-white text-gray-800 transition-colors duration-500 dark:bg-neutral-950 dark:text-gray-200">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden px-6 py-28">
        <div className="absolute inset-0 bg-blue-100/100 blur-3xl dark:bg-black"></div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          {/* Left: Text */}
          <div className="text-left">
            <motion.h1
              className="bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text font-serif text-5xl leading-tight font-bold text-transparent md:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              The <span ref={typedRef} />
              of
              <br /> Financial Freedom
            </motion.h1>

            <p className="mt-6 max-w-md text-lg text-gray-600 md:text-xl dark:text-gray-300">
              Empowering Africa&apos;s workforce to access what they&apos;ve
              earned — fairly, instantly, and securely.
            </p>
          </div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center md:justify-end"
          >
            <Image
              width={550}
              height={400}
              src="/about/about.png"
              alt="Financial freedom illustration"
              className="w-full max-w-md rounded-2xl shadow-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 font-serif text-3xl font-bold text-green-700 dark:text-emerald-400">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              To empower employees and employers with a safe, transparent
              platform that provides early access to earned wages — reducing
              financial anxiety while strengthening workplace trust and
              productivity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 font-serif text-3xl font-bold text-green-700 dark:text-emerald-400">
              Our Vision
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              To be Africa&apos;s most trusted workplace finance partner —
              fostering financial wellness through innovation, transparency, and
              secure technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== Our Story ===== */}
      <section className="relative bg-gray-50 px-6 py-24 text-center dark:bg-neutral-900">
        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-6 font-serif text-3xl font-bold text-green-700 sm:text-4xl md:text-5xl lg:text-6xl dark:text-emerald-400">
            Our Story
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            EaziWage was born from a simple truth: thousands of workers across
            Kenya and Africa face a financial gap before payday. Many turn to
            costly mobile loans — a cycle that creates stress, debt, and lost
            productivity.
          </p>

          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            We built EaziWage to break that cycle. Our team of engineers and
            finance experts joined forces to craft a secure, scalable, and
            inclusive system that gives employees control over their earned
            income — backed by trusted banks and mobile money platforms.
          </p>
        </div>
      </section>

      {/* ===== Core Values ===== */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h2 className="mb-16 font-serif text-3xl font-bold text-green-700 sm:text-4xl md:text-5xl lg:text-6xl dark:text-emerald-400">
          Our Core Values
        </h2>
        <div className="grid gap-10 md:grid-cols-4">
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
            <motion.div
              key={title}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center rounded-xl border border-gray-100 bg-gradient-to-b from-transparent via-green-500/5 to-transparent p-8 shadow-md hover:shadow-lg dark:border-neutral-700 dark:via-green-400/10"
            >
              <Icon className="mb-4 h-10 w-10 text-black dark:text-white" />
              <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-black dark:text-white">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Team />
    </div>
  );
}
