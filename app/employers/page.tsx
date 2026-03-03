"use client";

import React, { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  User,
  Wallet,
  Cog,
  LineChart,
  Lock,
  BadgeCheck,
  Clipboard,
  CircuitBoard,
  BrainCircuit,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AppleCardsCarouselDemo } from "@/components/Carousel";
import { ComplianceStrip } from "@/components/shared/ComplianceStrip";
import UI from "./UI";
import ROI from "@/components/ROI";
import Integrations from "@/components/Integrations";

const reasons = [
  {
    icon: User,
    title: "Improve retention",
    desc: "Reduce churn by supporting financial wellbeing—especially in hourly & shift roles.",
  },
  {
    icon: Wallet,
    title: "Payroll-integrated",
    desc: "Auto-deduct on payday with configurable limits and employer policies.",
  },
  {
    icon: Cog,
    title: "Fast rollout",
    desc: "Simple HRIS/Payroll mapping and sandbox to validate flows before go-live.",
  },
  {
    icon: BadgeCheck,
    title: "Zero balance-sheet loans",
    desc: "It's not a loan product. No lending, no interest, no debt on your books.",
  },
  {
    icon: Lock,
    title: "Granular controls",
    desc: "Role-based access, approvals, per-group limits, and time-bound restrictions.",
  },
  {
    icon: LineChart,
    title: "Actionable analytics",
    desc: "Adoption, usage, and impact dashboards for HR, Finance, and Operations.",
  },
];

const rolloutPlans = [
  {
    icon: Clipboard,
    title: "Sandbox",
    desc: "Map payroll fields, test auto-deductions, validate fee visibility.",
  },
  {
    icon: CircuitBoard,
    title: "Integrate",
    desc: "Connect HRIS/Payroll or CSV; set groups, roles & permissions.",
  },
  {
    icon: BrainCircuit,
    title: "Control",
    desc: "Define limits (% of earned wages), cool-offs, approvals & hours.",
  },
  {
    icon: BadgeCheck,
    title: "Launch",
    desc: "Brief managers, share staff onboarding link, monitor adoption.",
  },
];

const faqs = [
  {
    question: "How does Eaziwage integrate with our existing payroll system?",
    answer:
      "Eaziwage seamlessly integrates with most major payroll systems through secure APIs. We also support CSV uploads for manual payroll systems. Our integration team will work closely with your HR and IT departments to ensure a smooth setup process.",
  },
  {
    question:
      "What are the costs associated with implementing Eaziwage for our employees?",
    answer:
      "Eaziwage operates on a transparent pricing model with no hidden fees. Employers typically pay a nominal setup fee and a small transaction fee per withdrawal made by employees. There are no subscription fees or interest charges involved.",
  },
  {
    question:
      "How does Eaziwage ensure the security and privacy of employee data?",
    answer:
      "Eaziwage prioritizes data security and privacy. We comply with all relevant data protection regulations, including ODPC guidelines. Employee data is encrypted both in transit and at rest, and we implement strict access controls to ensure that only authorized personnel can access sensitive information.",
  },
  {
    question:
      "Can we customize the Eaziwage platform to align with our company policies?",
    answer:
      "Yes, Eaziwage offers a range of customization options to align with your company policies. You can set withdrawal limits, approval workflows, and define which employee groups have access to the service. Our platform is designed to be flexible to meet the unique needs of your organization.",
  },
];

const complianceItems = [
  { text: "Regulated partners • Regulatory compliant" },
  { text: "Data protection assured" },
  { text: "Transparent pricing (Flat fee + 5%)" },
  { text: "Auto-settlement via payroll" },
];

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

const TiltFeatureCard = ({ icon: Icon, title, desc, index }: { icon: any; title: string; desc: string; index: number }) => {
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY }}
        className="group relative h-full overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) => `radial-gradient(350px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.06), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
        />
        
        <div className="relative z-10">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm ring-1 ring-green-500/10 transition-transform duration-500 group-hover:scale-110">
            <Icon className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <h3 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          <p className="text-lg leading-relaxed text-slate-500">
            {desc}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

export default function Employers() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingOrb color="bg-green-100" delay={0} className="top-[-10%] right-[10%]" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="bottom-[-10%] left-[10%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <section className="relative z-10 py-12 lg:py-20">
        <UI />
        
        <ComplianceStrip
          items={complianceItems}
          className="my-16 border-y border-slate-200/60 bg-white/40 py-8 backdrop-blur-md"
        />

        {/* Why Employers Section */}
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>For Employers</span>
            </motion.div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Why employers <span className="text-green-600">choose</span> EaziWage
            </h2>
            <p className="mt-6 mx-auto max-w-3xl text-xl text-slate-500">
              A practical well-being lever that pays for itself. Zero cost, zero
              risk, zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((item, i) => (
              <TiltFeatureCard
                key={i}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                index={i}
              />
            ))}
          </div>
        </div>

        <ROI />

        {/* Rollout Section */}
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Implementation
            </motion.div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Employer <span className="text-green-600">rollout plan</span>
            </h2>
            <p className="mt-6 mx-auto max-w-3xl text-xl text-slate-500">
              From sandbox to go live in days, not months. We handle the heavy
              lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {rolloutPlans.map((item, j) => (
              <TiltFeatureCard
                key={j}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                index={j}
              />
            ))}
          </div>
        </div>

        <Integrations />

        {/* Versatility Section */}
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-16 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              Versatile Solution
            </motion.div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Works across <span className="text-green-600">sectors & sizes</span>
            </h2>
            <p className="mt-6 text-xl text-slate-500">
              Retail • Hospitality • Manufacturing • Logistics • Banks • Schools • Healthcare
            </p>
          </div>
          <AppleCardsCarouselDemo />
        </div>

        {/* FAQ Section */}
        <div className="mx-auto max-w-4xl px-6 py-32 lg:py-40">
          <div className="mb-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Support
            </motion.div>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Frequently Asked <span className="text-green-600">Questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-4xl border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl transition-all duration-500 ${
                  openIndex === index ? "shadow-2xl shadow-green-500/10 ring-1 ring-green-500/20" : "hover:bg-white"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${openIndex === index ? "text-green-700" : "text-slate-900"}`}>
                    {faq.question}
                  </span>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                    openIndex === index ? "bg-green-600 text-white rotate-90" : "bg-slate-100 text-slate-500 group-hover:bg-green-500 group-hover:text-white"
                  }`}>
                    <ArrowRight size={20} />
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="pt-8 mt-8 border-t border-slate-100">
                        <p className="text-lg leading-relaxed text-slate-500">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}