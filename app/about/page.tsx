"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Cpu, Users, Eye } from "lucide-react"
import gsap from "gsap"
import * as React from "react"
import { Team } from "@/components/Team"
import Image from "next/image"
export default function AboutPage() {
    const storyRef = React.useRef<HTMLDivElement>(null);
    const valuesRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        gsap.fromTo(storyRef.current, 
        {opacity: 0, y: -50}, 
        {opacity: 1, y: 0, duration: 1.2, ease: "power2.out"});

        gsap.fromTo(valuesRef.current, 
        {opacity: 0, y: 50}, 
        {opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.3});
    }, []);
    return(
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-800 dark:text-gray-200 transition-colors duration-500">
  {/* ===== Hero ===== */}
  <section className="relative overflow-hidden py-28 px-6">
  <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-500/10 to-transparent dark:from-green-700/30 dark:via-emerald-500/20 blur-3xl"></div>

  <div className="relative z-10 mx-auto max-w-7xl grid md:grid-cols-2 items-center gap-12">
    {/* Left: Text */}
    <div className="text-left">
      <motion.h1
        className="text-5xl md:text-6xl font-bold font-serif leading-tight bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        The Heartbeat of<br /> Financial Freedom
      </motion.h1>

      <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-md">
        Empowering Africa&apos;s workforce to access what they&apos;ve earned — fairly, instantly, and securely.
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
      <h2 className="text-3xl font-bold text-green-700 dark:text-emerald-400 mb-4 font-serif">Our Mission</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        To empower employees and employers with a safe, transparent platform that provides early access to earned wages —
        reducing financial anxiety while strengthening workplace trust and productivity.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-green-700 dark:text-emerald-400 mb-4 font-serif">Our Vision</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        To be Africa&apos;s most trusted workplace finance partner — fostering financial wellness through innovation,
        transparency, and secure technology.
      </p>
    </motion.div>
  </div>
</section>

  {/* ===== Our Story ===== */}
  <section className="bg-gray-50 dark:bg-neutral-900 py-24 px-6 text-center relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent dark:via-green-400/10"></div>

    <div className="max-w-4xl mx-auto relative z-10">
      <h2 className="text-3xl font-bold text-green-700 dark:text-emerald-400 mb-6 font-serif">Our Story</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-lg">
        EaziWage was born from a simple truth: thousands of workers across Kenya and Africa face a financial gap before payday.
        Many turn to costly mobile loans — a cycle that creates stress, debt, and lost productivity.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        We built EaziWage to break that cycle. Our team of engineers and finance experts joined forces to craft a secure,
        scalable, and inclusive system that gives employees control over their earned income — backed by trusted banks and
        mobile money platforms.
      </p>
    </div>
  </section>

  {/* ===== Core Values ===== */}
  <section className="max-w-7xl mx-auto py-24 px-6 text-center">
    <h2 className="text-3xl font-bold text-green-700 dark:text-emerald-400 mb-16 font-serif">Our Core Values</h2>
    <div className="grid md:grid-cols-4 gap-10">
      {[
        { icon: ShieldCheck, title: "Integrity", text: "We uphold security and transparency in every transaction." },
        { icon: Cpu, title: "Innovation", text: "We harness technology to empower people and scale access." },
        { icon: Users, title: "Accessibility", text: "Designed for everyone — employers, employees, and partners alike." },
        { icon: Eye, title: "Transparency", text: "Clarity and visibility at every financial touchpoint." },
      ].map(({ icon: Icon, title, text }) => (
        <motion.div
          key={title}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex flex-col items-center bg-white dark:bg-neutral-800 shadow-md hover:shadow-lg rounded-xl p-8 border border-gray-100 dark:border-neutral-700"
        >
          <Icon className="w-10 h-10 text-black dark:text-white mb-4" />
          <h3 className="font-semibold mb-2 text-lg text-black dark:text-white">{title}</h3>
          <p className="text-black dark:text-white text-sm">{text}</p>
        </motion.div>
      ))}
    </div>
  </section>
      <Team/>
</div>

    )
}